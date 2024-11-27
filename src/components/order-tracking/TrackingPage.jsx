import React, { useState, useEffect } from "react";
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

const TrackingPage = ({ data }) => {
    const [actStep, setActStep] = useState(1);
    const [rerenderMap, setRerenderMap] = useState(false);
    const { t } = useTranslation();
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

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
            time: data?.order?.createdAt
        },
        {
            label: "Order Confirmed",
            time: data?.order?.fulfillments[0]?.start?.time?.range?.start
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
            time: data?.order?.fulfillments[0]?.end?.time?.range?.end
        }
    ];

    useEffect(() => {
        // Set active step based on order state
        const currentState = data?.order?.state || "Created";
        setActStep(orderStates[currentState] || 1);
    }, [data]);

    const [userLocation, setUserLocation] = useState({
        lat: "",
        lng: "",
    });

    useEffect(() => {
        // Extract coordinates from fulfillment end location
        const deliveryLocation = data?.order?.fulfillments[0]?.end?.location;
        if (deliveryLocation?.gps) {
            const [lat, lng] = deliveryLocation.gps.split(",").map(coord => parseFloat(coord.trim()));
            setUserLocation({
                lat,
                lng
            });
        }
    }, [data]);

    // Extract restaurant coordinates
    const restaurantLocation = data?.order?.fulfillments[0]?.start?.location;
    const [resLat, resLong] = restaurantLocation?.gps
        ? restaurantLocation.gps.split(",").map(coord => parseFloat(coord.trim()))
        : [0, 0];

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
                                                    {data ? (
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

                    <Grid item md={12} xs={12} p="1.4rem" sx={{ position: "relative" }}>
                        <MapComponent
                            key={rerenderMap}
                            isRestaurant
                            latitude={resLat}
                            longitude={resLong}
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
                    </Grid>

                    {data?.order?.fulfillments?.[0]?.type === "Delivery" && (
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