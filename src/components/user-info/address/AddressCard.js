// import React, { useEffect, useState } from "react";
// import {
//     CustomPaperBigCard,
//     CustomStackFullWidth,
// } from "@/styled-components/CustomStyles.style"
// import { CustomTypography } from '../../custom-tables/Tables.style'
// import { IconButton, Modal, Popover, Stack, Typography } from '@mui/material'
// import { t } from 'i18next'
// import { useTheme } from '@mui/material/styles'
// import DeleteAddress from './DeleteAddress'
// import { alpha } from '@material-ui/core'
// import { CustomDivWithBorder } from './Address.style'
// import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
// import FmdGoodIcon from '@mui/icons-material/FmdGood';
// import ApartmentIcon from '@mui/icons-material/Apartment';
// import DeleteIcon from '../../../assets/images/icons/DeleteIcon';
// import EditLocationOutlinedIcon from '@mui/icons-material/EditLocationOutlined';
// import CustomPopover from '../../custom-popover/CustomPopover'
// import { RTL } from '../../RTL/RTL';
// import AddressForm from './AddressForm'
// import { useMutation, useQuery } from 'react-query'
// import { AddressApi } from "@/hooks/react-query/config/addressApi"
// import { useDispatch, useSelector } from 'react-redux'
// import { ProfileApi } from "@/hooks/react-query/config/profileApi";
// import CloseIcon from '@mui/icons-material/Close';
// import toast from 'react-hot-toast'
// import { setlocation, setLocation } from "@/redux/slices/addressData"
// import { onErrorResponse } from "@/components/ErrorResponse";
// import { setGuestUserInfo } from "@/redux/slices/guestUserInfo";
// import EnhancedAddressCard from "./EnhancedAddressCard";
// import { getCall, postCall } from "@/api/MainApi";
// import { setIsLoading } from "@/redux/slices/global";
// import { CustomToaster } from "@/components/custom-toaster/CustomToaster";
// import { setAddressList } from "@/redux/slices/customer";

// const style = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     maxWidth: "1080px",
//     bgcolor: 'background.paper',
//     border: '1px solid #fff',
//     boxShadow: 24,
//     borderRadius: "10px",
// }

// const AddressCard = ({ address }) => {
//     const theme = useTheme()
//     const dispatch = useDispatch()
//     const [open, setOpen] = useState(false)
//     const [anchorEl, setAnchorEl] = useState(null);
//     const [addressSymbol, setAddressSymbol] = useState("")
//     const [rerenderMap, setRerenderMap] = useState(false)
//     const languageDirection = 'ltr'
//     const { location, formatted_address } = useSelector((state) => state.addressData);
//     useEffect(() => {
//         if (address?.address?.tag === "Home") {
//             setAddressSymbol(<HomeRoundedIcon sx={{ width: "20px", height: "20px", color: theme.palette.customColor.twelve }} />)
//         } else if (address?.address?.tag === "Office") {
//             setAddressSymbol(<ApartmentIcon sx={{ width: "20px", height: "20px", color: theme.palette.customColor.twelve }} />)
//         } else {
//             setAddressSymbol(<FmdGoodIcon sx={{ width: "20px", height: "20px", color: theme.palette.customColor.twelve }} />)
//         }
//     }, [])

// console.log("address is",address);

//     const fetchDeliveryAddress = async () => {
//         // setFetchDeliveryAddressLoading(true);
//         try {
//         //   dispatch(setIsLoading(true));
//           let data = await getCall("/clientApis/v1/delivery_address");
          
//           dispatch(setAddressList(data));
//           localStorage.setItem('addressList', JSON.stringify(data));
//         //   dispatch(setIsLoading(false));
//         } catch (err) {
//           CustomToaster("error", 'Unable to fetch delivery information');
//         //   dispatch(setIsLoading(false));
//           //toast for error in fetching addresses
//         } finally {
//         //   dispatch(setIsLoading(false));
//           // setFetchDeliveryAddressLoading(false);
//         }
//       };

//     const handleUpdateAddress = async (address) => {
        
//           try {
//             // dispatch(setIsLoading(true));
//             const data = await postCall(
//               `/clientApis/v1/update_delivery_address/${address.id}`,
//               {
//                 descriptor: {
//                   name: address.descriptor.name.trim(),
//                   email: address.descriptor.email.trim(),
//                   phone: address.descriptor.phone.trim(),
//                 },
//                 address: {
//                   areaCode: address.address.areaCode.trim(),
//                   building: address.address.building.trim(),
//                   city: address.address.city.trim(),
//                   country: "IND",
//                   door: address.address.building.trim(),
//                   building: address.address.building.trim(),
//                   state: address.address.state.trim(),
//                   street: address.address.street.trim(),
//                   tag: address.address.tag.trim(),
//                   lat: address.address.lat,
//                   lng: address.address.lng,
//                 },
//               }
//             );
//             // dispatch(setIsLoading(false));
//             await fetchDeliveryAddress();
//           } catch (err) {
//             CustomToaster("error", 'Unable to update address');
//             // dispatch(setIsLoading(false));
//           } finally {
//             // setAddAddressLoading(false);
//             // dispatch(setIsLoading(false));
//           }
        
        
//       };

