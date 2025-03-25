// import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
// import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
// import { CircularProgress, IconButton, Stack, useMediaQuery } from '@mui/material'
// import { useTheme } from '@mui/material/styles'
// import { CustomStackFullWidth } from '../../../styled-components/CustomStyles.style'
// import Skeleton from '@mui/material/Skeleton'
// import MapMarker from './MapMarker'
// import AddIcon from '@mui/icons-material/Add';
// import RemoveIcon from '@mui/icons-material/Remove';
// import { IconWrapper, grayscaleMapStyles } from './Map.style'
// import { GoogleApi } from '@/hooks/react-query/config/googleApi'

// const GoogleMapComponent = ({
//     setDisablePickButton,
//     setLocationEnabled,
//     setLocation,
//     setCurrentLocation,
//     locationLoading,
//     location,
//     setPlaceDetailsEnabled,
//     placeDetailsEnabled,
//     locationEnabled,
//     setPlaceDescription,
//     height,
//     isGps
// }) => {
//     const theme = useTheme()
//     const isSmall = useMediaQuery(theme.breakpoints.down('sm'))
//     const containerStyle = {
//         width: '100%',
//         height: height ? height : isSmall ? '350px' : '400px',
//         borderRadius: "10px",
//         border: `1px solid ${theme.palette.neutral[300]}`
//     }

//     const mapRef = useRef(null)
    
//     // Ensure location is valid with fallback
//     const safeLocation = useMemo(() => {
//         if (!location || 
//             location.lat === undefined || 
//             location.lng === undefined ||
//             isNaN(parseFloat(location.lat)) || 
//             isNaN(parseFloat(location.lng))) {
            
//             // Try to get from localStorage first
//             let storedLocation = null;
//             if (typeof window !== 'undefined') {
//                 try {
//                     storedLocation = JSON.parse(localStorage.getItem('currentLatLng'));
//                     if (storedLocation && !isNaN(parseFloat(storedLocation.lat)) && !isNaN(parseFloat(storedLocation.lng))) {
//                         return {
//                             lat: parseFloat(storedLocation.lat),
//                             lng: parseFloat(storedLocation.lng)
//                         };
//                     }
//                 } catch (e) {
//                     console.error("Error parsing stored location:", e);
//                 }
//             }
            
//             return { lat: 21.2511, lng: 81.6676 } // Default fallback location
//         }
//         return {
//             lat: parseFloat(location.lat),
//             lng: parseFloat(location.lng),
//         }
//     }, [location])

//     // Set initial center based on safe location
//     const center = useMemo(() => safeLocation, [safeLocation])

//     const options = useMemo(
//         () => ({
//             zoomControl: false,
//             streetViewControl: false,
//             mapTypeControl: false,
//             fullscreenControl: false,
//         }),
//         []
//     )

//     // Ensure API key is loaded or provide a dummy
//     const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY || '';
    
//     const { isLoaded, loadError } = useJsApiLoader({
//         id: 'google-map-script',
//         googleMapsApiKey: apiKey,
//         preventGoogleFontsLoading: true, // Prevents additional Google Fonts loading
//         libraries: ['places'], // Ensure places library is loaded
//     })

//     const [isMounted, setIsMounted] = useState(false)
//     const [openInfoWindow, setOpenInfoWindow] = useState(false)
//     const [mapSetup, setMapSetup] = useState(false)
//     const [map, setMap] = useState(null)
//     const [zoom, setZoom] = useState(19)
//     const [centerPosition, setCenterPosition] = useState(center)

//     // Handlers that don't depend on map
//     const handleZoomIn = (e) => {
//         if (map && zoom < 21) {
//             setZoom((prevZoom) => Math.min(prevZoom + 1, 21));
//         }
//     };

//     const handleZoomOut = (e) => {
//         if (map && zoom > 1) {
//             setZoom((prevZoom) => Math.max(prevZoom - 1, 1));
//         }
//     };

//     // Update location and reverse geocode to get address
//     const updateAndReverseGeocode = async (newLocation) => {
//         if (!newLocation || typeof newLocation.lat === 'undefined' || typeof newLocation.lng === 'undefined') {
//             return;
//         }
        
//         try {
//             // First update location state
//             setLocationEnabled(true);
//             setLocation(newLocation);
//             setCenterPosition(newLocation);
//             setPlaceDetailsEnabled(false);
            
