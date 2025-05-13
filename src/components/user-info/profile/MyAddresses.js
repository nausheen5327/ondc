// import React from 'react'
// import {
//     CustomPaperBigCard,
//     CustomStackFullWidth,
// } from '../../../styled-components/CustomStyles.style'
// import { Grid, IconButton, Stack, Typography, useMediaQuery } from '@mui/material'
// import { CustomTypography } from '../../custom-tables/Tables.style'
// import { t } from 'i18next'
// import { PrimaryButton } from '../../products-page/FoodOrRestaurant'
// import EditIcon from '@mui/icons-material/Edit'
// import { useTheme } from '@mui/material/styles'
// import deleteImg from '../../../../public/static/Vector (5).png'
// import { useQuery } from 'react-query'
// import { AddressApi } from '../../../hooks/react-query/config/addressApi'
// import { onSingleErrorResponse } from '../../ErrorResponse'
// import AddressCard from '../address/AddressCard'
// import AddNewAddress from '../address/AddNewAddress'
// import CustomEmptyResult from '../../empty-view/CustomEmptyResult'
// import noData from '../../../../public/static/nodata.png'
// import Skeleton from '@mui/material/Skeleton'
// import { Scrollbar } from '../../Scrollbar'
// import ScrollerProvider from '../../scroller-provider'
// import { noAddressFound } from '../../../utils/LocalImages'
// import AddLocationIcon from '@mui/icons-material/AddLocation';
// import { useSelector } from 'react-redux'

// const MyAddresses = () => {
//     const theme = useTheme();
//     const isXs = useMediaQuery(theme.breakpoints.down("sm"))
//     const addresses = useSelector((state) => state.user.addressList);
//     return (
//         <CustomPaperBigCard padding={isXs ? "10px" : "15px 25px 25px"}>
//             <CustomStackFullWidth>
//                 <CustomStackFullWidth
//                     justifyContent="space-between"
//                     direction="row"
//                     alignItems="center"
//                     pb="10px"
//                 >
//                     <CustomTypography fontWeight="500">
//                         {t('My Addresses')}
//                     </CustomTypography>
//                     <AddNewAddress  />
//                 </CustomStackFullWidth>
//                 {addresses?.length === 0 ? (
//                     <Stack
//                         width="100%"
//                         alignItems="center"
//                         justifyContent="center"
//                         paddingBottom="35px"
//                     >
//                         <CustomEmptyResult
//                             label="No Address Found!"
//                             subTitle="Please add your address for better experience!"
//                             image={noAddressFound}
//                             height={79}
//                             width={94}
//                         />
//                     </Stack>
//                 ) : (
//                     <Grid container spacing={1.5}>
//                         {addresses?.length > 0
//                             ? addresses.map((address) => (
//                                 <Grid item xs={12} md={6} key={address?.id}>
//                                     <AddressCard
//                                         address={address}
//                                     />
//                                 </Grid>
//                             ))
//                             : isFetching && (
//                                 <>
//                                     <Grid item xs={12} md={6}>
//                                         <Skeleton
//                                             variant="rounded"
//                                             width="100%"
//                                             height={150}
//                                         />
//                                     </Grid>
//                                     <Grid item xs={12} md={6}>
//                                         <Skeleton
//                                             variant="rounded"
//                                             width="100%"
//                                             height={150}
//                                         />
//                                     </Grid>
//                                 </>
//                             )}
//                     </Grid>
//                 )}
//             </CustomStackFullWidth>
//         </CustomPaperBigCard>
//     )
// }

// export default MyAddresses

// import React, { useState, useEffect } from 'react';
// import {
//     CustomPaperBigCard,
//     CustomStackFullWidth,
// } from '../../../styled-components/CustomStyles.style';
// import { Grid, IconButton, Stack, Typography, useMediaQuery } from '@mui/material';
// import { CustomTypography } from '../../custom-tables/Tables.style';
// import { t } from 'i18next';
// import EditIcon from '@mui/icons-material/Edit';
// import { useTheme } from '@mui/material/styles';
// import AddNewAddress from '../address/AddNewAddress';
// import CustomEmptyResult from '../../empty-view/CustomEmptyResult';
// import Skeleton from '@mui/material/Skeleton';
// import { noAddressFound } from '../../../utils/LocalImages';
// import { useSelector, useDispatch } from 'react-redux';
// import AddressCard from '../address/AddressCard';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import toast from 'react-hot-toast';
// import { setUserLocationUpdate } from '@/redux/slices/global';
// import { setDetailedLocation } from '@/redux/slices/addressData';

