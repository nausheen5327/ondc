import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { GoogleApi } from "@/hooks/react-query/config/googleApi";
import { setDetailedLocation, setFormattedAddress, setLocation, setZoneIds } from "@/redux/slices/addressData";


export const useGetLocation = (coords) => {
    const dispatch = useDispatch();
    const { global } = useSelector((state) => state.globalSettings)
    const { location, formatted_address } = useSelector((state) => state.addressData)
    const [isDisablePickButton, setDisablePickButton] = useState(false);
    const [locationEnabled, setLocationEnabled] = useState(false);
    const [searchKey, setSearchKey] = useState({ description: '' });
    const [enabled, setEnabled] = useState(false);
    const [placeDetailsEnabled, setPlaceDetailsEnabled] = useState(false);
    const [placeDescription, setPlaceDescription] = useState(undefined);
    const [zoneId, setZoneId] = useState(undefined);
    const [mounted, setMounted] = useState(true);
    const [predictions, setPredictions] = useState([]);
    const [placeId, setPlaceId] = useState('');
    const [value, setValue] = useState();
    const [currentLocationValue, setCurrentLocationValue] = useState({
        description: '',
    })

    const {
        data: places,
        isLoading: isLoadingPlacesApi,

        // refetch: placeApiRefetch,
    } = useQuery(
        ['places', searchKey.description],
        async () => GoogleApi.placeApiAutocomplete(searchKey.description),
        { enabled },
        {
            retry: 1,
            // cacheTime: 0,
        }
    )
    let locations = undefined
    if (typeof window !== 'undefined') {
        locations = localStorage.getItem('location')
    }
    useEffect(() => {
        if (global?.default_location) {
            // dispatch(setLocation(
            //     global?.default_location
            // ))
        }
    }, [global?.default_location])
    // useEffect(() => {
    //     if (coords) {
    //         dispatch(setLocation(
    //             {
    //                 lat: coords?.latitude,
    //                 lng: coords?.longitude,
    //             }
    //         ))
    //     }
    // }, [coords]);

    const {
        isLoading: locationLoading,
        data: zoneData,
        isError: isErrorLocation,
        error: errorLocation,
        refetch: locationRefetch,
    } = useQuery(
        ['zoneId', location],
        async () => GoogleApi.getZoneId(location),
        { enabled: locationEnabled },
        {
            retry: 1,
            // cacheTime: 0,
        }
    )
    const {
        isLoading: isLoading2,
        data: placeDetails,
        isError: isErrorTwo,
        error: errorTwo,
        refetch: placeApiRefetchOne,
    } = useQuery(
        ['placeDetails', placeId],
        async () => GoogleApi.placeApiDetails(placeId),
        { enabled: placeDetailsEnabled },
        {
            retry: 1,
            // cacheTime: 0,
        }
    )

    useEffect(() => {
        if (placeDetails) {
            // dispatch(setLocation(placeDetails?.data?.result?.geometry?.location))
            setLocationEnabled(true)
        }
    }, [placeDetails])
    useEffect(() => {
        if (places) {
            setPredictions(places?.data?.predictions)
        }
    }, [places])

    useEffect(() => {
        if (zoneData) {
            setZoneId(zoneData?.data?.zone_id)
            dispatch(setZoneIds(zoneData?.data?.zone_id))
            //  setLocation(undefined)
            setLocationEnabled(false)
            setMounted(false)
        }
        if (!zoneData) {
            setZoneId(undefined)
        }
    }, [zoneData])

    const {
        isLoading: geoCodeLoading,
        data: geoCodeResults,
        // refetch: placeApiRefetch,
    } = useQuery(['geocode-api', location], async () =>
        GoogleApi.geoCodeApi(location)
    )
    if (geoCodeResults) {
    }
    const setLocations = (value) => {
        // dispatch(setLocation(value))
    }
    useEffect(() => {
        if (geoCodeResults) {
            dispatch(setFormattedAddress(geoCodeResults?.data?.results[0]
                ?.formatted_address))
        }
        const addressComponents = geoCodeResults?.data?.results[0]?.address_components;
                                        
                                        // Initialize location details object
                                        const locationDetails = {address:{
                                            areaCode: '',
                                            street: '',
                                            road: '',
                                            building: '',
                                            country: '',
                                            city: '',
                                            state: '',
                                            formattedAddress: geoCodeResults?.data?.results[0]?.formatted_address
                                        }};
                                        
                                        // Extract components from Google's response
                                        addressComponents?.forEach(component => {
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
                                        // dispatch(setDetailedLocation(locationDetails))
    }, [geoCodeResults]);
    useEffect(() => {
        if (geoCodeResults) {
            setCurrentLocationValue({
                description:
                    geoCodeResults?.data?.results[0]?.formatted_address,
            })
        } else {
            setCurrentLocationValue({
                description: '',
            })
        }
    }, [geoCodeResults])
    return {
        isDisablePickButton,
        setDisablePickButton,
        locationEnabled,
        setLocationEnabled,
        searchKey,
        setSearchKey,
        enabled,
        setEnabled,
        placeDetailsEnabled,
        setPlaceDetailsEnabled,
        placeDescription,
        setPlaceDescription,
        zoneId,
        setZoneId,
        mounted,
        setMounted,
        predictions,
        setPredictions,
        placeId,
        setPlaceId,
        value,
        setValue,
        setLocation,
        setLocations,
        isLoadingPlacesApi,
        geoCodeLoading,
        currentLocationValue,
        setCurrentLocationValue

        // Other state variables and functions...
    };
}