//             // Save to localStorage
//             if (typeof window !== 'undefined') {
//                 localStorage.setItem('currentLatLng', JSON.stringify(newLocation));
//             }
            
//             // Reverse geocode to get address
//             const response = await GoogleApi.geoCodeApi(newLocation);
            
//             if (response?.data?.results && response.data.results.length > 0) {
//                 const address = response.data.results[0].formatted_address;
//                 setPlaceDescription(address);
//                 console.log("Address from reverse geocoding:", address);
//             } else {
//                 setPlaceDescription(undefined);
//             }
            
//             console.log("Location updated:", newLocation);
//         } catch (error) {
//             console.error("Error in updateAndReverseGeocode:", error);
//             // Still update location even if geocoding fails
//             setLocation(newLocation);
//             setCenterPosition(newLocation);
//         }
//     };

    
//     // Handle map load
//     const onLoad = useCallback(function callback(map) {
//         setZoom(19);
//         mapRef.current = map;
//         setMap(map);
//     }, []);

//     // Handle map unmount
//     const onUnmount = useCallback(function callback(map) {
//         mapRef.current = null;
//         setMap(null);
//     }, []);

//     // Update center position when location changes
//     useEffect(() => {
//         if (location && isLoaded) {
//             // Ensure we have valid lat/lng values
//             if (location.lat !== undefined && location.lng !== undefined) {
//                 try {
//                     const newCenter = {
//                         lat: parseFloat(location.lat),
//                         lng: parseFloat(location.lng)
//                     };
                    
//                     // Only update if values are valid
//                     if (!isNaN(newCenter.lat) && !isNaN(newCenter.lng)) {
//                         setCenterPosition(newCenter);
//                     }
//                 } catch (e) {
//                     console.error("Error updating center:", e);
//                 }
//             }
//         }
//     }, [location, isLoaded, placeDetailsEnabled]);

//     // Update location from map center changes
//     const updateLocationFromMap = useCallback(async () => {
//         if (!map) return;
        
//         try {
//             const newLocation = {
//                 lat: map.getCenter().lat(),
//                 lng: map.getCenter().lng(),
//             };
            
//             await updateAndReverseGeocode(newLocation);
//         } catch (e) {
//             console.error("Error in updateLocationFromMap:", e);
//         }
//     }, [map, updateAndReverseGeocode]);

//     // Create event handlers AFTER map is defined
//     const eventHandlers = useMemo(() => {
//         if (!map) {
//             // Return dummy handlers when map is not yet initialized
//             return {
//                 onMouseDown: (e) => {
//                     setMapSetup(true);
//                     setDisablePickButton(true);
//                 },
//                 onMouseUp: (e) => {
//                     setMapSetup(false);
//                     setDisablePickButton(false);
//                 },
//                 onZoomChanged: () => {}
//             };
//         }

//         // Return real handlers when map is ready
//         return {
            
//             onDragStart: (e) => {
//                 setMapSetup(true);
//                 setDisablePickButton(true);
//             },
//             onDragEnd: (e) => {
//                 setMapSetup(false);
//                 setDisablePickButton(false);
//                 updateLocationFromMap();
//             },
//             onMouseDown: (e) => {
//                 setMapSetup(true);
//                 setDisablePickButton(true);
//             },
//             onMouseUp: (e) => {
//                 setMapSetup(false);
//                 setDisablePickButton(false);
//                 updateLocationFromMap();
//             },
//             onZoomChanged: () => {
//                 if (map) {
//                     try {
//                         const zoomLevel = map.getZoom();
//                         if (zoomLevel !== zoom) {
//                             setZoom(zoomLevel);
//                         }
//                     } catch (e) {
//                         console.error("Error in onZoomChanged handler:", e);
//                     }
//                 }
//             }
//         };
//     }, [map, setDisablePickButton, updateLocationFromMap, zoom]);

//     // Initialize location from localStorage if none is provided
//     useEffect(() => {
//         if (!location && typeof window !== 'undefined') {
//             try {
//                 const storedLocation = JSON.parse(localStorage.getItem('currentLatLng'));
//                 if (storedLocation && !isNaN(parseFloat(storedLocation.lat)) && !isNaN(parseFloat(storedLocation.lng))) {
//                     setLocation(storedLocation);
//                     setCenterPosition(storedLocation);
//                 }
//             } catch (e) {
//                 console.error("Error loading location from localStorage:", e);
//             }
//         }
//     }, [location, setLocation]);