//     const handleClick = (event) => {
//         setAnchorEl(event.currentTarget);
//     };
//     const handleClose = () => {
//         setAnchorEl(null)
//     };
//     const handleEditAddress = () => {

//         // dispatch(setLocation({ lat: address?.latitude, lng: address?.longitude }))
//         setOpen(true)
//     }
//     const formSubmitHandler = (values) => {
//         let newData = {
//             ...values,
//             id: address?.id
//         }
//         if (token) {
//             mutate(newData)
//         } else {
//             dispatch(setGuestUserInfo(newData));
//             setOpen(false)
//         }
//     }
//     const convertPhoneNumber = (phoneNumber) => {
//         if (phoneNumber.charAt(0) === "+") {
//             return phoneNumber
//         } else {
//             return `+${phoneNumber}`
//         }
//     }

//     return (
//         <CustomDivWithBorder>
//             <CustomStackFullWidth spacing={1}>
//                 <CustomStackFullWidth
//                     sx={{
//                         backgroundColor: (theme) =>
//                             theme.palette.mode === 'dark'
//                                 ? theme.palette.cardBackground1
//                                 : theme.palette.sectionBg,
//                     }}
//                 >
//                     <CustomStackFullWidth
//                         justifyContent="space-between"
//                         direction="row"
//                         alignItems="center"
//                         sx={{ padding: '5px 15px' }}
//                     >
//                         <Stack flexDirection="row" gap="5px" alignItems="center">
//                             <CustomStackFullWidth>
//                                 {addressSymbol}
//                             </CustomStackFullWidth>
//                             <CustomTypography sx={{ textTransform: 'capitalize' }}>
//                                 {t(address?.address?.tag)}
//                             </CustomTypography>
//                         </Stack>
//                         <Stack flexDirection="row">
//                             <IconButton onClick={handleEditAddress}>
//                                 <EditLocationOutlinedIcon sx={{ fontSize: "20px", color: theme.palette.customColor.two }} />
//                             </IconButton>
//                             <IconButton onClick={handleClick}>
//                                 <DeleteIcon />
//                             </IconButton>
//                         </Stack>
//                     </CustomStackFullWidth>
//                 </CustomStackFullWidth>
//                 <CustomStackFullWidth
//                     spacing={1}
//                     sx={{ paddingX: '20px', paddingBottom: '25px' }}
//                 >
//                     <Stack direction="row" spacing={2}>
//                         <Typography fontSize="14px" fontWeight="500">
//                             {t('Name')}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
//                         </Typography>
//                         <Typography
//                             fontSize="14px"
//                             fontWeight="400"
//                             color={theme.palette.neutral[500]}
//                         >
//                             {address?.descriptor?.name}
//                         </Typography>
//                     </Stack>
//                     <Stack direction="row" spacing={2}>
//                         <Typography fontSize="14px" fontWeight="500">
//                             {t('Phone')}&nbsp;&nbsp;&nbsp;
//                         </Typography>
//                         <Typography
//                             fontSize="14px"
//                             fontWeight="400"
//                             color={theme.palette.neutral[500]}
//                         >
//                             {convertPhoneNumber(address?.descriptor?.phone)}
//                             {}
//                         </Typography>
//                     </Stack>
//                     <Stack direction="row" spacing={2}>
//                         <Typography fontSize="14px" fontWeight="500">
//                             {t('Address')}
//                         </Typography>
//                         <Typography
//                             fontSize="14px"
//                             fontWeight="400"
//                             color={theme.palette.neutral[500]}
//                         >
                            
//                             {address?.address?.door} &nbsp;{address?.address?.building}&nbsp; {address?.address?.street} &nbsp;{address?.address?.city}&nbsp; {address?.address?.state} &nbsp;{address?.address?.country} &nbsp;{address?.address?.areaCode}
//                         </Typography>
//                     </Stack>
//                 </CustomStackFullWidth>
//             </CustomStackFullWidth>
//             <CustomPopover
//                 anchorEl={anchorEl}
//                 setAnchorEl={setAnchorEl}
//                 handleClose={handleClose}
//                 maxWidth="255px"
//                 padding="20px 35px 25px"
//             >
//                 <DeleteAddress
//                     addressId={address?.id}
//                     handleClose={handleClose}
//                 />
//             </CustomPopover>
//             {
//                 open && (
//                     <Modal
//                         open={open}
//                         onClose={() => {
//                             setOpen(false)
//                         }}
//                         aria-labelledby="child-modal-title"
//                         aria-describedby="child-modal-description"
//                     >
//                         <Stack
//                             sx={style}
//                             width={{ xs: "90%", sm: "70%" }}
//                             spacing={2}
//                             padding={{ xs: "10px", md: "25px" }}
//                         >
//                             <button
//                                 onClick={() => setOpen(false)}
//                                 className="closebtn"
//                             >
//                                 <CloseIcon sx={{ fontSize: '16px' }} />
//                             </button>