// const MyAddresses = () => {
//     const theme = useTheme();
//     const dispatch = useDispatch();
//     const isXs = useMediaQuery(theme.breakpoints.down("sm"));
//     const addresses = useSelector((state) => state.user.addressList);
//     const [defaultAddress, setDefaultAddress] = useState(null);
//     const { openMapDrawer, userLocationUpdate } = useSelector((state) => state.globalSettings)

//     // Load default address from localStorage on component mount
//     useEffect(() => {
//         const savedDefaultAddress = localStorage.getItem('locationDetails');
//         if (savedDefaultAddress) {
//             setDefaultAddress(JSON.parse(savedDefaultAddress));
//         }
//     }, []);

//     // Handler for when an address is clicked
//     const handleAddressSelect = (address) => {
//         setDefaultAddress(address);

//         // Save to localStorage
//         localStorage.setItem('location', JSON.stringify(`${address.address.door}, ${address.address.building}, ${address.address.street},${address.address.city}, ${address.address.state}, ${address.address.country},${address.address.areaCode}`))
//         localStorage.setItem('locationDetails', JSON.stringify(address))
//         const values = { lat: address?.address?.lat, lng: address?.address?.lng }
//         localStorage.setItem('currentLatLng', JSON.stringify(values))
//         toast.success(t('New delivery address selected.'))
//         dispatch(setUserLocationUpdate(!userLocationUpdate))
//         dispatch(setDetailedLocation(address))



//     };

//     return (
//         <CustomPaperBigCard padding={isXs ? "10px" : "15px 25px 25px"}>
//             <CustomStackFullWidth>
//                 <CustomStackFullWidth
//                     justifyContent="space-between"
//                     direction="row"
//                     alignItems="center"
//                     pb="10px"
//                 >
//                     <CustomTypography fontWeight="500">
//                         {t('My Addresses')}
//                     </CustomTypography>
//                     <AddNewAddress  />
//                 </CustomStackFullWidth>
//                 {addresses?.length === 0 ? (
//                     <Stack
//                         width="100%"
//                         alignItems="center"
//                         justifyContent="center"
//                         paddingBottom="35px"
//                     >
//                         <CustomEmptyResult
//                             label="No Address Found!"
//                             subTitle="Please add your address for better experience!"
//                             image={noAddressFound}
//                             height={79}
//                             width={94}
//                         />
//                     </Stack>
//                 ) : (
//                     <Grid container spacing={1.5} sx={{ mt: 1 }}>
//                         {addresses?.length > 0
//                             ? addresses.map((address) => (
//                                 <Grid item xs={12} md={6} key={address?.id}>
//                                     <div 
//                                         onClick={() => handleAddressSelect(address)}
//                                         style={{ 
//                                             cursor: 'pointer',
//                                             position: 'relative',
//                                             borderRadius: '8px',
//                                             border: defaultAddress && defaultAddress.id === address.id 
//                                                 ? `2px solid ${theme.palette.primary.main}` 
//                                                 : '2px solid transparent',
//                                             boxShadow: defaultAddress && defaultAddress.id === address.id 
//                                                 ? `0 0 8px ${theme.palette.primary.main}` 
//                                                 : 'none',
//                                             transition: 'all 0.3s ease',
//                                             backgroundColor: defaultAddress && defaultAddress.id === address.id 
//                                                 ? 'transparent'
//                                                 : 'transparent'
//                                         }}
//                                         className="address-card-container"
//                                         onMouseOver={(e) => {
//                                             if (!defaultAddress || defaultAddress.id !== address.id) {
//                                                 e.currentTarget.style.boxShadow = '0 0 5px rgba(0,0,0,0.2)';
//                                                 e.currentTarget.style.transform = 'translateY(-2px)';
//                                             }
//                                         }}
//                                         onMouseOut={(e) => {
//                                             if (!defaultAddress || defaultAddress.id !== address.id) {
//                                                 e.currentTarget.style.boxShadow = 'none';
//                                                 e.currentTarget.style.transform = 'translateY(0)';
//                                             }
//                                         }}
//                                     >
//                                         {defaultAddress && defaultAddress.id === address.id && (
//                                             <div style={{
//                                                 position: 'absolute',
//                                                 top: '-10px',
//                                                 right: '-10px',
//                                                 zIndex: 1,
//                                                 backgroundColor: '#fff',
//                                                 borderRadius: '50%',
//                                                 boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
//                                             }}>
//                                                 <CheckCircleIcon 
//                                                     color="primary" 
//                                                     style={{ fontSize: '24px' }}
//                                                 />
//                                             </div>
//                                         )}
//                                         <AddressCard
//                                             address={address}
//                                         />
//                                         {defaultAddress && defaultAddress.id === address.id && (
//                                             <div style={{
//                                                 padding: '4px',
//                                                 backgroundColor:  'rgb(255 121 24 / 25%)',
//                                                 color: '#fff',
//                                                 borderBottomLeftRadius: '6px',
//                                                 borderBottomRightRadius: '6px',
//                                                 textAlign: 'center',
//                                                 marginTop: '-5px',
//                                                 fontWeight: 'bold',
//                                                 display: 'flex',
//                                                 justifyContent: 'center',
//                                                 alignItems: 'center'
//                                             }}>
//                                                 <CheckCircleIcon style={{ fontSize: '16px', marginRight: '4px' }} />
//                                                 <Typography variant="caption" style={{ fontWeight: 'bold' }}>
//                                                     Default Address
//                                                 </Typography>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </Grid>
//                             ))
//                             : isFetching && (
//                                 <>
//                                     <Grid item xs={12} md={6}>
//                                         <Skeleton
//                                             variant="rounded"
//                                             width="100%"
//                                             height={150}
//                                         />
//                                     </Grid>
//                                     <Grid item xs={12} md={6}>
//                                         <Skeleton
//                                             variant="rounded"
//                                             width="100%"
//                                             height={150}
//                                         />
//                                     </Grid>
//                                 </>
//                             )}
//                     </Grid>
//                 )}
//             </CustomStackFullWidth>
//         </CustomPaperBigCard>
//     );
// };

