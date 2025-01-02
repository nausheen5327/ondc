import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Grid,
    Step,
    StepLabel,
    Stepper,
    Typography,
    Skeleton,
    Stack, 
    IconButton
} from "@mui/material";
import { CustomStepperStyled } from "./CustomStepper";
import { EventSourcePolyfill } from 'event-source-polyfill';
import {
    OrderDetailBox,
    HeadingBox,
    OrderDetailGrid,
    StepBox
} from "./Tracking.style";
import MapComponent from "../restaurant-details/google-address/MapComponent";
import { useTranslation } from "react-i18next";
import {
    CustomPaperBigCard,
    CustomStackFullWidth
} from "@/styled-components/CustomStyles.style";
import CustomFormatedTime from "../date/CustomFormatedTime";
import DeliverymanInfo from "./DeliverymanInfo";
import DeliverymanShimmer from "./DeliverymanShimmer";
import SimpleBar from "simplebar-react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { RTL } from "../RTL/RTL";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import { useGeolocated } from "react-geolocated";
import { postCall } from "@/api/MainApi";
import { CustomToaster } from "../custom-toaster/CustomToaster";
import { getValueFromCookie } from "@/utils/cookies";
import { useRouter } from "next/router";

const TrackingPage = ({OrderData}) => {
    const [actStep, setActStep] = useState(1);
    const [rerenderMap, setRerenderMap] = useState(false);
    const { t } = useTranslation();
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
    const [trakingDetails, setTrakingDetails] = useState(null);
    // const [OrderData, setOrderData] = useState(null);
    // ONDC Status mapping
    const orderStates = {
        "Created": 1,
        "Accepted": 2,
        "In-progress": 3,
        "Picked": 4,
        "Delivered": 5
    };

    // Define steps based on ONDC status
    const steps = [
        {
            label: "Order placed",
            time: OrderData?.order?.createdAt
        },
        {
            label: "Order Confirmed",
            time: OrderData?.order?.fulfillments[0]?.start?.time?.range?.start
        },
        {
            label: "Preparing Order",
            time: null // Update based on order state transitions
        },
        {
            label: "Order is on the way",
            time: null
        },
        {
            label: "Delivered",
            time: OrderData?.order?.fulfillments[0]?.end?.time?.range?.end
        }
    ];

    useEffect(() => {
        // Set active step based on order state
        const currentState = OrderData?.order?.state || "Created";
        setActStep(orderStates[currentState] || 1);
    }, [OrderData]);

    const [userLocation, setUserLocation] = useState({
        lat: "28.77",
        lng: "77.01",
    });
        const [resLocation, setResLocation] = useState({
            lat: "28.45",
            lng: "77.99",
        });
    useEffect(() => {
        // Extract coordinates from fulfillment end location
        const deliveryLocation = OrderData?.order?.fulfillments[0]?.end?.location;
        if (deliveryLocation?.gps) {
            const [lat, lng] = deliveryLocation.gps.split(",").map(coord => parseFloat(coord.trim()));
            setUserLocation({
                lat,
                lng
            });
        }
    }, [OrderData]);

   

    const { coords, isGeolocationAvailable, isGeolocationEnabled } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: false,
            },
            userDecisionTimeout: 5000,
            isGeolocationEnabled: true,
        });

    const setUserCurrentLocation = () => {
        if (coords) {
            setUserLocation({
                lat: coords.latitude,
                lng: coords.longitude
            });
            setRerenderMap(prev => !prev);
        }
    };

    const [languageDirection, setLanguageDirection] = useState("ltr");
    useEffect(() => {
        if (localStorage.getItem("direction")) {
            setLanguageDirection(localStorage.getItem("direction"));
        }
    }, []);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const [trackOrderLoading, setTrackOrderLoading] = useState(false);
  const trackOrderRef = useRef(null);
  const trackEventSourceResponseRef = useRef(null);
    const eventTimeOutRef = useRef([]);
    const router = useRouter();
    const { orderId, phone, isTrackOrder } = router.query;