//                             <RTL direction={languageDirection}>
//                                 <CustomStackFullWidth flexDirection={{ xs: "column", sm: "row" }} gap="15px">
//                                     <EnhancedAddressCard address={address} onUpdateAddress={handleUpdateAddress} open={open} setOpen={setOpen}/>
//                                     {/* <MapWithSearchBox
//                                     // rerenderMap={rerenderMap}
//                                     // orderType={orderType} 
//                                     />
//                                     <AddressForm
//                                         deliveryAddress={
//                                             formatted_address
//                                         }
//                                         personName={address?.contact_person_name}
//                                         phone={address?.contact_person_number}
//                                         lat={address?.latitude || location?.lat || ''}
//                                         lng={address?.longitude || location?.lng || ''}
//                                         formSubmit={formSubmitHandler}
//                                         isLoading={false}
//                                         editAddress={true}
//                                         address={address}
//                                     /> */}
//                                 </CustomStackFullWidth>
//                             </RTL>
//                         </Stack>
//                     </Modal>
//                 )
//             }
//         </CustomDivWithBorder>
//     )
// }

// export default AddressCard
import React, { useEffect, useState } from "react";
import {
    CustomPaperBigCard,
    CustomStackFullWidth,
} from "@/styled-components/CustomStyles.style"
import { CustomTypography } from '../../custom-tables/Tables.style'
import { IconButton, Modal, Popover, Stack, Typography } from '@mui/material'
import { t } from 'i18next'
import { useTheme } from '@mui/material/styles'
import DeleteAddress from './DeleteAddress'
import { CustomDivWithBorder } from './Address.style'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import ApartmentIcon from '@mui/icons-material/Apartment';
import DeleteIcon from '../../../assets/images/icons/DeleteIcon';
import EditLocationOutlinedIcon from '@mui/icons-material/EditLocationOutlined';
import CustomPopover from '../../custom-popover/CustomPopover'
import { RTL } from '../../RTL/RTL';
import { useDispatch, useSelector } from 'react-redux'
import CloseIcon from '@mui/icons-material/Close';
import { CustomToaster } from "@/components/custom-toaster/CustomToaster";
import EnhancedAddressCard from "./EnhancedAddressCard";
import { getCall, postCall } from "@/api/MainApi";
import { setAddressList } from "@/redux/slices/customer";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: "1080px",
    bgcolor: 'background.paper',
    border: '1px solid #fff',
    boxShadow: 24,
    borderRadius: "10px",
}

