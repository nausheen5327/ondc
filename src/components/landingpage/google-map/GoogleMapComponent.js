// import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
// import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
// import { CircularProgress, IconButton, Stack, useMediaQuery } from '@mui/material'
// import { useTheme } from '@mui/material/styles'
// import markerIcon from '../../../../public/static/markerIcon.png'
// import { CustomStackFullWidth } from '../../../styled-components/CustomStyles.style'
// import Skeleton from '@mui/material/Skeleton'
// import MapMarker from './MapMarker'
// import AddIcon from '@mui/icons-material/Add';
// import RemoveIcon from '@mui/icons-material/Remove';
// import { IconWrapper, grayscaleMapStyles } from './Map.style'

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

//     const mapRef = useRef(GoogleMap)
//     const center = useMemo(
//         () => ({
//             lat: parseFloat(location?.lat),
//             lng: parseFloat(location?.lng),
//         }),
//         []
//     )
//     const options = useMemo(
//         () => ({
//             zoomControl: false,
//             streetViewControl: false,
//             mapTypeControl: false,
//             fullscreenControl: false,
//         }),
//         []
//     )
//     const { isLoaded } = useJsApiLoader({
//         id: 'google-map-script',
//         googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY,
//     })
//     const [isMounted, setIsMounted] = useState(false)
//     const [openInfoWindow, setOpenInfoWindow] = useState(false)
//     const [mapSetup, setMapSetup] = useState(false)

//     useEffect(() => setIsMounted(true), [])

//     const [map, setMap] = useState(null)
//     const [zoom, setZoom] = useState(19)
//     const [centerPosition, setCenterPosition] = useState(center)

//     const onLoad = useCallback(function callback(map) {
//         setZoom(19)
//         setMap(map)
//     }, [])
//     useEffect(() => {
//         if (location && placeDetailsEnabled) {
//             setCenterPosition(location)
//         }
//         if (map?.center && mapSetup) {
//             setCenterPosition({
//                 lat: map.center.lat(),
//                 lng: map.center.lng(),
//             })
//         }

//         setIsMounted(true)
//     }, [map, mapSetup, placeDetailsEnabled, location])

//     const onUnmount = useCallback(function callback(map) {
//         setMap(null)
//         // setMapSetup(false)
//     }, [])

//     const handleZoomIn = () => {
//         if (map && zoom <= 21) {
//             setZoom((prevZoom) => Math.min(prevZoom + 1));
//         }
//     };

//     const handleZoomOut = () => {
//         if (map && zoom >= 1) {
//             setZoom((prevZoom) => Math.max(prevZoom - 1));
//         }
//     };
//     useEffect(() => {
//         console.log("GoogleMapComponent received location:", location);
//         // Your existing map setup code
//       }, [location]);
     
