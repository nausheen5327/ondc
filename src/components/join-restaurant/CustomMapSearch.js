import React from 'react'
import { CustomStackFullWidth } from '../../styled-components/CustomStyles.style'
import { Autocomplete, Button, CircularProgress, Paper, Stack, styled, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'
import SearchIcon from '@mui/icons-material/Search';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { GoogleApi } from '@/hooks/react-query/config/googleApi';
import { useTheme } from '@emotion/react';
import GpsFixedIcon from '@mui/icons-material/GpsFixed'
import { LoadingButton } from '@mui/lab';
import { setUserLocationUpdate, setZoneData } from '@/redux/slices/global';
import { useDispatch, useSelector } from 'react-redux';
import { CustomToaster } from '../custom-toaster/CustomToaster';

const CssTextField = styled(TextField)(({ theme, border }) => ({
    '& label.Mui-focused': {
        color: '#EF7822',
        background: '#272424',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#EF7822',
        background: '#272424',
    },
    '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
    },
    '& .MuiFormLabel-root': {
        lineHeight: "1em !important",
        fontSize: "14px",
    },
    '& .MuiOutlinedInput-input': {
        fontWeight: "400",
    },
    '& .MuiOutlinedInput-root': {
        height: '45px',
        padding: '4px 4px 4px 16px',
        fontSize: "14px",
        fontWeight: "400 !important",
        border: border ? border : '',
        '& fieldset': {
            borderColor: '#EF7822',
        },
        '&:hover fieldset': {
            borderColor: '#EF7822',
            border: `1px solid ${border}`,
        },
        '&.Mui-focused fieldset': {
            borderColor: '#EF7822',
        },
    },
}))

// Fix: Update styling for the autocomplete dropdown to match the desired design
const CustomAutocomplete = styled(Autocomplete)(({ theme }) => ({
    '& .MuiAutocomplete-popper': {
        zIndex: 1500, // Ensure popover appears above other elements
    },
    '& .MuiAutocomplete-paper': {
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        backgroundColor: '#000', // Black background
    },
    '& .MuiAutocomplete-listbox': {
        padding: '0',
        backgroundColor: '#000', // Black background
        color: '#fff', // White text color
        '& .MuiAutocomplete-option': {
            padding: '12px 16px',
            borderBottom: '1px solid #333',
            color: '#fff', // White text color
            '&:last-child': {
                borderBottom: 'none',
            },
            '&.Mui-focused': {
                backgroundColor: 'rgba(239, 120, 34, 0.15)',
            },
        },
        '& .MuiAutocomplete-option::before': {
            content: 'none',
        },
        '& .MuiAutocomplete-option::marker': {
            display: 'none',
        },
    },
    // Add loading text color
    '& .MuiAutocomplete-loading': {
        color: '#fff',
    },
    // Add no options text color
    '& .MuiAutocomplete-noOptions': {
        color: '#fff',
    },
    '& .MuiAutocomplete-option::before': {
        content: 'none', // Remove bullet points
    },
    '& .MuiAutocomplete-option::marker': {
        display: 'none', // Remove bullet points in some browsers
    },

}));

// Current Location Button
const CurrentLocationButton = styled(Button)(({ theme }) => ({
    height: '45px',
    backgroundColor: '#EF7822',
    color: 'white',
    '&:hover': {
        backgroundColor: '#d56a1c',
    },
    whiteSpace: 'nowrap',
    minWidth: 'auto',
    padding: '0 14px',
}));