const AddressCard = ({ address, isDefault, onClick,handleAddressSelect}) => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const [addressSymbol, setAddressSymbol] = useState("")
    const languageDirection = 'ltr'
    const { location, formatted_address } = useSelector((state) => state.addressData);
    
    useEffect(() => {
        if (address?.address?.tag === "Home") {
            setAddressSymbol(<HomeRoundedIcon sx={{ width: "20px", height: "20px", color: theme.palette.customColor.twelve }} />)
        } else if (address?.address?.tag === "Office") {
            setAddressSymbol(<ApartmentIcon sx={{ width: "20px", height: "20px", color: theme.palette.customColor.twelve }} />)
        } else {
            setAddressSymbol(<FmdGoodIcon sx={{ width: "20px", height: "20px", color: theme.palette.customColor.twelve }} />)
        }
    }, [])

    const fetchDeliveryAddress = async () => {
        try {
          let data = await getCall("/clientApis/v1/delivery_address");
          
          dispatch(setAddressList(data));
          localStorage.setItem('addressList', JSON.stringify(data));
        } catch (err) {
          CustomToaster("error", 'Unable to fetch delivery information');
        }
      };

    const handleUpdateAddress = async (address) => {        
        try {
            const data = await postCall(
              `/clientApis/v1/update_delivery_address/${address.id}`,
              {
                descriptor: {
                  name: address.descriptor.name.trim(),
                  email: address.descriptor.email.trim(),
                  phone: address.descriptor.phone.trim(),
                },
                address: {
                  areaCode: address.address.areaCode.trim(),
                  building: address.address.building.trim(),
                  city: address.address.city.trim(),
                  country: "IND",
                  door: address.address.door.trim(),
                  building: address.address.building.trim(),
                  state: address.address.state.trim(),
                  street: address.address.street.trim(),
                  tag: address.address.tag.trim(),
                  lat: address.address.lat,
                  lng: address.address.lng,
                },
              }
            );
            await fetchDeliveryAddress();
          } catch (err) {
            CustomToaster("error", 'Unable to update address');
          }
      };

    const handleClick = (event) => {
        // Stop propagation to prevent triggering the parent's onClick
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null)
    };
    
    const handleEditAddress = (event) => {
        // Stop propagation to prevent triggering the parent's onClick
        event.stopPropagation();
        setOpen(true)
    }

    const convertPhoneNumber = (phoneNumber) => {
        if (phoneNumber?.charAt(0) === "+") {
            return phoneNumber
        } else {
            return `+${phoneNumber}`
        }
    }

    return (
        <CustomDivWithBorder>
            <CustomStackFullWidth spacing={1}>
                <CustomStackFullWidth
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'dark'
                                ? theme.palette.cardBackground1
                                : theme.palette.sectionBg,
                    }}
                >
                    <CustomStackFullWidth
                        justifyContent="space-between"
                        direction="row"
                        alignItems="center"
                        sx={{ padding: '5px 15px' }}
                    >
                        <Stack flexDirection="row" gap="5px" alignItems="center">
                            <CustomStackFullWidth>
                                {addressSymbol}
                            </CustomStackFullWidth>
                            <CustomTypography sx={{ textTransform: 'capitalize' }}>
                                {t(address?.address?.tag)}
                            </CustomTypography>
                        </Stack>
                        <Stack flexDirection="row">
                            <IconButton onClick={handleEditAddress}>
                                <EditLocationOutlinedIcon sx={{ fontSize: "20px", color: theme.palette.customColor.two }} />
                            </IconButton>
                            <IconButton onClick={handleClick}>
                                <DeleteIcon />
                            </IconButton>
                        </Stack>
                    </CustomStackFullWidth>
                </CustomStackFullWidth>
                <CustomStackFullWidth
                    spacing={1}
                    sx={{ paddingX: '20px', paddingBottom: '25px' }}
                    onClick={() => handleAddressSelect(address)}
                >
                    <Stack direction="row" spacing={2}>
                        <Typography fontSize="14px" fontWeight="500">
                            {t('Name')}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </Typography>
                        <Typography
                            fontSize="14px"
                            fontWeight="400"
                            color={theme.palette.neutral[500]}
                        >
                            {address?.descriptor?.name}
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={2}>
                        <Typography fontSize="14px" fontWeight="500">
                            {t('Phone')}&nbsp;&nbsp;&nbsp;
                        </Typography>
                        <Typography
                            fontSize="14px"
                            fontWeight="400"
                            color={theme.palette.neutral[500]}
                        >
                            {convertPhoneNumber(address?.descriptor?.phone)}
                            {}
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={2}>
                        <Typography fontSize="14px" fontWeight="500">
                            {t('Address')}
                        </Typography>
                        <Typography
                            fontSize="14px"
                            fontWeight="400"
                            color={theme.palette.neutral[500]}
                        >
                            {address?.address?.door} &nbsp;{address?.address?.building}&nbsp; {address?.address?.street} &nbsp;{address?.address?.city}&nbsp; {address?.address?.state} &nbsp;{address?.address?.country} &nbsp;{address?.address?.areaCode}
                        </Typography>
                    </Stack>
                </CustomStackFullWidth>
            </CustomStackFullWidth>
            <CustomPopover
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                handleClose={handleClose}
                maxWidth="255px"
                padding="20px 35px 25px"
            >
                <DeleteAddress
                    addressId={address?.id}
                    handleClose={handleClose}
                />
            </CustomPopover>
            {
                open && (
                    <Modal
                        open={open}
                        onClose={() => {
                            setOpen(false)
                        }}
                        aria-labelledby="child-modal-title"
                        aria-describedby="child-modal-description"
                    >
                        <Stack
                            sx={style}
                            width={{ xs: "90%", sm: "70%" }}
                            spacing={2}
                            padding={{ xs: "10px", md: "25px" }}
                        >
                            <button
                                onClick={() => setOpen(false)}
                                className="closebtn"
                            >
                                <CloseIcon sx={{ fontSize: '16px' }} />
                            </button>

                            <RTL direction={languageDirection}>
                                <CustomStackFullWidth flexDirection={{ xs: "column", sm: "row" }} gap="15px">
                                    <EnhancedAddressCard address={address} onUpdateAddress={handleUpdateAddress} open={open} setOpen={setOpen}/>
                                </CustomStackFullWidth>
                            </RTL>
                        </Stack>
                    </Modal>
                )
            }
        </CustomDivWithBorder>
    )
}

export default AddressCard