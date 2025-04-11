// import React, { useState, useEffect, useRef } from "react";
// import {
//   Box,
//   Grid,
//   Step,
//   StepLabel,
//   Stepper,
//   Typography,
//   Skeleton,
//   Stack,
//   IconButton,
// } from "@mui/material";
// import { CustomStepperStyled } from "./CustomStepper";
// import { EventSourcePolyfill } from "event-source-polyfill";
// import {
//   OrderDetailBox,
//   HeadingBox,
//   OrderDetailGrid,
//   StepBox,
// } from "./Tracking.style";
// import MapComponent from "../restaurant-details/google-address/MapComponent";
// import { useTranslation } from "react-i18next";
// import {
//   CustomPaperBigCard,
//   CustomStackFullWidth,
// } from "@/styled-components/CustomStyles.style";
// import CustomFormatedTime from "../date/CustomFormatedTime";
// import DeliverymanInfo from "./DeliverymanInfo";
// import DeliverymanShimmer from "./DeliverymanShimmer";
// import SimpleBar from "simplebar-react";
// import { useTheme } from "@mui/material/styles";
// import useMediaQuery from "@mui/material/useMediaQuery";
// import { RTL } from "../RTL/RTL";
// import GpsFixedIcon from "@mui/icons-material/GpsFixed";
// import { useGeolocated } from "react-geolocated";
// import { getCall, postCall } from "@/api/MainApi";
// import { CustomToaster } from "../custom-toaster/CustomToaster";
// import { getValueFromCookie } from "@/utils/cookies";
// import { useRouter } from "next/router";
// import DeliveryMap from "./DeliveryMap";

// const TrackingPage = ({ OrderData }) => {
//   const [actStep, setActStep] = useState(1);
//   const [rerenderMap, setRerenderMap] = useState(false);
//   const { t } = useTranslation();
//   const theme = useTheme();
//   const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
//   const [trakingDetails, setTrakingDetails] = useState(null);
//   const [restaurantLocation, setRestaurantLocation] = useState(null);
//   const [customerLocation, setCustomerLocation] = useState(null);
//   console.log("Order data hhhhhhhhhhhhhhhhhhhhhhhh", OrderData?.order);
  
//   useEffect(() => {
    
//     try {
//       // Get order details from localStorage
//       const orderDetails = JSON.parse(localStorage.getItem('orderDetails'));

//       if (orderDetails?.message?.order?.fulfillments?.[0]) {
//         // Extract restaurant location
//         const startLocation = orderDetails?.message?.order?.fulfillments[0]?.start?.location;
//         const startGps = startLocation?.gps?.split(',');
//         setRestaurantLocation({
//           lat:Number(startGps[0]),
//           lng: Number(startGps[1])
//         });

//         // Extract customer location
//         const endLocation = orderDetails?.message?.order?.fulfillments[0]?.end?.location;
//         const endGps = endLocation?.gps?.split(',');
//         setCustomerLocation({
//           lat: Number(endGps[0]),
//           lng: Number(endGps[1])
//         })
//       }
//     } catch (error) {
//       console.error('Error fetching location details:', error);
//     }
//   }, []);
//   // const [OrderData, setOrderData] = useState(null);
//   // ONDC Status mapping
//   const orderStates = {
//     Created: 1,
//     Accepted: 2,
//     "In-progress": 3,
//     Picked: 4,
//     Completed: 5,
//   };

//   // Define steps based on ONDC status
//   const steps = [
//     {
//       label: "Order placed",
//       time: OrderData?.fulfillmentHistory?.createdAt,
//     },
//     {
//       label: "Order Confirmed",
//       time: OrderData?.fulfillmentHistory?.createdA,
//     },
//     {
//       label: "Preparing Order",
//       time: OrderData?.fulfillmentHistory?.createdA, // Update based on order state transitions
//     },
//     {
//       label: "Order is on the way",
//       time: OrderData?.fulfillmentHistory?.createdA,
//     },
//     {
//       label: "Delivered",
//       time: OrderData?.fulfillmentHistory?.createdA,
//     },
//   ];