const CustomMapSearch = ({
    border,
    setSearchKey,
    setEnabled,
    predictions,
    setPlaceId,
    setPlaceDescription,
    setPlaceDetailsEnabled,
    searchKey,
    placeDescription,
    isLoadingPlacesApi,
    currentLocationValue,
    setLocation,
handleClose}) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const [isGettingLocation, setIsGettingLocation] = React.useState(false);
        const dispatch = useDispatch();
    // Function to get place details using our GoogleApi utility
    const fetchPlaceDetails = async (placeId) => {
        if (!placeId) return;

        try {
            console.log("Fetching place details for:", placeId);

            // Use the existing API utility
            const response = await GoogleApi.placeApiDetails(placeId);

            if (response?.data?.result?.geometry?.location) {
                const location = response.data.result.geometry.location;

                // Make sure we have valid lat/lng
                if (location &&
                    typeof location.lat !== 'undefined' &&
                    typeof location.lng !== 'undefined') {

                    const newLocation = {
                        lat: location.lat,
                        lng: location.lng
                    };

                    console.log('New location from place details:', newLocation);

                    // Update location with the new coordinates
                    if (setLocation) {
                        setLocation(newLocation);
                    }

                    // Save to localStorage
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('currentLatLng', JSON.stringify(newLocation));
                    }
                }
            } else {
                console.warn('Place details did not contain location data', response);
            }
        } catch (error) {
            console.error('Error fetching place details:', error);
        }
    };

    // Update location and reverse geocode to get address
    const updateAndReverseGeocode = async (newLocation) => {
        if (!newLocation || typeof newLocation.lat === 'undefined' || typeof newLocation.lng === 'undefined') {
            return;
        }

        try {
            // First update location state
            setPlaceDetailsEnabled(false);

            // Save to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('currentLatLng', JSON.stringify(newLocation));
            }

            // Update location with the new coordinates
            if (setLocation) {
                setLocation(newLocation);
            }

            // Reverse geocode to get address
            const response = await GoogleApi.geoCodeApi(newLocation);

            if (response?.data?.results && response.data.results.length > 0) {
                const address = response.data.results[0].formatted_address;
                setPlaceDescription(address);
                console.log("Address from reverse geocoding:", address);

                // Update search key display
                setSearchKey({
                    description: address,
                });
            } else {
                setPlaceDescription(undefined);
                setSearchKey({
                    description: `${newLocation.lat.toFixed(6)}, ${newLocation.lng.toFixed(6)}`,
                });
            }

            console.log("Location updated:", newLocation);
        } catch (error) {
            console.error("Error in updateAndReverseGeocode:", error);
            // Still update location even if geocoding fails
            if (setLocation) {
                setLocation(newLocation);
            }
        }
    };

    const { global, userLocationUpdate } = useSelector(
        (state) => state.globalSettings
    );

    const handleCurrentLocation = async () => {
        setIsGettingLocation(true);
    
        // If coords are already available, use them directly
        
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
                        setIsGettingLocation(false);
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
                setIsGettingLocation(false);
                CustomToaster('error', 'Geolocation is not supported by your browser.');
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
                                    dispatch(setUserLocationUpdate(!userLocationUpdate));
                                    
                                    // Show success message
                                    CustomToaster('success', 'New location has been set.');
                                    
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

    return (
        <>
            <CustomStackFullWidth mb="1rem">
                <Stack
                    direction="row"
                    flexWrap={'wrap'}
                    spacing={1}
                    width="100%"
                    alignItems="center"
                >
                    <Paper
                        variant="outlined"
                        sx={{
                            width: '100%',
                            position: 'relative',
                            backgroundColor: '#272424',
                        }}
                    >
                        <CustomAutocomplete
                            fullWidth
                            freeSolo
                            id="combo-box-demo"
                            getOptionLabel={(option) => option.description || ''}
                            options={predictions || []}
                            value={currentLocationValue}
                            loading={isLoadingPlacesApi}
                            loadingText={t('Loading...')}
                            onChange={(event, value) => {
                                if (value) {
                                    if (value.place_id) {
                                        const placeId = value.place_id;
                                        setPlaceId(placeId);
                                        setPlaceDescription(value?.description);

                                        // Fetch coordinates for the selected place
                                        fetchPlaceDetails(placeId);
                                    }
                                }
                                setPlaceDescription(value?.description);
                                setPlaceDetailsEnabled(true);
                            }}
                            clearOnBlur={false}
                            PopperComponent={(props) => (
                                <div {...props} style={{ zIndex: 9999 }}>
                                    {props.children}
                                </div>
                            )}
                            ListboxProps={{
                                style: {
                                    paddingTop: 0,
                                    paddingBottom: 0,
                                    listStyle: 'none',
                                }
                            }}
                            renderOption={(props, option) => (
                                <li {...props} style={{
                                    padding: '4px 8px',
                                    listStyleType: 'none',
                                    display: 'block',
                                    width: '100%'
                                }}>
                                    {option.description}
                                </li>
                            )}
                            renderInput={(params) => (
                                <CssTextField
                                    border={border}
                                    {...params}
                                    placeholder={t('Search location here...')}
                                    onChange={(event) => {
                                        setSearchKey({
                                            description: event.target.value,
                                        })
                                        if (event.target.value) {
                                            setEnabled(true)
                                        } else {
                                            setEnabled(false)
                                        }
                                    }}
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <>
                                                <SearchIcon color="disabled" sx={{ fontSize: "1.7rem" }} />
                                                {params.InputProps.startAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                        />
                    </Paper>
                    {/* Current Location Button */}
                    <Stack
                        sx={{
                            color: '#666',
                            fontWeight: 500,
                            px: 1,
                            textAlign: 'center',
                            margin:'auto'
                        }}
                    >
                        {t('or')}
                    </Stack>
                    {isGettingLocation ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (

                        <LoadingButton
                            sx={{
                                fontSize: { xs: '12px', sm: '12px' },
                                width: '100%',
                                paddingTop: { xs: '8px', sm: '8px' },
                                paddingBottom: { xs: '4px', sm: '4px' },
                                paddingLeft: '0px',
                                paddingRight: '0px',
                                color: (theme) => theme.palette.whiteContainer.main,
                            }}
                            startIcon={<GpsFixedIcon />}
                            onClick={handleCurrentLocation}
                            disabled={isGettingLocation}
                            loadingPosition="start"
                            variant="contained"
                            loading={isGettingLocation}
                        >
                            {t('Use Current Location')}
                        </LoadingButton>

                    )}
                </Stack>
            </CustomStackFullWidth>
        </>
    )
}

export default CustomMapSearch