//     // If there's a load error, show an error message
//     if (loadError) {
//         return (
//             <CustomStackFullWidth
//                 alignItems="center"
//                 justifyContent="center"
//                 sx={{
//                     minHeight: '400px',
//                     [theme.breakpoints.down('sm')]: {
//                         minHeight: '250px',
//                     },
//                 }}
//             >
//                 <div>Error loading Google Maps. Please try refreshing the page.</div>
//             </CustomStackFullWidth>
//         );
//     }
     
//     return isLoaded ? (
//         <CustomStackFullWidth
//             position="relative"
//             className="map"
//             sx={{ 
//                 pointerEvents: 'auto'  // Ensure events are captured
//             }}
//         >
//             <Stack 
//                 position="absolute"
//                 zIndex={999}
//                 right="15px"
//                 bottom={isGps ? "18%" : "6%"}
//                 direction="column"
//                 spacing={1}
//             >
//                 <IconWrapper
//                     padding={{ xs: "3px", sm: "5px" }}
//                     onClick={handleZoomIn}
//                     disabled={zoom >= 21}
//                 >
//                     <AddIcon color="primary" />
//                 </IconWrapper>
//                 <IconWrapper
//                     padding={{ xs: "3px", sm: "5px" }}
//                     onClick={handleZoomOut}
//                     disabled={zoom <= 1}
//                 >
//                     <RemoveIcon color="primary" />
//                 </IconWrapper>
//             </Stack>
            
           
            
//             <div>
//                 <GoogleMap
//                     mapContainerStyle={containerStyle}
//                     center={centerPosition}
//                     onLoad={onLoad}
//                     zoom={zoom}
//                     onUnmount={onUnmount}
//                     options={{ ...options, styles: grayscaleMapStyles }}
//                     onDragStart={eventHandlers.onDragStart}
//                     onDrag={eventHandlers.onDrag}
//                     onDragEnd={eventHandlers.onDragEnd}
//                     onClick={eventHandlers.onClick}
//                     onZoomChanged={eventHandlers.onZoomChanged}
//                 >
//                     {!locationLoading ? (
//                         <Stack
//                             style={{
//                                 zIndex: 3,
//                                 position: 'absolute',
//                                 marginTop: -63,
//                                 marginLeft: -32,
//                                 left: '50%',
//                                 top: '50%',
//                             }}
//                         >
//                             <MapMarker width="60px" height="70px" />
//                         </Stack>
//                     ) : (
//                         <Stack
//                             alignItems="center"
//                             style={{
//                                 zIndex: 3,
//                                 position: 'absolute',
//                                 marginTop: -37,
//                                 marginLeft: -11,
//                                 left: '50%',
//                                 top: '50%',
//                             }}
//                         >
//                             <CircularProgress />
//                         </Stack>
//                     )}
//                 </GoogleMap>
//             </div>
//         </CustomStackFullWidth>
//     ) : (
//         <CustomStackFullWidth
//             alignItems="center"
//             justifyContent="center"
//             sx={{
//                 minHeight: '400px',
//                 [theme.breakpoints.down('sm')]: {
//                     minHeight: '250px',
//                 },
//             }}
//         >
//             <Skeleton
//                 width="100%"
//                 height="100%"
//                 variant="rectangular"
//                 animation="wave"
//             />
//         </CustomStackFullWidth>
//     )
// }

// export default GoogleMapComponent
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CircularProgress, Stack, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CustomStackFullWidth } from '../../../styled-components/CustomStyles.style';
import Skeleton from '@mui/material/Skeleton';
import MapMarker from './MapMarker';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { IconWrapper, grayscaleMapStyles } from './Map.style';
import { GoogleApi } from '@/hooks/react-query/config/googleApi';
import { styled } from '@material-ui/core';

// Map wrapper styled component
const MapWrapper = styled('div')({
    position: 'relative',
    width: '100%',
    height: '100%',
    borderRadius: '10px',
    overflow: 'hidden',
    isolation: 'isolate',
    zIndex: 1,
});

// Map container styled component
const MapContainer = styled('div')({
    width: '100%',
    height: '100%',
    borderRadius: '10px',
});