//   useEffect(() => {
//     // Set active step based on order state
//     let orderHistoryLen = OrderData?.orderHistory?.length
//     const currentState = OrderData?.orderHistory[orderHistoryLen-1]?.state;

//     setActStep(orderStates[currentState] || 1);
//   }, [OrderData]);

//   const [userLocation, setUserLocation] = useState({
//     lat: "28.77",
//     lng: "77.01",
//   });
//   const [resLocation, setResLocation] = useState({
//     lat: "28.45",
//     lng: "77.99",
//   });
//   useEffect(() => {
//     // Extract coordinates from fulfillment end location
//     const deliveryLocation = OrderData?.order?.fulfillments[0]?.end?.location;
//     if (deliveryLocation?.gps) {
//       const [lat, lng] = deliveryLocation.gps
//         .split(",")
//         .map((coord) => parseFloat(coord.trim()));
//       setUserLocation({
//         lat,
//         lng,
//       });
//     }
//   }, [OrderData]);

//   const {
//     coords,
//     isGeolocationAvailable,
//     isGeolocationEnabled,
//   } = useGeolocated({
//     positionOptions: {
//       enableHighAccuracy: false,
//     },
//     userDecisionTimeout: 5000,
//     isGeolocationEnabled: true,
//   });

//   const setUserCurrentLocation = () => {
//     if (coords) {
//       setUserLocation({
//         lat: coords.latitude,
//         lng: coords.longitude,
//       });
//       setRerenderMap((prev) => !prev);
//     }
//   };

//   const [languageDirection, setLanguageDirection] = useState("ltr");
//   useEffect(() => {
//     if (localStorage.getItem("direction")) {
//       setLanguageDirection(localStorage.getItem("direction"));
//     }
//   }, []);

//   /////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   const [trackOrderLoading, setTrackOrderLoading] = useState(false);
//   const trackOrderRef = useRef(null);
//   const trackEventSourceResponseRef = useRef(null);
//   const eventTimeOutRef = useRef([]);
//   const router = useRouter();
//   const { orderId, phone, isTrackOrder } = router.query;

//   // const getItemDetails = async () => {
//   //     try {
//   //       const url = `/clientApis/v2/orders/${orderId}`;
//   //       const res = await getCall(url);
//   //       setOrderData(res[0]);
//   //       await getIssue(res[0]?.parentOrderId);
//   //     } catch (error) {
//   //       console.log("Error fetching item:", error);
//   //     }
//   //   };

//   async function handleFetchTrackOrderDetails() {
//     trackEventSourceResponseRef.current = [];
//     setTrackOrderLoading(true);
//     const transaction_id = OrderData?.transactionId;
//     const bpp_id = OrderData?.bppId;
//     const order_id = OrderData?.id;
//     try {
//       const data = await postCall("/clientApis/v2/track", [
//         {
//           context: {
//             transaction_id,
//             bpp_id,
//           },
//           message: {
//             order_id,
//           },
//         },
//       ]);
//       fetchTrackingDataThroughEvents(data[0]?.context?.message_id);
//     } catch (err) {
//       setTrackOrderLoading(false);
//       // CustomToaster("error", "Unable to fetch tracking data");
//     }
//   }

//   // use this function to fetch tracking info through events
//   function fetchTrackingDataThroughEvents(message_id) {
//     const token = getValueFromCookie("token");
//     let header = {
//       headers: {
//         ...(token && {
//           Authorization: `Bearer ${token}`,
//         }),
//       },
//     };
//     let es = new EventSourcePolyfill(
//       `${process.env.NEXT_PUBLIC_BASE_URL}/clientApis/events?messageId=${message_id}`,
//       header
//     );
//     es.addEventListener("on_track", (e) => {
//       const { messageId } = JSON.parse(e?.data);
//       getTrackOrderDetails(messageId);
//     });

