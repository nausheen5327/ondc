import React, { useEffect, useState } from "react";
import { CustomStackFullWidth } from "@/styled-components/CustomStyles.style";
import CustomMapSearch from "../join-restaurant/CustomMapSearch";
import GoogleMapComponent from "../landingpage/google-map/GoogleMapComponent";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@mui/styles";
import { useMediaQuery } from "@mui/material";
import { useGetLocation } from "@/utils/custom-hook/useGetLocation";
import { setlocation, setLocation as setReduxLocation } from "@/redux/slices/addressData";

const MapWithSearchBox = ({ orderType, padding, coords, mapHeight, rerenderMap, isGps, handleClose }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { global } = useSelector((state) => state.globalSettings);
    const { location, formatted_address } = useSelector((state) => state.addressData);
    const [mapKey, setMapKey] = useState(Date.now()); // Add a key to force re-render
    
    console.log("map with search box location", location);
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const {
        setDisablePickButton,
        locationEnabled,
        setLocationEnabled,
        searchKey,
        setSearchKey,
        setEnabled,
        placeDetailsEnabled,
        setPlaceDetailsEnabled,
        placeDescription,
        setPlaceDescription,
        predictions,
        setPlaceId,
        setLocations, 
        isLoadingPlacesApi,
        currentLocationValue 
    } = useGetLocation(coords);
    
    let currentLocation = undefined;
    if (typeof window !== 'undefined') {
        currentLocation = JSON.parse(localStorage.getItem('currentLatLng'));
    }
    
    // Handle location updates from search
    const handleLocationUpdate = (newLocation) => {
        // Update local state
        setLocations(newLocation);
        
        // Update Redux state
        dispatch(setlocation(newLocation));
        
        // Force map to re-render with new location
        setMapKey(Date.now());
        
        console.log("Location updated:", newLocation);
    };
    
    // For debugging
    useEffect(() => {
        console.log("Current orderType:", orderType);
        console.log("Is condition met?", orderType !== "take_away");
        console.log("Current location state:", location);
    }, [orderType, location]);

    return (
        <CustomStackFullWidth spacing={1} gap="12px">
            {/* First condition - for the search box */}
            {orderType !== "take_away" && (
                <>
                    {console.log("Rendering CustomMapSearch component")}
                    <CustomMapSearch
                        setSearchKey={setSearchKey}
                        setEnabled={setEnabled}
                        predictions={predictions}
                        setPlaceId={setPlaceId}
                        setPlaceDetailsEnabled={setPlaceDetailsEnabled}
                        setPlaceDescription={setPlaceDescription}
                        border={theme.palette.primary.main}
                        searchKey={searchKey}
                        placeDescription={placeDescription}
                        isLoadingPlacesApi={isLoadingPlacesApi}
                        currentLocationValue={currentLocationValue}
                        setLocation={handleLocationUpdate}
                        handleClose={handleClose} // Pass the new handler
                    />
                </>
            )}

            {/* Second condition - for the map component */}
            {location && orderType !== "take_away" && (
                <>
                    {console.log("Rendering GoogleMapComponent")}
                    <GoogleMapComponent
                        key={`map-${mapKey}-${rerenderMap}`} // Use our own key plus the parent's rerenderMap
                        setLocation={setLocations}
                        location={location}
                        setPlaceDetailsEnabled={setPlaceDetailsEnabled}
                        placeDetailsEnabled={placeDetailsEnabled}
                        locationEnabled={locationEnabled}
                        setPlaceDescription={setPlaceDescription}
                        setLocationEnabled={setLocationEnabled}
                        setDisablePickButton={setDisablePickButton}
                        height={isSmall ? mapHeight : "448px"}
                        isGps={isGps}
                    />
                </>
            )}
        </CustomStackFullWidth>
    );
};

export default MapWithSearchBox;