// Singleton pattern for map instance
let googleMapInstance = null;

const CustomGoogleMapComponent = ({
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
    isGps,
}) => {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const mapContainerRef = useRef(null);
    const [map, setMap] = useState(null);
    const [zoom, setZoom] = useState(19);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [loadError, setLoadError] = useState(null);
    const [centerPosition, setCenterPosition] = useState(null);
    const [isApiLoaded, setIsApiLoaded] = useState(false);
    const initializedRef = useRef(false);

    // Ensure location is valid with fallback
    const safeLocation = useMemo(() => {
        if (
            !location ||
            location.lat === undefined ||
            location.lng === undefined ||
            isNaN(parseFloat(location.lat)) ||
            isNaN(parseFloat(location.lng))
        ) {
            // Try to get from localStorage first
            let storedLocation = null;
            if (typeof window !== 'undefined') {
                try {
                    storedLocation = JSON.parse(localStorage.getItem('currentLatLng'));
                    if (storedLocation && !isNaN(parseFloat(storedLocation.lat)) && !isNaN(parseFloat(storedLocation.lng))) {
                        return {
                            lat: parseFloat(storedLocation.lat),
                            lng: parseFloat(storedLocation.lng),
                        };
                    }
                } catch (e) {
                    console.error('Error parsing stored location:', e);
                }
            }

            return { lat: 21.2511, lng: 81.6676 }; // Default fallback location
        }
        return {
            lat: parseFloat(location.lat),
            lng: parseFloat(location.lng),
        };
    }, [location]);

    // Update centerPosition when safeLocation changes
    useEffect(() => {
        setCenterPosition(safeLocation);
    }, [safeLocation]);

    // Update location and reverse geocode to get address
    const updateAndReverseGeocode = useCallback(
        async (newLocation) => {
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
                    console.log('Address from reverse geocoding:', address);
                } else {
                    setPlaceDescription(undefined);
                }

                console.log('Location updated:', newLocation);
            } catch (error) {
                console.error('Error in updateAndReverseGeocode:', error);
                // Still update location even if geocoding fails
                setLocation(newLocation);
                setCenterPosition(newLocation);
            }
        },
        [setLocation, setLocationEnabled, setPlaceDetailsEnabled, setPlaceDescription]
    );

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
            console.error('Error in updateLocationFromMap:', e);
        }
    }, [map, updateAndReverseGeocode]);

    // Initialize map
    const initializeMap = useCallback(() => {
        if (!window.google || !window.google.maps) {
            console.error('Google Maps API not loaded');
            setLoadError('Google Maps API not loaded');
            return;
        }

        // Only initialize once
        if (initializedRef.current) return;
        initializedRef.current = true;

        if (mapContainerRef.current) {
            try {
                const currentCenter = centerPosition || safeLocation;
                console.log('Initializing map with center:', currentCenter);
                
                const mapOptions = {
                    center: new window.google.maps.LatLng(currentCenter.lat, currentCenter.lng),
                    zoom: zoom,
                    zoomControl: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                    styles: grayscaleMapStyles,
                };

                const newMap = new window.google.maps.Map(mapContainerRef.current, mapOptions);
                googleMapInstance = newMap;
                setMap(newMap);
                setIsMapLoaded(true);

                // Add event listeners
                newMap.addListener('dragstart', () => {
                    setDisablePickButton(true);
                });

                newMap.addListener('dragend', () => {
                    setDisablePickButton(false);
                    updateLocationFromMap();
                });

                newMap.addListener('mousedown', () => {
                    setDisablePickButton(true);
                });

                newMap.addListener('mouseup', () => {
                    setDisablePickButton(false);
                    updateLocationFromMap();
                });

                newMap.addListener('zoom_changed', () => {
                    try {
                        const zoomLevel = newMap.getZoom();
                        if (zoomLevel !== zoom) {
                            setZoom(zoomLevel);
                        }
                    } catch (e) {
                        console.error('Error in zoom_changed handler:', e);
                    }
                });
            } catch (error) {
                console.error('Error initializing map:', error);
                setLoadError('Error initializing map');
            }
        }
    }, [centerPosition, safeLocation, zoom, setDisablePickButton, updateLocationFromMap]);

    // Load Google Maps API script
    useEffect(() => {
        if (typeof window !== 'undefined' && !window.google?.maps) {
            const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY || '';
            const existingScript = document.getElementById('google-maps-script');
            
            if (!existingScript) {
                const googleMapScript = document.createElement('script');
                googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
                googleMapScript.async = true;
                googleMapScript.defer = true;
                googleMapScript.id = 'google-maps-script';
                
                googleMapScript.onload = () => {
                    console.log('Google Maps API loaded');
                    setIsApiLoaded(true);
                };
                
                googleMapScript.onerror = () => {
                    setLoadError('Failed to load Google Maps API');
                };
                
                document.body.appendChild(googleMapScript);
                
                return () => {
                    // Clean up script if component unmounts before script loads
                    const script = document.getElementById('google-maps-script');
                    if (script) {
                        script.remove();
                    }
                };
            } else {
                // Script already exists
                setIsApiLoaded(true);
            }
        } else if (window.google?.maps) {
            // API already loaded
            setIsApiLoaded(true);
        }
    }, []);

    // Initialize map when API is loaded and centerPosition is available
    useEffect(() => {
        if (isApiLoaded && centerPosition && mapContainerRef.current && !map) {
            initializeMap();
        }
    }, [isApiLoaded, centerPosition, map, initializeMap]);

    // Update map center when location changes
    useEffect(() => {
        if (map && centerPosition) {
            console.log('Setting map center to:', centerPosition);
            map.setCenter(new window.google.maps.LatLng(centerPosition.lat, centerPosition.lng));
        }
    }, [map, centerPosition]);

    // Update zoom when it changes
    useEffect(() => {
        if (map && map.getZoom() !== zoom) {
            map.setZoom(zoom);
        }
    }, [map, zoom]);

    // Clean up map instance on unmount
    useEffect(() => {
        return () => {
            if (googleMapInstance) {
                // Remove event listeners
                if (window.google && window.google.maps) {
                    window.google.maps.event.clearInstanceListeners(googleMapInstance);
                }
                googleMapInstance = null;
                setMap(null);
                initializedRef.current = false;
            }
        };
    }, []);

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
                console.error('Error loading location from localStorage:', e);
            }
        }
    }, [location, setLocation]);

    // Custom map container style
    const containerStyle = {
        width: '100%',
        height: height ? height : isSmall ? '350px' : '400px',
        borderRadius: '10px',
        border: `1px solid ${theme.palette.neutral[300]}`,
        position: 'relative',
        zIndex: 1,
    };

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

    return (
        <CustomStackFullWidth
            position="relative"
            className="map"
            sx={{
                pointerEvents: 'auto',
            }}
        >
            <Stack
                position="absolute"
                zIndex={999}
                right="15px"
                bottom={isGps ? '18%' : '6%'}
                direction="column"
                spacing={1}
            >
                <IconWrapper
                    padding={{ xs: '3px', sm: '5px' }}
                    onClick={() => {
                        const newZoom = Math.min(zoom + 1, 21);
                        setZoom(newZoom);
                        if (map) map.setZoom(newZoom);
                    }}
                    disabled={zoom >= 21}
                >
                    <AddIcon color="primary" />
                </IconWrapper>
                <IconWrapper
                    padding={{ xs: '3px', sm: '5px' }}
                    onClick={() => {
                        const newZoom = Math.max(zoom - 1, 1);
                        setZoom(newZoom);
                        if (map) map.setZoom(newZoom);
                    }}
                    disabled={zoom <= 1}
                >
                    <RemoveIcon color="primary" />
                </IconWrapper>
            </Stack>

            <CustomStackFullWidth position="relative" sx={{ pointerEvents: 'auto' }}>
                <MapWrapper style={containerStyle}>
                    <MapContainer ref={mapContainerRef} />
                    
                    {/* Centered map marker or loading indicator */}
                    {isMapLoaded && (
                        <>
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
                        </>
                    )}
                </MapWrapper>
            </CustomStackFullWidth>

            {/* Loading skeleton */}
            {!isMapLoaded && (
                <CustomStackFullWidth
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                    }}
                >
                    <Skeleton
                        width="100%"
                        height="100%"
                        variant="rectangular"
                        animation="wave"
                    />
                </CustomStackFullWidth>
            )}
        </CustomStackFullWidth>
    );
};

export default React.memo(CustomGoogleMapComponent);