//     const timer = setTimeout(() => {
//       es.close();
//       if (trackEventSourceResponseRef.current.length <= 0) {
//         // CustomToaster(
//         //   "error",
//         //   "Cannot proceed with you request now! Please try again"
//         // );
//         setTrackOrderLoading(false);
//       }
//     }, 20000);

//     eventTimeOutRef.current = [
//       ...eventTimeOutRef.current,
//       {
//         eventSource: es,
//         timer,
//       },
//     ];
//   }

//   // on track order
//   async function getTrackOrderDetails(message_id) {
//     try {
//       const data = await getCall(
//         `/clientApis/v2/on_track?messageIds=${message_id}`
//       );
//       setTrackOrderLoading(false);
//       trackEventSourceResponseRef.current = [
//         ...trackEventSourceResponseRef.current,
//         data[0],
//       ];
//       const { message } = data[0];
//       if (message.tracking.status === "active" && message.tracking.url === "") {
//         onUpdateTrakingDetails(null);
//         setTrackOrderLoading(false);
//         // CustomToaster(
//         //   "error",
//         //   "Tracking information is not provided by the provider."
//         // );
//         return;
//       } else if (message?.tracking?.url === "") {
//         onUpdateTrakingDetails(null);
//         setTrackOrderLoading(false);
//         // CustomToaster(
//         //   "error",
//         //   "Tracking information not available for this product"
//         // );
//         return;
//       } else if (
//         message.tracking.status === "active" &&
//         message?.tracking?.url
//       ) {
//         console.log("message?.tracking?.url=====>", message?.tracking?.url);
//         setTrackOrderLoading(false);
//         trackOrderRef.current.href = message?.tracking?.url;
//         trackOrderRef.current.target = "_blank";
//         trackOrderRef.current.click();
//         onUpdateTrakingDetails(null);
//       } else if (
//         message.tracking.status === "active" &&
//         message?.tracking?.location?.gps
//       ) {
//         onUpdateTrakingDetails(message?.tracking);
//       } else {
//         onUpdateTrakingDetails(null);
//         setTrackOrderLoading(false);
//         // CustomToaster(
//         //   "error",
//         //   "Tracking information is not provided by the provider."
//         // );
//         return;
//       }
//     } catch (err) {
//       setTrackOrderLoading(false);
//       // CustomToaster("error", "Unable to fetch tracking details");
//       eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
//         eventSource.close();
//         clearTimeout(timer);
//       });
//     }
//   }

//   const onUpdateTrakingDetails = (data) => {
//     setTrakingDetails(data);
//   };

//   useEffect(() => {
//     if (OrderData) handleFetchTrackOrderDetails();
//   }, [OrderData]);
//   console.log("order details ", orderId);

//   //   useEffect(() => {
//   //       if (orderId) {
//   //         console.log("order id ",orderId)
//   //         getItemDetails();
//   //       }
//   //     }, [orderId]);

//   /////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   return (
//     <RTL direction={languageDirection}>
//       <CustomStackFullWidth>
//         <Grid
//           container
//           item
//           md={12}
//           xs={12}
//           sx={{
//             minHeight: "calc(100vh - 100px)", // Adjust this value based on your header/footer
//             display: "flex",
//             flexDirection: "column",
//           }}
//         >
//           <Grid item md={12} xs={12}>
//             <SimpleBar style={{ height: isSmall ? "150px" : "150px" }}>
//               <RTL>
//                 <StepBox>
//                   <CustomStepperStyled activeStep={actStep} alternativeLabel>
//                     {steps.map((label, index) => (
//                       <Step key={index}>
//                         <StepLabel>
//                           <Typography>{t(label.label)}</Typography>
//                           {OrderData ? (
//                             <Typography
//                               fontSize={{ xs: "10px", sm: "12px" }}
//                               color={theme.palette.neutral[600]}
//                             >
//                               {label.time && (
//                                 <CustomFormatedTime date={label.time} />
//                               )}
//                             </Typography>
//                           ) : (
//                             <Skeleton variant="text" />
//                           )}
//                         </StepLabel>
//                       </Step>
//                     ))}
//                   </CustomStepperStyled>
//                 </StepBox>
//               </RTL>
//             </SimpleBar>
//           </Grid>

