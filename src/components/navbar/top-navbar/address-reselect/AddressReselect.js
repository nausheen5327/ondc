import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import RoomIcon from '@mui/icons-material/Room'
import { Paper, Stack, Typography } from '@mui/material'
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

import { useDispatch, useSelector } from 'react-redux'
import Router, { useRouter } from 'next/router'
import AddressReselectPopover from './AddressReselectPopover'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { setClearCart } from "@/redux/slices/cart"
import { styled, useTheme } from "@mui/material/styles";
import { useGeolocated } from "react-geolocated";
import { setOpenMapDrawer, setUserLocationUpdate } from "@/redux/slices/global"
import MapModal from "@/components/landingpage/google-map/MapModal";
import AddressList from '@/components/address/addressList'
import GuestAddressList from '@/components/address/guestAddress'
export const AddressTypographyGray = styled(Typography)(({ theme }) => ({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: '1',
    WebkitBoxOrient: 'vertical',
    maxWidth: '189px',
    marginInlineStart: '5px',
    wordBreak: 'break-all',
    color: theme.palette.neutral[1000],
    fontSize: "13px"
}))
const AddressReselect = ({ location }) => {
    console.log("location inside addr",location);
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [openGuestAddr, setOpenGuestAddr] = useState(false)
    const dispatch = useDispatch()
    const anchorRef = useRef(null)
    const [deliveryAddr, setDeliveryAddr] = useState('');

    useEffect(()=>{
        if(location)
        {
            setDeliveryAddr(location?.address?.areaCode);
        }
    },[location])

   

    const token = localStorage.getItem("token");
    const handleClickToLandingPage = () => {
            // if(token){
            //     setOpen(true)
            // }else{
            //     setOpenGuestAddr(true);
            // }
        setOpen(true);    
        
    }
    // const handleOpen = () => setOpen(true)
    const handleModalClose=() => setOpen(false)
    const handleClose = () => {
        setOpen(false)
        if (router.pathname !== '/') {
            handleModalClose()
        }
    }

    const handleCloseGuest = () => {
        setOpenGuestAddr(false)
    }

    useEffect(()=>{
        if(!location)
        {
            setOpen(true);
        }
    },[location])

    return (
        <>{location && Object.keys(location).length>=1 ?
            <Stack
                sx={{
                    color: (theme) => theme.palette.neutral[1000],
                    cursor: 'pointer',
                }}
                direction="row"
                onClick={handleClickToLandingPage}
                ref={anchorRef}
                alignItems="center"
                spacing={0.5}
            >
                <RoomIcon
                    fontSize="small"
                    color="primary"
                    style={{ width: '16px', height: '16px' }}
                />
                <AddressTypographyGray
                    align="left"
                >
                    {deliveryAddr}
                </AddressTypographyGray>
                {/* <KeyboardArrowDownIcon /> */}
            </Stack> :
            <Stack
                direction="row"
                onClick={handleClickToLandingPage}
                alignItems="center"
                gap="5px"
                sx={{
                    cursor: 'pointer',
                    color: (theme) => theme.palette.neutral[1000],
                }}
            >
                <RoomIcon
                    fontSize="small"
                    color="primary"
                    style={{ width: '16px', height: '16px' }}
                />
                <AddressTypographyGray
                    align="left"
                >
                    {"Select your location"}
                </AddressTypographyGray>
                {/* <KeyboardArrowDownIcon /> */}
            </Stack>
        }
            {/* <AddressReselectPopover
                anchorEl={anchorRef.current}
                onClose={handleClosePopover}
                open={openMapDrawer}
                t={t}
                address={address}
                setAddress={setAddress}
                mapOpen={mapOpen}
                // setUserLocationUpdate={setUserLocationUpdate}
                setMapOpen={setMapOpen}
                coords={coords}

            /> */}
            {/* {openGuestAddr && <GuestAddressList openAddressModal={openGuestAddr} setOpenAddressModal={handleCloseGuest}/>} */}
            {open && <AddressList openAddressModal={open} setOpenAddressModal={handleClose}/>
}
        </>
    )
}

AddressReselect.propTypes = {}

export default AddressReselect