//     return isLoaded ? (
//         <CustomStackFullWidth position="relative" className="map">
//             <Stack position="absolute" zIndex={1} right="15px" bottom={isGps ? "18%" : "6%"} direction="column" spacing={1}>
//                 <IconWrapper padding={{ xs: "3px", sm: "5px" }} onClick={handleZoomIn} disabled={zoom > 21}>
//                     <AddIcon color="primary" />
//                 </IconWrapper>
//                 <IconWrapper padding={{ xs: "3px", sm: "5px" }} onClick={handleZoomOut} disabled={zoom < 1}>
//                     <RemoveIcon color="primary" />
//                 </IconWrapper>
//             </Stack>
//             <GoogleMap
//                 mapContainerStyle={containerStyle}
//                 center={centerPosition}
//                 onLoad={onLoad}
//                 zoom={zoom}
//                 onUnmount={onUnmount}
//                 onMouseDown={(e) => {
//                     setMapSetup(true)
//                     setDisablePickButton(true)
//                 }}
//                 onMouseUp={(e) => {
//                     setMapSetup(false)
//                     setDisablePickButton(false)
//                     setLocationEnabled(true)
//                     setLocation({
//                         lat: map.center.lat(),
//                         lng: map.center.lng(),
//                     })
//                     setCenterPosition({
//                         lat: map.center.lat(),
//                         lng: map.center.lng(),
//                     })
//                     setPlaceDetailsEnabled(false)
//                     setPlaceDescription(undefined)
//                 }}
//                 onZoomChanged={() => {
//                     if (map) {
//                         setLocationEnabled(true)
//                         setLocation({
//                             lat: map.center.lat(),
//                             lng: map.center.lng(),
//                         })
//                         setCenterPosition({
//                             lat: map.center.lat(),
//                             lng: map.center.lng(),
//                         })
//                     }
//                 }}
//                 options={{ ...options, styles: grayscaleMapStyles }}
//             >
//                 {!locationLoading ? (
//                     <Stack
//                         style={{
//                             zIndex: 3,
//                             position: 'absolute',
//                             marginTop: -63,
//                             marginLeft: -32,
//                             left: '50%',
//                             top: '50%',
//                         }}
//                     >
//                         <MapMarker width="60px" height="70px" />
//                     </Stack>
//                 ) : (
//                     <Stack
//                         alignItems="center"
//                         style={{
//                             zIndex: 3,
//                             position: 'absolute',
//                             marginTop: -37,
//                             marginLeft: -11,
//                             left: '50%',
//                             top: '50%',
//                         }}
//                     >
//                         <CircularProgress />
//                     </Stack>
//                 )}
//             </GoogleMap>
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
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
import { CircularProgress, IconButton, Stack, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import markerIcon from '../../../../public/static/markerIcon.png'
import { CustomStackFullWidth } from '../../../styled-components/CustomStyles.style'
import Skeleton from '@mui/material/Skeleton'
import MapMarker from './MapMarker'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { IconWrapper, grayscaleMapStyles } from './Map.style'

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
        if (map && zoom <= 21) {
            setZoom((prevZoom) => Math.min(prevZoom + 1));
        }
    };

    const handleZoomOut = (e) => {
        e.stopPropagation();
        if (map && zoom >= 1) {
            setZoom((prevZoom) => Math.max(prevZoom - 1));
        }
    };

    // Handle map load
    const onLoad = useCallback(function callback(map) {
        setZoom(19)
        mapRef.current = map;
        setMap(map)
    }, [])

    // Handle map unmount
    const onUnmount = useCallback(function callback(map) {
        mapRef.current = null;
        setMap(null)
    }, [])

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
    }, [location, isLoaded, placeDetailsEnabled])

    // Update center position when map changes
    useEffect(() => {
        if (map?.center && mapSetup && isLoaded) {
            try {
                setCenterPosition({
                    lat: map.center.lat(),
                    lng: map.center.lng(),
                });
            } catch (e) {
                console.error("Error getting map center:", e);
            }
        }
        setIsMounted(true)
    }, [map, mapSetup, isLoaded])

    // Create event handlers AFTER map is defined
    // This is crucial to prevent the "Cannot access 'map' before initialization" error
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
                if (map) {
                    try {
                        const newLocation = {
                            lat: map.center.lat(),
                            lng: map.center.lng(),
                        };
                        setLocationEnabled(true);
                        setLocation(newLocation);
                        setCenterPosition(newLocation);
                        setPlaceDetailsEnabled(false);
                        setPlaceDescription(undefined);
                    } catch (e) {
                        console.error("Error in onMouseUp handler:", e);
                    }
                }
            },
            onZoomChanged: () => {
                if (map) {
                    try {
                        setLocationEnabled(true);
                        const newLocation = {
                            lat: map.center.lat(),
                            lng: map.center.lng(),
                        };
                        setLocation(newLocation);
                        setCenterPosition(newLocation);
                    } catch (e) {
                        console.error("Error in onZoomChanged handler:", e);
                    }
                }
            }
        };
    }, [map, setDisablePickButton, setLocation, setLocationEnabled, setPlaceDescription, setPlaceDetailsEnabled]);

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
                zIndex={1}
                right="15px"
                bottom={isGps ? "18%" : "6%"}
                direction="column"
                spacing={1}
                onClick={(e) => e.stopPropagation()}
            >
                <IconWrapper
                    padding={{ xs: "3px", sm: "5px" }}
                    onClick={handleZoomIn}
                    disabled={zoom > 21}
                >
                    <AddIcon color="primary" />
                </IconWrapper>
                <IconWrapper
                    padding={{ xs: "3px", sm: "5px" }}
                    onClick={handleZoomOut}
                    disabled={zoom < 1}
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
                    onClick={eventHandlers.onClick}
                    onDragStart={eventHandlers.onDragStart}
                    onDrag={eventHandlers.onDrag}
                    onDragEnd={eventHandlers.onDragEnd}
                    onMouseDown={eventHandlers.onMouseDown}
                    onMouseUp={eventHandlers.onMouseUp}
                    onZoomChanged={eventHandlers.onZoomChanged}
                    options={{ ...options, styles: grayscaleMapStyles }}
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