//           <Grid
//             item
//             md={12}
//             xs={12}
//             sx={{
//               flex: 1,
//               height: "500px", // Give it a fixed height or use flex: 1
//             }}
//           >
// {          restaurantLocation&&customerLocation&&  <DeliveryMap sourceLocation={restaurantLocation} destinationLocation={customerLocation} />
// }          </Grid>
//         </Grid>
//       </CustomStackFullWidth>
//     </RTL>
//   );
// };

// export default TrackingPage;

// Add an effect to log agent information when available
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
IconButton,
Button,
Link,
} from "@mui/material";
import { CustomStepperStyled } from "./CustomStepper";
import { EventSourcePolyfill } from "event-source-polyfill";
import {
OrderDetailBox,
HeadingBox,
OrderDetailGrid,
StepBox,
} from "./Tracking.style";
import MapComponent from "../restaurant-details/google-address/MapComponent";
import { useTranslation } from "react-i18next";
import {
CustomPaperBigCard,
CustomStackFullWidth,
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
import { getCall, postCall } from "@/api/MainApi";
import { CustomToaster } from "../custom-toaster/CustomToaster";
import { getValueFromCookie } from "@/utils/cookies";
import { useRouter } from "next/router";
import DeliveryMap from "./DeliveryMap";

const TrackingPage = ({ OrderData }) => {
const [actStep, setActStep] = useState(1);
const [rerenderMap, setRerenderMap] = useState(false);
const { t } = useTranslation();
const theme = useTheme();
const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
const [trakingDetails, setTrakingDetails] = useState(null);
const [restaurantLocation, setRestaurantLocation] = useState(null);
const [customerLocation, setCustomerLocation] = useState(null);
const [trackingUrl, setTrackingUrl] = useState("");

useEffect(() => {
  try {
    if (OrderData?.fulfillments?.[0]) {
      // Extract restaurant location from start location
      const startLocation = OrderData?.fulfillments[0]?.start?.location;
      if (startLocation?.gps) {
        const startGps = startLocation.gps.split(',');
        setRestaurantLocation({
          lat: Number(startGps[0]),
          lng: Number(startGps[1])
        });
      }

      // Extract customer location from end location
      const endLocation = OrderData?.fulfillments[0]?.end?.location;
      if (endLocation?.gps) {
        const endGps = endLocation.gps.split(',');
        setCustomerLocation({
          lat: Number(endGps[0]),
          lng: Number(endGps[1])
        });
      }
    }
  } catch (error) {
    console.error('Error fetching location details:', error);
  }
}, [OrderData]);

// Updated order states mapping to match the actual fulfillment states
const orderStates = {
  Created: 1,
  Accepted: 2,
  "In-progress": 3,
  "Order-picked-up": 4,
  "Out-for-delivery": 5,
  Completed: 6,
};

// Define steps based on updated state mapping
const steps = [
  {
    label: "Order placed",
    time: OrderData?.fulfillmentHistory?.[0]?.createdAt,
  },
  {
    label: "Order Confirmed",
    time: getFulfillmentTimeByState("Pending"),
  },
  {
    label: "Preparing Order",
    time: getFulfillmentTimeByState("Agent-assigned"),
  },
  {
    label: "Order Picked Up",
    time: getFulfillmentTimeByState("Order-picked-up"),
  },
  {
    label: "Order is on the way",
    time: getFulfillmentTimeByState("Out-for-delivery"),
  },
  {
    label: "Delivered",
    time: getFulfillmentTimeByState("Order-delivered"),
  },
];

// Helper function to get the fulfillment time by state
function getFulfillmentTimeByState(state) {
  const fulfillment = OrderData?.fulfillmentHistory?.find(item => item.state === state);
  return fulfillment?.createdAt;
}
useEffect(() => {
  if (OrderData?.order?.fulfillments?.[0]?.agent) {
    console.log('Delivery Agent Info:', OrderData.order.fulfillments[0].agent);
  }
}, [OrderData]);
useEffect(() => {
  // Determine the active step based on order and fulfillment history
  if (OrderData?.orderHistory && OrderData?.fulfillmentHistory) {
    let orderHistoryLen = OrderData?.orderHistory?.length;
    const currentOrderState = OrderData?.orderHistory[orderHistoryLen-1]?.state;
    
    // First check orderHistory for main states
    if (orderStates[currentOrderState]) {
      setActStep(orderStates[currentOrderState]);
    } else {
      // If not found in order history, check fulfillment history for more detailed states
      let fulfillmentHistoryLen = OrderData?.fulfillmentHistory?.length;
      const currentFulfillmentState = OrderData?.fulfillmentHistory[fulfillmentHistoryLen-1]?.state;
      
      // Map fulfillment states to stepper positions
      if (currentFulfillmentState === "Out-for-delivery") {
        setActStep(5);
      } else if (currentFulfillmentState === "Order-picked-up") {
        setActStep(4);
      } else if (currentFulfillmentState === "Order-delivered") {
        setActStep(6);
      } else if (currentFulfillmentState === "Packed" || currentFulfillmentState === "Agent-assigned") {
        setActStep(3);
      }
    }
  }
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
    const [lat, lng] = deliveryLocation.gps
      .split(",")
      .map((coord) => parseFloat(coord.trim()));
    setUserLocation({
      lat,
      lng,
    });
  }
}, [OrderData]);

const {
  coords,
  isGeolocationAvailable,
  isGeolocationEnabled,
} = useGeolocated({
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
      lng: coords.longitude,
    });
    setRerenderMap((prev) => !prev);
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

async function handleFetchTrackOrderDetails() {
  trackEventSourceResponseRef.current = [];
  setTrackOrderLoading(true);
  const transaction_id = OrderData?.transactionId;
  const bpp_id = OrderData?.bppId;
  const order_id = OrderData?.id;
  try {
    const data = await postCall("/clientApis/v2/track", [
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
    // CustomToaster("error", "Unable to fetch tracking data");
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
    `${process.env.NEXT_PUBLIC_BASE_URL}/clientApis/events?messageId=${message_id}`,
    header
  );
  es.addEventListener("on_track", (e) => {
    const { messageId } = JSON.parse(e?.data);
    getTrackOrderDetails(messageId);
  });

  const timer = setTimeout(() => {
    es.close();
    if (trackEventSourceResponseRef.current.length <= 0) {
      // CustomToaster(
      //   "error",
      //   "Cannot proceed with you request now! Please try again"
      // );
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
    const data = await getCall(
      `/clientApis/v2/on_track?messageIds=${message_id}`
    );
    setTrackOrderLoading(false);
    trackEventSourceResponseRef.current = [
      ...trackEventSourceResponseRef.current,
      data[0],
    ];
    const { message } = data[0];
    if (message.tracking.status === "active" && message.tracking.url === "") {
      onUpdateTrakingDetails(null);
      setTrackOrderLoading(false);
      // CustomToaster(
      //   "error",
      //   "Tracking information is not provided by the provider."
      // );
      return;
    } else if (message?.tracking?.url === "") {
      onUpdateTrakingDetails(null);
      setTrackOrderLoading(false);
      // CustomToaster(
      //   "error",
      //   "Tracking information not available for this product"
      // );
      return;
    } else if (
      message.tracking.status === "active" &&
      message?.tracking?.url
    ) {
      console.log("message?.tracking?.url=====>", message?.tracking?.url);
      setTrackOrderLoading(false);
      setTrackingUrl(message?.tracking?.url);
      onUpdateTrakingDetails(message?.tracking);
    } else if (
      message.tracking.status === "active" &&
      message?.tracking?.location?.gps
    ) {
      onUpdateTrakingDetails(message?.tracking);
    } else {
      onUpdateTrakingDetails(null);
      setTrackOrderLoading(false);
      // CustomToaster(
      //   "error",
      //   "Tracking information is not provided by the provider."
      // );
      return;
    }
  } catch (err) {
    setTrackOrderLoading(false);
    // CustomToaster("error", "Unable to fetch tracking details");
    eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
      eventSource.close();
      clearTimeout(timer);
    });
  }
}

const onUpdateTrakingDetails = (data) => {
  setTrakingDetails(data);
};

useEffect(() => {
  if (OrderData) handleFetchTrackOrderDetails();
}, [OrderData]);

return (
  <RTL direction={languageDirection}>
    <CustomStackFullWidth>
      <Grid
        container
        item
        md={12}
        xs={12}
        sx={{
          minHeight: "calc(100vh - 100px)", // Adjust this value based on your header/footer
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Hidden anchor for tracking URL */}
        <a ref={trackOrderRef} style={{ display: "none" }}></a>

        <Grid item md={12} xs={12}>
          <SimpleBar style={{ height: isSmall ? "150px" : "150px" }}>
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

        {/* Display delivery agent information if available */}
        {OrderData?.fulfillments?.[0]?.agent && (
          <Grid item md={12} xs={12} sx={{ mb: 2, px: 2, mt:2, color:'white' }}>
            <Box
              sx={{
                p: 2,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {t("Delivery Agent")}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 4 }}>
                <Box>
                  <Typography variant="body2" color={theme.palette.text.secondary}>
                    {t("Name")}
                  </Typography>
                  <Typography variant="body1">
                    {OrderData.fulfillments[0].agent.name}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color={theme.palette.text.secondary}>
                    {t("Contact")}
                  </Typography>
                  <Typography variant="body1">
                    {OrderData.fulfillments[0].agent.phone}
                  </Typography>
                </Box>
                {OrderData.fulfillments[0].authorization?.type === "OTP" && (
                  <Box>
                    <Typography variant="body2" color={theme.palette.text.secondary}>
                      {t("Delivery OTP")}
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {OrderData.fulfillments[0].authorization.token}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
        )}

        {/* Display tracking URL if available */}
        {trackingUrl && (
          <Grid item md={12} xs={12} sx={{ mb: 2, px: 2, mt:2, color:'white' }}>
            <Box
              sx={{
                p: 2,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                backgroundColor: theme.palette.background.paper,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
                gap: 2
              }}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {t("Live Delivery Tracking")}
                </Typography>
                <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                  {trackingUrl}
                </Typography>
              </Box>
              <Box>
                <a 
                  href={trackingUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    textDecoration: 'none' 
                  }}
                >
                  <Box 
                    component="button"
                    sx={{
                      px: 3,
                      py: 1,
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      border: 'none',
                      borderRadius: 1,
                      cursor: 'pointer',
                      fontWeight:'bold',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      }
                    }}
                  >
                    {t("Open Tracking")}
                  </Box>
                </a>
              </Box>
            </Box>
          </Grid>
        )}

        <Grid
          item
          md={12}
          xs={12}
          sx={{
            flex: 1,
            height: "500px", // Give it a fixed height or use flex: 1
          }}
        >
          {restaurantLocation && customerLocation && (
            <DeliveryMap 
              sourceLocation={restaurantLocation} 
              destinationLocation={customerLocation} 
            />
          )}
        </Grid>
      </Grid>
    </CustomStackFullWidth>
  </RTL>
);
};

export default TrackingPage;