// const getItemDetails = async () => {
//     try {
//       const url = `/clientApis/v2/orders/${orderId}`;
//       const res = await getCall(url);
//       setOrderData(res[0]);
//       await getIssue(res[0]?.parentOrderId);
//     } catch (error) {
//       console.log("Error fetching item:", error);
//     }
//   };


    async function handleFetchTrackOrderDetails() {
        trackEventSourceResponseRef.current = [];
        setTrackOrderLoading(true);
        const transaction_id = OrderData?.transactionId;
        const bpp_id = OrderData?.bppId;
        const order_id = OrderData?.id;
        try {
          const data = await 
            postCall("/clientApis/v2/track", [
              {
                context: {
                  transaction_id,
                  bpp_id,
                },
                message: {
                  order_id,
                },
              },
            ]);
          fetchTrackingDataThroughEvents(data[0]?.context?.message_id);
        } catch (err) {
          setTrackOrderLoading(false);
          CustomToaster('error',err?.message);
        }
      }


       // use this function to fetch tracking info through events
  function fetchTrackingDataThroughEvents(message_id) {
    const token = getValueFromCookie("token");
    let header = {
      headers: {
        ...(token && {
          Authorization: `Bearer ${token}`,
        }),
      },
    };
    let es = new EventSourcePolyfill(
      `${process.env.NEXT_PUBLIC_BASE_URL}clientApis/events?messageId=${message_id}`,
      header
    );
    es.addEventListener("on_track", (e) => {
      const { messageId } = JSON.parse(e?.data);
      getTrackOrderDetails(messageId);
    });

    const timer = setTimeout(() => {
      es.close();
      if (trackEventSourceResponseRef.current.length <= 0) {
        CustomToaster("error",
          "Cannot proceed with you request now! Please try again"
        );
        setTrackOrderLoading(false);
      }
    }, 20000);

    eventTimeOutRef.current = [
      ...eventTimeOutRef.current,
      {
        eventSource: es,
        timer,
      },
    ];
  }


  // on track order
  async function getTrackOrderDetails(message_id) {
    try {
      const data = await 
        getCall(`/clientApis/v2/on_track?messageIds=${message_id}`);
      setTrackOrderLoading(false);
      trackEventSourceResponseRef.current = [
        ...trackEventSourceResponseRef.current,
        data[0],
      ];
      const { message } = data[0];
      if (message.tracking.status === "active" && message.tracking.url === "") {
        onUpdateTrakingDetails(null);
        setTrackOrderLoading(false);
        CustomToaster("error",
          "Tracking information is not provided by the provider."
        );
        return;
      } else if (message?.tracking?.url === "") {
        onUpdateTrakingDetails(null);
        setTrackOrderLoading(false);
        CustomToaster("error",
          "Tracking information not available for this product"
        );
        return;
      } else if (
        message.tracking.status === "active" &&
        message?.tracking?.url
      ) {
        console.log("message?.tracking?.url=====>", message?.tracking?.url);
        setTrackOrderLoading(false);
        trackOrderRef.current.href = message?.tracking?.url;
        trackOrderRef.current.target = "_blank";
        trackOrderRef.current.click();
        onUpdateTrakingDetails(null);
      } else if (
        message.tracking.status === "active" &&
        message?.tracking?.location?.gps
      ) {
        onUpdateTrakingDetails(message?.tracking);
      } else {
        onUpdateTrakingDetails(null);
        setTrackOrderLoading(false);
        CustomToaster("error",
          "Tracking information is not provided by the provider."
        );
        return;
      }
    } catch (err) {
      setTrackOrderLoading(false);
      CustomToaster("error",err?.message);
      eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
        eventSource.close();
        clearTimeout(timer);
      });
    }
  }

  const onUpdateTrakingDetails=(data)=>{
        setTrakingDetails(data);
  }
 

  useEffect(()=>{
     if(OrderData)handleFetchTrackOrderDetails();
  },[OrderData])
console.log("order details ",orderId);

//   useEffect(() => {
//       if (orderId) {
//         console.log("order id ",orderId)
//         getItemDetails();
//       }
//     }, [orderId]);


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <RTL direction={languageDirection}>
            <CustomStackFullWidth>
                <Grid container item md={12} xs={12} mb="1rem">
                    <Grid item md={12} xs={12}>
                        <SimpleBar style={{ height: isSmall ? "120px" : "150px" }}>
                            <RTL>
                                <StepBox>
                                    <CustomStepperStyled activeStep={actStep} alternativeLabel>
                                        {steps.map((label, index) => (
                                            <Step key={index}>
                                                <StepLabel>
                                                    <Typography>{t(label.label)}</Typography>
                                                    {OrderData ? (
                                                        <Typography 
                                                            fontSize={{ xs: "10px", sm: "12px" }}
                                                            color={theme.palette.neutral[600]}
                                                        >
                                                            {label.time && (
                                                                <CustomFormatedTime date={label.time} />
                                                            )}
                                                        </Typography>
                                                    ) : (
                                                        <Skeleton variant="text" />
                                                    )}
                                                </StepLabel>
                                            </Step>
                                        ))}
                                    </CustomStepperStyled>
                                </StepBox>
                            </RTL>
                        </SimpleBar>
                    </Grid>

                   {trakingDetails&& <Grid item md={12} xs={12} p="1.4rem" sx={{ position: "relative" }}>
                        <MapComponent
                            key={rerenderMap}
                            isRestaurant={true}
                            latitude={resLocation?.lat}
                            longitude={resLocation?.lng}
                            userLat={userLocation?.lat}
                            userLong={userLocation?.lng}
                        />
                        <IconButton
                            sx={{
                                background: theme => theme.palette.neutral[100],
                                padding: "10px",
                                position: "absolute",
                                bottom: "30px",
                                right: "30px",
                            }}
                            onClick={setUserCurrentLocation}
                        >
                            <GpsFixedIcon color="primary" />
                        </IconButton>
                    </Grid>}

                    {OrderData?.order?.fulfillments?.[0]?.type === "Delivery" && (
                        <Grid item md={12} xs={12} align="center" p="1.4rem">
                            {data ? (
                                data?.order?.fulfillments?.[0]?.agent ? (
                                    <DeliverymanInfo 
                                        data={{
                                            delivery_man: {
                                                name: data?.order?.fulfillments?.[0]?.agent?.name,
                                                image: "", // Add agent image if available
                                                contact: data?.order?.fulfillments?.[0]?.agent?.phone
                                            }
                                        }} 
                                    />
                                ) : (
                                    <Typography>
                                        {t("Delivery agent has not been assigned")}
                                    </Typography>
                                )
                            ) : (
                                <DeliverymanShimmer />
                            )}
                        </Grid>
                    )}
                </Grid>
            </CustomStackFullWidth>
        </RTL>
    );
};

export default TrackingPage;