// export default MyAddresses;


import React, { useState, useEffect } from 'react';
import {
    CustomPaperBigCard,
    CustomStackFullWidth,
} from '../../../styled-components/CustomStyles.style';
import { Grid, IconButton, Stack, Typography, useMediaQuery, Button } from '@mui/material';
import { CustomTypography } from '../../custom-tables/Tables.style';
import { t } from 'i18next';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '@mui/material/styles';
import AddNewAddress from '../address/AddNewAddress';
import CustomEmptyResult from '../../empty-view/CustomEmptyResult';
import Skeleton from '@mui/material/Skeleton';
import { noAddressFound } from '../../../utils/LocalImages';
import { useSelector, useDispatch } from 'react-redux';
import AddressCard from '../address/AddressCard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import toast from 'react-hot-toast';
import { setUserLocationUpdate } from '@/redux/slices/global';
import { setDetailedLocation } from '@/redux/slices/addressData';
import { getCall, postCall } from '@/api/MainApi';
import { setAddressList } from '@/redux/slices/customer';

const MyAddresses = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const isXs = useMediaQuery(theme.breakpoints.down("sm"));
    const addresses = useSelector((state) => state.user.addressList);
    const [defaultAddress, setDefaultAddress] = useState(null);
    const { openMapDrawer, userLocationUpdate } = useSelector((state) => state.globalSettings);
    const [showAllAddresses, setShowAllAddresses] = useState(false);
    const { location, formatted_address, locationDetailed } = useSelector(
        (state) => state.addressData
    )
    // Load default address from localStorage on component mount
    useEffect(() => {
        const savedDefaultAddress = localStorage.getItem('locationDetails');
        if (savedDefaultAddress) {
            let locationSelected = JSON.parse(savedDefaultAddress);
            if (locationSelected.id) {
                setDefaultAddress(JSON.parse(savedDefaultAddress));
            } else {
                setShowAllAddresses(true);
            }

        }
    }, []);

    const fetchDeliveryAddress = async (newAddressId = null) => {
        try {
            const data = await getCall("/clientApis/v1/delivery_address");
            dispatch(setAddressList(data));
            if (newAddressId) {
                // If we just posted a new address, find and set it
                const newAddress = data.find(addr => addr.id === newAddressId);
                if (newAddress) {
                    handleAddressSelect(newAddress);
                }
            }
            localStorage.setItem('addressList', JSON.stringify(data));
        } catch (err) {
            console.error('Error fetching delivery address:', err);
            //   CustomToaster('error', 'Error fetching delivery address');
        } finally {
        }
    };


    const postUserLocation = async (customerValue) => {
        console.log("customer Value hhhhhhhhhhhhhhh",customerValue)
        postCall(`/clientApis/v1/delivery_address`, {
            descriptor: {
                name: customerValue?.contact_person_name.trim(),
                email: customerValue?.contact_person_email.trim(),
                phone: customerValue?.contact_person_number.trim(),
            },
            address: {
                areaCode: locationDetailed?.address?.areaCode.trim(),
                building: customerValue?.building.trim(),
                city: locationDetailed?.address?.city.trim(),
                country: "IND",
                door: customerValue?.house?.trim(),
                state: locationDetailed?.address?.state.trim(),
                street: customerValue?.road.trim(),
                tag: customerValue?.address_type,
                lat: customerValue?.latitude,
                lng: customerValue?.longitude,
            },
        }).then((data) => {
            fetchDeliveryAddress(data.id)
        }).catch((error) => {
        }).finally(() => {
        })


        //   dispatch(setlocation(null));
        //   dispatch(setAddressList([]));

    }

    // Handler for when an address is clicked
    const handleAddressSelect = (address) => {
        setDefaultAddress(address);
        // Save to localStorage
        localStorage.setItem('location', JSON.stringify(`${address.address.door}, ${address.address.building}, ${address.address.street},${address.address.city}, ${address.address.state}, ${address.address.country},${address.address.areaCode}`));
        localStorage.setItem('locationDetails', JSON.stringify(address));
        const values = { lat: address?.address?.lat, lng: address?.address?.lng };
        localStorage.setItem('currentLatLng', JSON.stringify(values));
        toast.success(t('New delivery address selected.'));
        dispatch(setUserLocationUpdate(!userLocationUpdate));
        dispatch(setDetailedLocation(address));

        // Hide all addresses after selection
        setShowAllAddresses(false);
    };

    // Toggle function for showing/hiding saved addresses
    const toggleSavedAddresses = () => {
        setShowAllAddresses(!showAllAddresses);
    };

    return (
        <CustomPaperBigCard padding={isXs ? "10px" : "15px 25px 25px"}>
            <CustomStackFullWidth>
                <CustomStackFullWidth
                    justifyContent="space-between"
                    direction="row"
                    alignItems="center"
                    pb="10px"
                >
                    <CustomTypography fontWeight="500">
                        {t('My Addresses')}
                    </CustomTypography>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Button
                            onClick={toggleSavedAddresses}
                            size="small"
                            endIcon={showAllAddresses ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                            sx={{
                                color: theme.palette.text.secondary,
                                fontSize: { xs: '11px', sm: '12px', md: '13px' },
                                padding: { xs: '4px 8px', sm: '5px 10px' },
                                minWidth: 'auto',
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                    color: theme.palette.primary.main,
                                }
                            }}
                        >
                            {t('Saved Addresses')}
                        </Button>
                        <AddNewAddress postUserLocation={postUserLocation} />
                    </Stack>
                </CustomStackFullWidth>
                {addresses?.length === 0 ? (
                    <Stack
                        width="100%"
                        alignItems="center"
                        justifyContent="center"
                        paddingBottom="35px"
                    >
                        <CustomEmptyResult
                            label="No Address Found!"
                            subTitle="Please add your address for better experience!"
                            image={noAddressFound}
                            height={79}
                            width={94}
                        />
                    </Stack>
                ) : (
                    <>
                        {/* Show only default address when not showing all addresses */}
                        {!showAllAddresses && defaultAddress && (
                            <div
                                style={{
                                    cursor: 'pointer',
                                    position: 'relative',
                                    borderRadius: '8px',
                                    border: `2px solid rgba(0,0,0)`,
                                    transition: 'all 0.3s ease',
                                    marginTop: '10px',
                                    marginBottom: '10px'
                                }}
                                className="address-card-container"
                            >
                                <div style={{
                                    position: 'absolute',
                                    top: '-10px',
                                    right: '-10px',
                                    zIndex: 1,
                                    backgroundColor: '#fff',
                                    borderRadius: '50%',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }}>
                                    <CheckCircleIcon
                                        color="primary"
                                        style={{ fontSize: '24px' }}
                                    />
                                </div>
                                <AddressCard
                                    address={defaultAddress}
                                />
                                <div style={{
                                    padding: '4px',
                                    backgroundColor: 'rgb(255 121 24 / 25%)',
                                    color: '#fff',
                                    borderBottomLeftRadius: '6px',
                                    borderBottomRightRadius: '6px',
                                    textAlign: 'center',
                                    marginTop: '-5px',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <CheckCircleIcon style={{ fontSize: '16px', marginRight: '4px' }} />
                                    <Typography variant="caption" style={{ fontWeight: 'bold' }}>
                                        Default Address
                                    </Typography>
                                </div>
                            </div>
                        )}

                        {/* Show all addresses when toggled */}
                        {showAllAddresses && (
                            <Grid container spacing={1.5} sx={{ mt: 1 }}>
                                {addresses?.length > 0
                                    ? addresses.map((address) => (
                                        <Grid item xs={12} md={6} key={address?.id}>
                                            <div
                                                style={{
                                                    cursor: 'pointer',
                                                    position: 'relative',
                                                    borderRadius: '8px',
                                                    border: defaultAddress && defaultAddress.id === address.id
                                                        ? `2px solid ${theme.palette.primary.main}`
                                                        : '2px solid transparent',
                                                    boxShadow: defaultAddress && defaultAddress.id === address.id
                                                        ? `0 0 8px ${theme.palette.primary.main}`
                                                        : 'none',
                                                    transition: 'all 0.3s ease',
                                                    backgroundColor: defaultAddress && defaultAddress.id === address.id
                                                        ? 'transparent'
                                                        : 'transparent'
                                                }}
                                                className="address-card-container"
                                                onMouseOver={(e) => {
                                                    if (!defaultAddress || defaultAddress.id !== address.id) {
                                                        e.currentTarget.style.boxShadow = '0 0 5px rgba(0,0,0,0.2)';
                                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                                    }
                                                }}
                                                onMouseOut={(e) => {
                                                    if (!defaultAddress || defaultAddress.id !== address.id) {
                                                        e.currentTarget.style.boxShadow = 'none';
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                    }
                                                }}
                                            >
                                                {defaultAddress && defaultAddress.id === address.id && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '-10px',
                                                        right: '-10px',
                                                        zIndex: 1,
                                                        backgroundColor: '#fff',
                                                        borderRadius: '50%',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                                    }}>
                                                        <CheckCircleIcon
                                                            color="primary"
                                                            style={{ fontSize: '24px' }}
                                                        />
                                                    </div>
                                                )}
                                                <AddressCard
                                                    address={address}
                                                    handleAddressSelect={handleAddressSelect}
                                                />
                                                {defaultAddress && defaultAddress.id === address.id && (
                                                    <div style={{
                                                        padding: '4px',
                                                        backgroundColor: 'rgb(255 121 24 / 25%)',
                                                        color: '#fff',
                                                        borderBottomLeftRadius: '6px',
                                                        borderBottomRightRadius: '6px',
                                                        textAlign: 'center',
                                                        marginTop: '-5px',
                                                        fontWeight: 'bold',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}>
                                                        <CheckCircleIcon style={{ fontSize: '16px', marginRight: '4px' }} />
                                                        <Typography variant="caption" style={{ fontWeight: 'bold' }}>
                                                            Default Address
                                                        </Typography>
                                                    </div>
                                                )}
                                            </div>
                                        </Grid>
                                    ))
                                    : isFetching && (
                                        <>
                                            <Grid item xs={12} md={6}>
                                                <Skeleton
                                                    variant="rounded"
                                                    width="100%"
                                                    height={150}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Skeleton
                                                    variant="rounded"
                                                    width="100%"
                                                    height={150}
                                                />
                                            </Grid>
                                        </>
                                    )}
                            </Grid>
                        )}
                    </>
                )}
            </CustomStackFullWidth>
        </CustomPaperBigCard>
    );
};

export default MyAddresses;