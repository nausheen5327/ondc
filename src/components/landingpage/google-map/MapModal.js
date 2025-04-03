import React, { useEffect, useState, useRef } from 'react'
import {
    Box,
    Modal,
    Paper,
    Typography,
    styled,
    Button,
    Autocomplete,
    TextField,
    Grid,
    useTheme,
    CircularProgress,
    Skeleton,
    Popper,
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import GpsFixedIcon from '@mui/icons-material/GpsFixed'
import CloseIcon from '@mui/icons-material/Close'
import GoogleMapComponent from './GoogleMapComponent'
import { useQuery } from 'react-query'
import { GoogleApi } from '../../../hooks/react-query/config/googleApi'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { useGeolocated } from 'react-geolocated'
import { PrimaryButton } from '../link-section/Linksection.style'
import { onErrorResponse, onSingleErrorResponse } from '../../ErrorResponse'
import {
    setUserLocationUpdate,
    setZoneData,
} from '../../../redux/slices/global'
import LocationEnableCheck from '../LocationEnableCheck'
import { FacebookCircularProgress } from '../HeroLocationForm'
import { CustomStackFullWidth } from '../../../styled-components/CustomStyles.style'
import { CustomTypographyGray } from '../../error/Errors.style'
import { CustomToaster } from '@/components/custom-toaster/CustomToaster'
import { ErrorBoundary } from 'react-error-boundary'
import { setlocation } from '@/redux/slices/addressData'

const CustomBoxWrapper = styled(Box)(({ theme }) => ({
    outline: 'none',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgColor: 'background.paper',
    boxShadow: 24,
    padding: '25px',
    maxWidth: '800px',
    minWidth: '100px',
    width: '100%',
    minHeight: '550px',
    background: theme.palette.background.paper,
    borderRadius: '5px',
    [theme.breakpoints.down('md')]: {
        maxWidth: '500px',
    },
    [theme.breakpoints.down('sm')]: {
        maxWidth: '330px',
        minHeight: '300px',
    },
}))

const CssTextField = styled(TextField)(({ theme }) => ({
    '& label.Mui-focused': {
        color: theme.palette.primary.main,
        background: theme.palette.whiteContainer.main,
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: theme.palette.primary.main,
        background: theme.palette.whiteContainer.main,
    },
    '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
    },
    '& .MuiOutlinedInput-root': {
        fontSize: '13px',
        padding: '7px',
        border: '2px solid',
        borderColor: theme.palette.primary.main,
        '& fieldset': {
            borderColor: theme.palette.primary.main,
        },
        '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
        },
    },
}))

const MapFallback = ({ t, error, resetErrorBoundary }) => (
    <CustomStackFullWidth
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: '400px' }}
    >
        <Typography color="error" mb={2}>
            {t('There was an error loading the map')}
        </Typography>
        <Typography variant="body2" mb={3} align="center">
            {error?.message || t('Please try again or check your internet connection')}
        </Typography>
        <Button
            variant="contained"
            onClick={resetErrorBoundary}
        >
            {t('Try Again')}
        </Button>
    </CustomStackFullWidth>
);

