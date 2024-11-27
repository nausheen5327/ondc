import React, { useEffect, useState } from 'react'
import {
    Button,
    InputBase,
    Box,
    CircularProgress,
    Typography,
} from '@mui/material'

import { DeliveryCaption, SaveAddressBox, InputField } from './CheckOut.style'
import { useQuery } from 'react-query'
import { AddressApi } from "@/hooks/react-query/config/addressApi"
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'
import { onErrorResponse, onSingleErrorResponse } from '../ErrorResponse'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import AddressSelectionField from './AddressSelectionField'
import AddressSelectionList from './order-summary/AddressSelectionList'
import { Stack } from "@mui/system";
import CustomPopover from "../custom-popover/CustomPopover";
import { CustomStackFullWidth } from "@/styled-components/CustomStyles.style";
import AddNewAddress from "@/components/user-info/address/AddNewAddress";
import { PrimaryButton } from "@/components/products-page/FoodOrRestaurant";
import { ACTIONS } from "@/components/checkout-page/states/additionalInformationStates";
import AddressList from '../address/addressList'

const getZoneWiseAddresses = (addresses, restaurantId) => {
    const newArray = []
    addresses.forEach(item => item.zone_ids.includes(restaurantId) && newArray.push(item))
    return newArray

}
const DeliveryAddress = ({
    setAddress,
    address,
    hideAddressSelectionField,
    handleSize,
    renderOnNavbar,
    additionalInformationDispatch,
    restaurantId, token, handleAddressSetSuccess,
    handleSelectAddress,handleCloseAddress
}) => {
    const theme = useTheme()
    const { t } = useTranslation()
    const [allAddress, setAllAddress] = useState()
    const [selectedAddress,setSelectedAddress] = useState({})
    const [data, setData] = useState(null)
    const mainAddress = {
        ...address,
    }
    const handleSuccess = (response) => {
        if (restaurantId) {
            const newObj = {
                ...response.data,
                addresses: getZoneWiseAddresses(response.data.addresses, restaurantId)
            }
            setData(newObj)
        } else {
            setData(response.data)
        }


    }
    const { refetch, isRefetching } = useQuery(
        ['address-list'],
        AddressApi.addressList,
        {
            enabled: false,
            onSuccess: handleSuccess,
            onError: onSingleErrorResponse,
        }
    )
   
    useEffect(() => {
        data && setAllAddress([mainAddress, ...data.addresses])
    }, [data])

    const handleLatLng = (values) => {
        if(renderOnNavbar==="true")
        {
            setAddress({ ...values, lat: values.latitude, lng: values.longitude })
            localStorage.setItem('currentLatLng', JSON.stringify({lat: values.latitude, lng: values.longitude}))
        }else{
            // setAddress({ ...values, lat: values.latitude, lng: values.longitude })
            setSelectedAddress({ ...values, lat: values.latitude, lng: values.longitude})
        }

    }

   
    const handleSelectedAddress =() => {
        setAddress(selectedAddress)
        if(additionalInformationDispatch){
            additionalInformationDispatch({type:ACTIONS.setStreetNumber , payload:selectedAddress?.road|| '' })
            additionalInformationDispatch({type:ACTIONS.setHouseNumber, payload:selectedAddress?.house|| '' })
            additionalInformationDispatch({type:ACTIONS.setFloor , payload:selectedAddress?.floor || '' })
            additionalInformationDispatch({type:ACTIONS.setAddressType , payload:selectedAddress?.address_type || '' })
        }
        handleCloseAddress()
    }
    console.log('address 1234567', address)
    return (
        <>
            
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <DeliveryCaption>{t('Delivery Addresses')}</DeliveryCaption>
                    <SaveAddressBox onClick={handleSelectAddress}>
                        <Typography
                            color={theme.palette.primary.main}
                            sx={{ cursor: 'pointer' }}
                            fontSize="12px"
                            // onClick={handleRoute}
                        >
                            {t('Saved Address')}
                        </Typography>
                    </SaveAddressBox>
               </Stack>
            
            
                <AddressSelectionField
                    theme={theme}
                    address={address}
                    t={t}
                />
            
           

        </>
    )
}
export default DeliveryAddress
