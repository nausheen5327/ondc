import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { GoogleMap,Marker, useJsApiLoader } from '@react-google-maps/api'
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

    const mapRef = useRef(GoogleMap)
    const center = useMemo(
        () => ({
            lat: parseFloat(location?.lat),
            lng: parseFloat(location?.lng),
        }),
        []
    )
    const [markerPosition, setMarkerPosition] = useState(null)

    const options = useMemo(
        () => ({
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
        }),
        []
    )
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY,
        libraries: ['maps'],
    })
    const [isMounted, setIsMounted] = useState(false)
    const [openInfoWindow, setOpenInfoWindow] = useState(false)
    const [mapSetup, setMapSetup] = useState(false)

    useEffect(() => setIsMounted(true), [])

    const [map, setMap] = useState(null)
    const [zoom, setZoom] = useState(19)
    const [centerPosition, setCenterPosition] = useState(center)

    const onLoad = useCallback((map) => {
        setMap(map)
        map.setCenter(center)
      }, [])
    
      const onUnmount = useCallback(() => {
        setMap(null)
      }, [])
    
      const handleMapClick = useCallback((event) => {
        const { latLng } = event
        const lat = latLng.lat()
        const lng = latLng.lng()
    
        setMarkerPosition({ lat, lng })
      }, [])

    const handleZoomIn = () => {
        if (map && zoom <= 21) {
            setZoom((prevZoom) => Math.min(prevZoom + 1));
        }
    };

    const handleZoomOut = () => {
        if (map && zoom >= 1) {
            setZoom((prevZoom) => Math.max(prevZoom - 1));
        }
    };

    return isLoaded ? (
        <CustomStackFullWidth position="relative" className="map">
            <Stack position="absolute" zIndex={1} right="15px" bottom={isGps ? "18%" : "6%"} direction="column" spacing={1}>
                <IconWrapper padding={{ xs: "3px", sm: "5px" }} onClick={handleZoomIn} disabled={zoom > 21}>
                    <AddIcon color="primary" />
                </IconWrapper>
                <IconWrapper padding={{ xs: "3px", sm: "5px" }} onClick={handleZoomOut} disabled={zoom < 1}>
                    <RemoveIcon color="primary" />
                </IconWrapper>
            </Stack>
            <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick} // handle map click to place marker
      >
        {markerPosition && (
          <Marker position={markerPosition} />
        )}
      </GoogleMap>
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