const MapModal = ({ open, handleClose, redirectUrl }) => {
    const router = useRouter();
    const theme = useTheme();
    const { t } = useTranslation();
    const dispatch = useDispatch();

    // Redux state
    const { global, userLocationUpdate } = useSelector(
        (state) => state.globalSettings
    );

    // State variables
    const [isEnableLocation, setIsEnableLocation] = useState(false);
    const [searchKey, setSearchKey] = useState('');
    const [predictions, setPredictions] = useState([]);
    const [placeDetailsEnabled, setPlaceDetailsEnabled] = useState(false);
    const [locationEnabled, setLocationEnabled] = useState(false);
    const [placeId, setPlaceId] = useState('');
    const [placeDescription, setPlaceDescription] = useState(undefined);
    const [zoneId, setZoneId] = useState(undefined);
    const [isLoadingGeolocation, setIsLoadingGeolocation] = useState(false);
    const [currentLocation, setCurrentLocation] = useState({});
    const [rerenderMap, setRerenderMap] = useState(false);
    const [currentLocationValue, setCurrentLocationValue] = useState({
        description: '',
    });
    const [loadingAuto, setLoadingAuto] = useState(false);
    const [isDisablePickButton, setDisablePickButton] = useState(false);

    // Google Maps loaded state
    const [googleMapsAvailable, setGoogleMapsAvailable] = useState(false);
    const googleMapsLoadedRef = useRef(false);

    // Default location with fallback
    const DEFAULT_LOCATION = { lat: 21.2511, lng: 81.6676 };

    // Initialize location state with proper validation
    const [location, setLocation] = useState(() => {
        try {
            // First check if global default location exists and is valid
            if (global?.default_location?.lat && global?.default_location?.lng) {
                const lat = parseFloat(global.default_location.lat);
                const lng = parseFloat(global.default_location.lng);
                if (!isNaN(lat) && !isNaN(lng)) {
                    return { lat, lng };
                }
            }

            // If no global location, try getting from localStorage
            const savedLocation = localStorage.getItem('currentLatLng');
            if (savedLocation) {
                const parsed = JSON.parse(savedLocation);
                if (parsed && parsed.lat && parsed.lng) {
                    const lat = parseFloat(parsed.lat);
                    const lng = parseFloat(parsed.lng);
                    if (!isNaN(lat) && !isNaN(lng)) {
                        return { lat, lng };
                    }
                }
            }
        } catch (e) {
            console.error("Error initializing location", e);
        }

        // Fallback to hardcoded default
        return DEFAULT_LOCATION;
    });

    // Check if Google Maps API is loaded
    useEffect(() => {
        const checkGoogleMapsLoaded = () => {
            if (window.google && window.google.maps) {
                googleMapsLoadedRef.current = true;
                setGoogleMapsAvailable(true);
            } else if (!googleMapsLoadedRef.current) {
                setTimeout(checkGoogleMapsLoaded, 200);
            }
        };

        checkGoogleMapsLoaded();

        // Cleanup
        return () => {
            googleMapsLoadedRef.current = false;
        };
    }, []);

    // Normalize location to ensure it's valid
    const normalizeLocation = (loc) => {
        if (!loc) return DEFAULT_LOCATION;

        // Ensure we have numeric lat/lng values
        let lat, lng;

        try {
            lat = typeof loc.lat === 'function' ? loc.lat() : parseFloat(loc.lat);
            lng = typeof loc.lng === 'function' ? loc.lng() : parseFloat(loc.lng);
        } catch (e) {
            console.error("Error normalizing location", e);
            return DEFAULT_LOCATION;
        }

        // Check if values are valid numbers and in valid ranges
        if (isNaN(lat) || isNaN(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
            console.warn("Invalid location values, using default", loc);
            return DEFAULT_LOCATION;
        }

        return { lat, lng };
    };


    ///////////////////////////////////////////
    // Handle current location selection - Updated to directly set location and close modal
const handleUseCurrentLocation = async () => {
    setIsLoadingGeolocation(true);

    // If coords are already available, use them directly
    if (coords && coords.latitude && coords.longitude) {
        finalizeLocationSelection({
            latitude: coords.latitude,
            longitude: coords.longitude
        });
    } else {
        // If coords aren't available yet, try to get them manually
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    finalizeLocationSelection({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    setIsLoadingGeolocation(false);
                    setIsEnableLocation(true);
                    CustomToaster('error', 'Could not get your location. Please check your browser settings.');
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } else {
            console.error("Geolocation not available");
            setIsLoadingGeolocation(false);
            setIsEnableLocation(true);
            CustomToaster('error', 'Geolocation is not supported by your browser.');
        }
    }
};

// New helper function to finalize location selection and close modal
const finalizeLocationSelection = (coordinates) => {
    const newLocation = {
        lat: coordinates.latitude,
        lng: coordinates.longitude
    };

    // Update state with current coordinates
    setLocation(newLocation);
    
    // Save current location to check for zone
    GoogleApi.getZoneId(newLocation)
        .then((response) => {
            if (response?.data?.zone_id) {
                const zoneId = response.data.zone_id;
                
                // Get the address from geocoding
                GoogleApi.geoCodeApi(newLocation)
                    .then((geoResponse) => {
                        if (geoResponse?.data?.results && geoResponse.data.results.length > 0) {
                            const address = geoResponse.data.results[0].formatted_address;
                            
                            try {
                                // Save all data to localStorage
                                localStorage.setItem('zoneid', JSON.stringify(zoneId));
                                localStorage.setItem('location', JSON.stringify(address));
                                localStorage.setItem('currentLatLng', JSON.stringify(newLocation));
                                
                                // Update redux state
                                dispatch(setZoneData(response.data.zone_data));
                                dispatch(setlocation(newLocation))
                                dispatch(setUserLocationUpdate(!userLocationUpdate));
                                if (geoCodeResults?.data?.results && geoCodeResults.data?.results.length > 0) {
                                    const addressComponents = geoCodeResults.data.results[0].address_components;
                                    
                                    // Initialize location details object
                                    const locationDetails = {address:{
                                        areaCode: '',
                                        street: '',
                                        road: '',
                                        building: '',
                                        country: '',
                                        city: '',
                                        state: '',
                                        formattedAddress: geoCodeResults.data.results[0].formatted_address
                                    }};
                                    
                                    // Extract components from Google's response
                                    addressComponents.forEach(component => {
                                        const types = component.types;
                                        
                                        if (types.includes('postal_code')) {
                                            locationDetails.address.areaCode = component.long_name;
                                        }
                                        if (types.includes('route')) {
                                            locationDetails.address.road = component.long_name;
                                        }
                                        if (types.includes('street_number')) {
                                            locationDetails.address.street = component.long_name;
                                        }
                                        if (types.includes('premise') || types.includes('subpremise')) {
                                            locationDetails.address.building = component.long_name;
                                        }
                                        if (types.includes('country')) {
                                            locationDetails.address.country = component.long_name;
                                        }
                                        if (types.includes('locality') || types.includes('sublocality')) {
                                            locationDetails.address.city = component.long_name;
                                        }
                                        if (types.includes('administrative_area_level_1')) {
                                            locationDetails.address.state = component.long_name;
                                        }
                                    });
                                    
                                    // Store the detailed location information
                                    localStorage.setItem('locationDetails', JSON.stringify(locationDetails));
                                }  
                                // Show success message
                                CustomToaster('success', 'New location has been set.');
                                
                                // Handle redirection
                                if (redirectUrl) {
                                    if (redirectUrl?.query === undefined) {
                                        router.push({ pathname: redirectUrl?.pathname });
                                    } else {
                                        router.push({
                                            pathname: redirectUrl?.pathname,
                                            query: {
                                                restaurantType: redirectUrl?.query,
                                            },
                                        });
                                    }
                                } else {
                                    router.push('/home');
                                }
                                
                                // Close the modal
                                handleClose();
                                
                            } catch (e) {
                                console.error("Error saving location", e);
                                CustomToaster('error', 'Error saving location. Please try again.');
                                setIsLoadingGeolocation(false);
                            }
                        } else {
                            setIsLoadingGeolocation(false);
                            CustomToaster('error', 'Could not determine your address. Please try again.');
                        }
                    })
                    .catch((error) => {
                        setIsLoadingGeolocation(false);
                        console.error("Geocoding error:", error);
                        CustomToaster('error', 'Could not determine your address. Please try again.');
                    });
            } else {
                setIsLoadingGeolocation(false);
                CustomToaster('error', 'Your location is not within our service area. Please select a different location.');
            }
        })
        .catch((error) => {
            setIsLoadingGeolocation(false);
            console.error("Zone error:", error);
            CustomToaster('error', 'Could not determine your service area. Please try again.');
        });
};
    //////////////////////////////////////////

    // Check if location is valid
    const isValidLocation = (loc) => {
        if (!loc) return false;
        try {
            const lat = typeof loc.lat === 'function' ? loc.lat() : parseFloat(loc.lat);
            const lng = typeof loc.lng === 'function' ? loc.lng() : parseFloat(loc.lng);
            return !isNaN(lat) && !isNaN(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
        } catch (e) {
            return false;
        }
    };

    // Geolocation hook
    const { coords, isGeolocationAvailable, isGeolocationEnabled, getPosition } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 10000
            },
            watchPosition: false,
            userDecisionTimeout: 10000,
            suppressLocationOnMount: false,
        });

    // Store coords in state when they become available
    useEffect(() => {
        if (coords && coords.latitude && coords.longitude) {
            setCurrentLocation({
                lat: coords.latitude,
                lng: coords.longitude,
            });
        }
    }, [coords]);

    // Place search query
    const {
        isLoading: placesIsLoading,
        data: places,
        refetch: refetchPlaces
    } = useQuery(
        ['places', searchKey],
        async () => GoogleApi.placeApiAutocomplete(searchKey),
        {
            enabled: !!searchKey && searchKey.length > 1,
            onSuccess: (data) => {
                console.log("places data is", data)
                if (data?.data?.predictions) {
                    setPredictions(data.data.predictions);
                }
            },
            onError: (error) => {
                console.error("Places search error:", error);
                setPredictions([]);
            }
        }
    );

    // Place details query
    const { isLoading: isLoading2, data: placeDetails } = useQuery(
        ['placeDetails', placeId],
        async () => GoogleApi.placeApiDetails(placeId),
        {
            enabled: placeDetailsEnabled,
            onSuccess: () => setLoadingAuto(false),
            onError: onSingleErrorResponse,
            retry: 1,
        }
    );

    // Zone ID query
    const {
        isLoading: locationLoading,
        data: zoneData,
        isError: isErrorLocation,
        refetch: locationRefetch,
    } = useQuery(
        ['zoneId', location],
        async () => {
            console.log("Fetching zone ID for location:", location); // Debugging
            const response = await GoogleApi.getZoneId(location);
            console.log("Zone API Response:", response); // Debugging
            return response;
        },
        {
            enabled: locationEnabled,
            onError: (error) => {
                console.error("Zone API Error:", error); // Debugging
                onErrorResponse(error);
            },
            retry: 1,
        }
    );

    // Geocode query
    const { data: geoCodeResults, refetch: refetchCurrentLocation } = useQuery(
        ['geocode-api', location],
        async () => GoogleApi.geoCodeApi(location)
    );

    // Update place details when received
    useEffect(() => {
        if (placeDetails && placeDetails.data && placeDetails.data.result?.geometry?.location) {
            const resultLocation = placeDetails.data.result.geometry.location;
    
            // Normalize the location to ensure valid coordinates
            const normalizedLocation = normalizeLocation(resultLocation);
    
            // Update the location state
            setLocation(normalizedLocation);
    
            // Force map rerender
            setRerenderMap(prev => !prev);
    
            // Reset after successful update
            setTimeout(() => {
                setPlaceDetailsEnabled(false);
            }, 500);
        }
    }, [placeDetails]);

   
    useEffect(() => {
        if (locationEnabled && location && location.lat && location.lng) {
            console.log("Fetching zone ID for valid location:", location); // Debugging
            locationRefetch();
        } else {
            console.error("Invalid location:", location); // Debugging
        }
    }, [locationEnabled, location, locationRefetch]);
    // Update zone data when it changes
    useEffect(() => {
        if (zoneData) {
            console.log("Zone Data:", zoneData); // Debugging
            if (zoneData?.data?.zone_id) {
                setZoneId(zoneData.data.zone_id);
                dispatch(setZoneData(zoneData?.data?.zone_data));
            } else {
                console.error("Zone ID not found in response:", zoneData); // Debugging
                CustomToaster('error', 'Your location is not within our service area.');
            }
            setLocationEnabled(false);
        }
    }, [zoneData, dispatch, locationEnabled]);
    
    useEffect(() => {
        if (geoCodeResults && geoCodeResults.data && geoCodeResults.data.results && geoCodeResults.data.results.length > 0) {
            console.log("Geocode Results:", geoCodeResults); // Debugging
            setCurrentLocationValue({
                description: geoCodeResults.data.results[0].formatted_address || '',
            });
        } else {
            setCurrentLocationValue({ description: '' });
        }
    }, [geoCodeResults]);

    // Update predictions when places data changes
    useEffect(() => {
        if (places && places.data && places.data.predictions) {
            setPredictions(places.data.predictions);
        }
    }, [places]);
    console.log("places prediction", predictions);

    // Handle current location selection
    const handleAgreeLocation = async () => {
        setIsLoadingGeolocation(true);

        // If coords are already available, use them directly
        if (coords && coords.latitude && coords.longitude) {
            useCurrentLocationCoordinates(coords);
        } else {
            // If coords aren't available yet, try to get them manually
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        useCurrentLocationCoordinates({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            accuracy: position.coords.accuracy
                        });
                    },
                    (error) => {
                        console.error("Geolocation error:", error);
                        setIsLoadingGeolocation(false);
                        setIsEnableLocation(true);
                        CustomToaster('error', 'Could not get your location. Please check your browser settings.');
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0
                    }
                );
            } else {
                console.error("Geolocation not available");
                setIsLoadingGeolocation(false);
                setIsEnableLocation(true);
                CustomToaster('error', 'Geolocation is not supported by your browser.');
            }
        }
    };

    // Helper function to handle coordinates once we have them
    const useCurrentLocationCoordinates = (coordinates) => {
        const newLocation = {
            lat: coordinates.latitude,
            lng: coordinates.longitude
        };

        // Update state with current coordinates
        setLocation(newLocation);
        setLocationEnabled(true);

        // Fetch location details with these coordinates
        refetchCurrentLocation()
            .then(() => {
                // Update rendering to show new location
                setRerenderMap((prevState) => !prevState);
                setIsLoadingGeolocation(false);
            })
            .catch((error) => {
                console.error("Error fetching location details:", error);
                setIsLoadingGeolocation(false);
                CustomToaster('error', 'Error fetching location details.');
            });
    };

    // Handle location selection from autocomplete
    const handleLocationSelection = (value) => {
        if (!value) return;
    
        // Set place details to be fetched
        setPlaceId(value.place_id);
        setPlaceDescription(value.description || '');
        setPlaceDetailsEnabled(true); // Enable place details fetch
        setLocationEnabled(true); // Enable zone ID fetch

    };

    // Handle final location selection for saving
    const handlePickLocationOnClick = (e) => {
    
        console.log("Location:", location); // Debugging
        console.log("Zone ID:", zoneId); // Debugging
        console.log("Geocode Results:", geoCodeResults); // Debugging
    
        if (zoneId && geoCodeResults && location) {
            try {
                // Save location data to localStorage
                localStorage.setItem('zoneid', JSON.stringify(zoneId));
                if (geoCodeResults?.data?.results[0]?.formatted_address) {
                    localStorage.setItem(
                        'location',
                        JSON.stringify(geoCodeResults.data.results[0].formatted_address)
                    );
                }
                localStorage.setItem('currentLatLng', JSON.stringify(location));
                //
                if (geoCodeResults?.data?.results && geoCodeResults.data?.results.length > 0) {
                    const addressComponents = geoCodeResults.data.results[0].address_components;
                    
                    // Initialize location details object
                    const locationDetails = {address:{
                        areaCode: '',
                        street: '',
                        road: '',
                        building: '',
                        country: '',
                        city: '',
                        state: '',
                        formattedAddress: geoCodeResults.data.results[0].formatted_address
                    }};
                    
                    // Extract components from Google's response
                    addressComponents.forEach(component => {
                        const types = component.types;
                        
                        if (types.includes('postal_code')) {
                            locationDetails.address.areaCode = component.long_name;
                        }
                        if (types.includes('route')) {
                            locationDetails.address.road = component.long_name;
                        }
                        if (types.includes('street_number')) {
                            locationDetails.address.street = component.long_name;
                        }
                        if (types.includes('premise') || types.includes('subpremise')) {
                            locationDetails.address.building = component.long_name;
                        }
                        if (types.includes('country')) {
                            locationDetails.address.country = component.long_name;
                        }
                        if (types.includes('locality') || types.includes('sublocality')) {
                            locationDetails.address.city = component.long_name;
                        }
                        if (types.includes('administrative_area_level_1')) {
                            locationDetails.address.state = component.long_name;
                        }
                    });
                    
                    // Store the detailed location information
                    localStorage.setItem('locationDetails', JSON.stringify(locationDetails));
                }  
                //
                // Update redux state
                dispatch(setUserLocationUpdate(!userLocationUpdate));
                dispatch(setlocation(location))
                // Show success message
                CustomToaster('success', 'New location has been set.');
    
                // Handle redirection
                if (redirectUrl) {
                    if (redirectUrl?.query === undefined) {
                        router.push({ pathname: redirectUrl?.pathname });
                    } else {
                        router.push({
                            pathname: redirectUrl?.pathname,
                            query: {
                                restaurantType: redirectUrl?.query,
                            },
                        });
                    }
                } else {
                    router.push('/home');
                }
            } catch (e) {
                console.error("Error saving location", e);
                CustomToaster('error', 'Error saving location. Please try again.');
            }
        }
    
        handleClose();
    };

    // Modal click handler to prevent event propagation
    const handleModalContentClick = (e) => {
    };

    // Autocomplete change handler
    const handleAutocompleteChange = (event, value) => {
        // Prevent event propagation
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (value) {
            if (typeof value === 'string') {
                setSearchKey(value);
            } else if (value.place_id) {
                setPlaceId(value.place_id);
                setPlaceDescription(value.description || '');
                setPlaceDetailsEnabled(true);
            }
        }
    };

    // Handle selection of autocomplete option
    const handleAutocompleteOptionClick = (event, option) => {
        event.preventDefault();
        event.stopPropagation();

        setPlaceId(option.place_id);
        setPlaceDescription(option.description || '');
        setPlaceDetailsEnabled(true);

        // Return false to prevent default behavior
        return false;
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            disableAutoFocus={true}
            disableEnforceFocus={true}
            disableRestoreFocus={true}
            BackdropProps={{
                onClick: (e) => {
                    // Only close if clicking directly on the backdrop
                    if (e.target === e.currentTarget) {
                        handleClose();
                    }
                }
            }}
        >
            <CustomBoxWrapper onClick={handleModalContentClick}>
                <Grid container spacing={1}>
                    <Grid item md={12}>
                        <Typography
                            fontWeight="600"
                            fontSize={{ xs: '14px', sm: '16px' }}
                            color={theme.palette.neutral[1000]}
                        >
                            {t('Pick Location')}
                        </Typography>
                        <Typography
                            fontSize={{ xs: '12px', sm: '14px' }}
                            color={theme.palette.neutral[1000]}
                        >
                            {t('Sharing your accurate location enhances precision in search results and delivery estimates, ensures effortless order delivery.')}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={8}>
                        <Paper sx={{ outline: 'none' }} >
                            {loadingAuto ? (
                                <Skeleton
                                    width="100%"
                                    height="55px"
                                    variant="rectangular"
                                />
                            ) : (
                                <Autocomplete
                                    fullWidth
                                    freeSolo
                                    id="location-autocomplete"
                                    getOptionLabel={(option) => {
                                        if (!option) return '';
                                        return option.description || (typeof option === 'string' ? option : '');
                                    }}
                                    options={predictions || []}
                                    onChange={(event, value) => {
                                        if (value && typeof value !== 'string' && value.place_id) {
                                            handleLocationSelection(value); // Call the selection handler
                                        }
                                    }}
                                    onInputChange={(event, newInputValue) => {
                                        setSearchKey(newInputValue);
                                    }}
                                    clearOnBlur={false}
                                    value={currentLocationValue || { description: '' }}
                                    loading={placesIsLoading}
                                    isOptionEqualToValue={(option, value) => {
                                        if (!option || !value) return false;
                                        if (option.place_id && value.place_id) return option.place_id === value.place_id;
                                        return option.description === value.description;
                                    }}
                                    PopperComponent={(props) => (
                                        <Popper
                                            {...props}
                                            style={{
                                                zIndex: 9999,
                                                width: props.style?.width
                                            }}
                                            modifiers={[
                                                {
                                                    name: 'preventOverflow',
                                                    enabled: true,
                                                    options: {
                                                        altAxis: true,
                                                        altBoundary: true,
                                                        tether: true,
                                                        rootBoundary: 'document',
                                                        padding: 8,
                                                    },
                                                },
                                            ]}
                                        />
                                    )}
                                    renderInput={(params) => (
                                        <CssTextField
                                            label={null}
                                            {...params}
                                            placeholder={t('Search location here...')}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    refetchPlaces();
                                                }
                                            }}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <React.Fragment>
                                                        {placesIsLoading ? (
                                                            <CircularProgress color="inherit" size={20} />
                                                        ) : null}
                                                        {params.InputProps.endAdornment}
                                                    </React.Fragment>
                                                ),
                                            }}
                                        />
                                    )}
                                    noOptionsText={t('No locations found')}
                                    loadingText={t('Search suggestions are loading...')}
                                    renderOption={(props, option) => {
                                        // Remove the bullet point styling by filtering out className that contains 'MuiAutocomplete-option'
                                        const filteredProps = {
                                            ...props,
                                            className: props.className
                                                .split(' ')
                                                .filter(className => !className.includes('MuiAutocomplete-option'))
                                                .join(' ')
                                        };

                                        return (
                                            <li
                                                {...filteredProps}
                                                key={option.place_id || option.description}
                                                style={{
                                                    padding: '12px 16px',
                                                    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                                                    fontSize: '14px',
                                                    fontWeight: 400,
                                                    cursor: 'pointer',
                                                    backgroundColor: '#272424',
                                                    color: 'rgb(255, 255, 255)',
                                                    listStyle: 'none',
                                                    display: 'block',
                                                    width: '100%'
                                                }}
                                            >
                                                {option.description}
                                            </li>
                                        );
                                    }}
                                    ListboxProps={{
                                        style: {
                                            maxHeight: '280px',
                                            padding: 0,
                                            margin: 0,
                                            backgroundColor: '#272424',
                                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                                            borderRadius: '4px',
                                            overflow: 'auto'
                                        }
                                    }}
                                    PaperComponent={(props) => (
                                        <Paper
                                            {...props}
                                            elevation={6}
                                            style={{
                                                borderRadius: '4px',
                                                backgroundColor: '#272424',
                                                overflow: 'hidden',
                                                margin: 0,
                                                padding: 0
                                            }}
                                        />
                                    )}
                                    sx={{
                                        '& .MuiAutocomplete-listbox': {
                                            padding: 0,
                                            margin: 0,
                                            '& .MuiAutocomplete-option': {
                                                padding: 0,
                                                margin: 0,
                                                listStyle: 'none' // This should remove bullet points
                                            }
                                        }
                                    }}
                                />
                            )}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <LoadingButton
                            sx={{
                                fontSize: { xs: '13px', sm: '14px' },
                                width: '100%',
                                padding: { xs: '12px', sm: '13.5px' },
                                color: (theme) => theme.palette.whiteContainer.main,
                            }}
                            onClick={(e) => {
                                handleUseCurrentLocation();
                            }}
                            startIcon={<GpsFixedIcon />}
                            loadingPosition="start"
                            variant="contained"
                            loading={isLoadingGeolocation}
                        >
                            {t('Use Current Location')}
                        </LoadingButton>
                    </Grid>
                </Grid>
                <Box
                    spacing={2}
                    className="mapsearch"
                    sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: '10px',
                    }}
                >
                    <button
                        onClick={(e) => {
                            handleClose();
                        }}
                        className="closebtn"
                    >
                        <CloseIcon sx={{ fontSize: '16px' }} />
                    </button>
                </Box>

                <Box
                    id="modal-modal-description"
                    sx={{
                        mt: 2,
                        color: (theme) => theme.palette.neutral[1000],
                        Height: '400px',
                    }}
                >
                    <ErrorBoundary
                        FallbackComponent={(props) => <MapFallback t={t} {...props} />}
                        onReset={() => setRerenderMap(prev => !prev)}
                    >
                        {location && isValidLocation(location) && googleMapsAvailable ? (
                            <Box >
                                <GoogleMapComponent
                                    setDisablePickButton={setDisablePickButton}
                                    setLocationEnabled={setLocationEnabled}
                                    setLocation={(loc) => setLocation(normalizeLocation(loc))}
                                    setCurrentLocation={(loc) => setCurrentLocation(normalizeLocation(loc))}
                                    locationLoading={locationLoading || isLoadingGeolocation}
                                    location={location}
                                    setPlaceDetailsEnabled={setPlaceDetailsEnabled}
                                    placeDetailsEnabled={placeDetailsEnabled}
                                    locationEnabled={locationEnabled}
                                    setPlaceDescription={setPlaceDescription}
                                />
                            </Box>
                        ) : (
                            <CustomStackFullWidth
                                alignItems="center"
                                justifyContent="center"
                                sx={{ minHeight: '400px' }}
                            >
                                <FacebookCircularProgress />
                                <CustomTypographyGray nodefaultfont="true">
                                    {googleMapsAvailable
                                        ? t('Please wait sometimes')
                                        : t('Loading map resources...')}
                                </CustomTypographyGray>
                            </CustomStackFullWidth>
                        )}
                    </ErrorBoundary>

                    <CustomStackFullWidth
                        justifyContent="center"
                        alignItems="center"
                    >
                        {!!location && (
                            <PrimaryButton
                                align="center"
                                aria-label="picklocation"
                                sx={{
                                    flex: '1 0',
                                    width: '100%',
                                    top: '.7rem',
                                }}
                                disabled={!location || !isValidLocation(location)}
                                variant="contained"
                                onClick={(e) => {
                                    handlePickLocationOnClick(e);
                                }}
                            >
                                {t('Pick Locations')}
                            </PrimaryButton>
                        )}
                    </CustomStackFullWidth>
                </Box>
                <LocationEnableCheck
                    openLocation={isEnableLocation}
                    handleCloseLocation={() => setIsEnableLocation(false)}
                    isGeolocationEnabled={true}
                    t={t}
                    coords={coords}
                    handleAgreeLocation={handleAgreeLocation}
                />
            </CustomBoxWrapper>
        </Modal>
    )
}

export default MapModal