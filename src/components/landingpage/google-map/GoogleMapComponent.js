import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
import { CircularProgress, IconButton, Stack, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { CustomStackFullWidth } from '../../../styled-components/CustomStyles.style'
import Skeleton from '@mui/material/Skeleton'
import MapMarker from './MapMarker'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { IconWrapper, grayscaleMapStyles } from './Map.style'
import { GoogleApi } from '@/hooks/react-query/config/googleApi'

const GoogleMapComponent = ({
    setDisablePickButton,
    setLocationEnabled,
    setLocation,
    setCurrentLocation,
    locationLoading,
    location,
    setPlaceDetailsEnabled,
    placeDetailsEnabled,
    locationEnabled,
    setPlaceDescription,
    height,
    isGps
}) => {
    const theme = useTheme()
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'))
    const containerStyle = {
        width: '100%',
        height: height ? height : isSmall ? '350px' : '400px',
        borderRadius: "10px",
        border: `1px solid ${theme.palette.neutral[300]}`
    }

    const mapRef = useRef(null)
    
    // Ensure location is valid with fallback
    const safeLocation = useMemo(() => {
        if (!location || 
            location.lat === undefined || 
            location.lng === undefined ||
            isNaN(parseFloat(location.lat)) || 
            isNaN(parseFloat(location.lng))) {
            
            // Try to get from localStorage first
            let storedLocation = null;
            if (typeof window !== 'undefined') {
                try {
                    storedLocation = JSON.parse(localStorage.getItem('currentLatLng'));
                    if (storedLocation && !isNaN(parseFloat(storedLocation.lat)) && !isNaN(parseFloat(storedLocation.lng))) {
                        return {
                            lat: parseFloat(storedLocation.lat),
                            lng: parseFloat(storedLocation.lng)
                        };
                    }
                } catch (e) {
                    console.error("Error parsing stored location:", e);
                }
            }
            
            return { lat: 21.2511, lng: 81.6676 } // Default fallback location
        }
        return {
            lat: parseFloat(location.lat),
            lng: parseFloat(location.lng),
        }
    }, [location])

    // Set initial center based on safe location
    const center = useMemo(() => safeLocation, [safeLocation])

    const options = useMemo(
        () => ({
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
        }),
        []
    )

    // Ensure API key is loaded or provide a dummy
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY || '';
    
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: apiKey,
        preventGoogleFontsLoading: true, // Prevents additional Google Fonts loading
        libraries: ['places'], // Ensure places library is loaded
    })

    const [isMounted, setIsMounted] = useState(false)
    const [openInfoWindow, setOpenInfoWindow] = useState(false)
    const [mapSetup, setMapSetup] = useState(false)
    const [map, setMap] = useState(null)
    const [zoom, setZoom] = useState(19)
    const [centerPosition, setCenterPosition] = useState(center)

    // Handlers that don't depend on map
    const handleZoomIn = (e) => {
        e.stopPropagation();
        if (map && zoom < 21) {
            setZoom((prevZoom) => Math.min(prevZoom + 1, 21));
        }
    };

    const handleZoomOut = (e) => {
        e.stopPropagation();
        if (map && zoom > 1) {
            setZoom((prevZoom) => Math.max(prevZoom - 1, 1));
        }
    };

    // Update location and reverse geocode to get address
    const updateAndReverseGeocode = async (newLocation) => {
        if (!newLocation || typeof newLocation.lat === 'undefined' || typeof newLocation.lng === 'undefined') {
            return;
        }
        
        try {
            // First update location state
            setLocationEnabled(true);
            setLocation(newLocation);
            setCenterPosition(newLocation);
            setPlaceDetailsEnabled(false);
            
            // Save to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('currentLatLng', JSON.stringify(newLocation));
            }
            
            // Reverse geocode to get address
            const response = await GoogleApi.geoCodeApi(newLocation);
            
            if (response?.data?.results && response.data.results.length > 0) {
                const address = response.data.results[0].formatted_address;
                setPlaceDescription(address);
                console.log("Address from reverse geocoding:", address);
            } else {
                setPlaceDescription(undefined);
            }
            
            console.log("Location updated:", newLocation);
        } catch (error) {
            console.error("Error in updateAndReverseGeocode:", error);
            // Still update location even if geocoding fails
            setLocation(newLocation);
            setCenterPosition(newLocation);
        }
    };

    
    // Handle map load
    const onLoad = useCallback(function callback(map) {
        setZoom(19);
        mapRef.current = map;
        setMap(map);
    }, []);

    // Handle map unmount
    const onUnmount = useCallback(function callback(map) {
        mapRef.current = null;
        setMap(null);
    }, []);

    // Update center position when location changes
    useEffect(() => {
        if (location && isLoaded) {
            // Ensure we have valid lat/lng values
            if (location.lat !== undefined && location.lng !== undefined) {
                try {
                    const newCenter = {
                        lat: parseFloat(location.lat),
                        lng: parseFloat(location.lng)
                    };
                    
                    // Only update if values are valid
                    if (!isNaN(newCenter.lat) && !isNaN(newCenter.lng)) {
                        setCenterPosition(newCenter);
                    }
                } catch (e) {
                    console.error("Error updating center:", e);
                }
            }
        }
    }, [location, isLoaded, placeDetailsEnabled]);

    // Update location from map center changes
    const updateLocationFromMap = useCallback(async () => {
        if (!map) return;
        
        try {
            const newLocation = {
                lat: map.getCenter().lat(),
                lng: map.getCenter().lng(),
            };
            
            await updateAndReverseGeocode(newLocation);
        } catch (e) {
            console.error("Error in updateLocationFromMap:", e);
        }
    }, [map, updateAndReverseGeocode]);

    // Create event handlers AFTER map is defined
    const eventHandlers = useMemo(() => {
        if (!map) {
            // Return dummy handlers when map is not yet initialized
            return {
                onClick: (e) => e.stopPropagation(),
                onDragStart: (e) => e.stopPropagation(),
                onDrag: (e) => e.stopPropagation(),
                onDragEnd: (e) => e.stopPropagation(),
                onMouseDown: (e) => {
                    e.stopPropagation();
                    setMapSetup(true);
                    setDisablePickButton(true);
                },
                onMouseUp: (e) => {
                    e.stopPropagation();
                    setMapSetup(false);
                    setDisablePickButton(false);
                },
                onZoomChanged: () => {}
            };
        }

        // Return real handlers when map is ready
        return {
            onClick: (e) => e.stopPropagation(),
            onDragStart: (e) => {
                e.stopPropagation();
                setMapSetup(true);
                setDisablePickButton(true);
            },
            onDrag: (e) => e.stopPropagation(),
            onDragEnd: (e) => {
                e.stopPropagation();
                setMapSetup(false);
                setDisablePickButton(false);
                updateLocationFromMap();
            },
            onMouseDown: (e) => {
                e.stopPropagation();
                setMapSetup(true);
                setDisablePickButton(true);
            },
            onMouseUp: (e) => {
                e.stopPropagation();
                setMapSetup(false);
                setDisablePickButton(false);
                updateLocationFromMap();
            },
            onZoomChanged: () => {
                if (map) {
                    try {
                        const zoomLevel = map.getZoom();
                        if (zoomLevel !== zoom) {
                            setZoom(zoomLevel);
                        }
                    } catch (e) {
                        console.error("Error in onZoomChanged handler:", e);
                    }
                }
            }
        };
    }, [map, setDisablePickButton, updateLocationFromMap, zoom]);

    // Initialize location from localStorage if none is provided
    useEffect(() => {
        if (!location && typeof window !== 'undefined') {
            try {
                const storedLocation = JSON.parse(localStorage.getItem('currentLatLng'));
                if (storedLocation && !isNaN(parseFloat(storedLocation.lat)) && !isNaN(parseFloat(storedLocation.lng))) {
                    setLocation(storedLocation);
                    setCenterPosition(storedLocation);
                }
            } catch (e) {
                console.error("Error loading location from localStorage:", e);
            }
        }
    }, [location, setLocation]);

    // If there's a load error, show an error message
    if (loadError) {
        return (
            <CustomStackFullWidth
                alignItems="center"
                justifyContent="center"
                sx={{
                    minHeight: '400px',
                    [theme.breakpoints.down('sm')]: {
                        minHeight: '250px',
                    },
                }}
            >
                <div>Error loading Google Maps. Please try refreshing the page.</div>
            </CustomStackFullWidth>
        );
    }
     
    return isLoaded ? (
        <CustomStackFullWidth
            position="relative"
            className="map"
            sx={{ 
                pointerEvents: 'auto'  // Ensure events are captured
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
        >
            <Stack 
                position="absolute"
                zIndex={999}
                right="15px"
                bottom={isGps ? "18%" : "6%"}
                direction="column"
                spacing={1}
                onClick={(e) => e.stopPropagation()}
            >
                <IconWrapper
                    padding={{ xs: "3px", sm: "5px" }}
                    onClick={handleZoomIn}
                    disabled={zoom >= 21}
                >
                    <AddIcon color="primary" />
                </IconWrapper>
                <IconWrapper
                    padding={{ xs: "3px", sm: "5px" }}
                    onClick={handleZoomOut}
                    disabled={zoom <= 1}
                >
                    <RemoveIcon color="primary" />
                </IconWrapper>
            </Stack>
            
           
            
            <div onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={centerPosition}
                    onLoad={onLoad}
                    zoom={zoom}
                    onUnmount={onUnmount}
                    options={{ ...options, styles: grayscaleMapStyles }}
                    onDragStart={eventHandlers.onDragStart}
                    onDrag={eventHandlers.onDrag}
                    onDragEnd={eventHandlers.onDragEnd}
                    onClick={eventHandlers.onClick}
                    onZoomChanged={eventHandlers.onZoomChanged}
                >
                    {!locationLoading ? (
                        <Stack
                            style={{
                                zIndex: 3,
                                position: 'absolute',
                                marginTop: -63,
                                marginLeft: -32,
                                left: '50%',
                                top: '50%',
                            }}
                        >
                            <MapMarker width="60px" height="70px" />
                        </Stack>
                    ) : (
                        <Stack
                            alignItems="center"
                            style={{
                                zIndex: 3,
                                position: 'absolute',
                                marginTop: -37,
                                marginLeft: -11,
                                left: '50%',
                                top: '50%',
                            }}
                        >
                            <CircularProgress />
                        </Stack>
                    )}
                </GoogleMap>
            </div>
        </CustomStackFullWidth>
    ) : (
        <CustomStackFullWidth
            alignItems="center"
            justifyContent="center"
            sx={{
                minHeight: '400px',
                [theme.breakpoints.down('sm')]: {
                    minHeight: '250px',
                },
            }}
        >
            <Skeleton
                width="100%"
                height="100%"
                variant="rectangular"
                animation="wave"
            />
        </CustomStackFullWidth>
    )
}

export default GoogleMapComponent