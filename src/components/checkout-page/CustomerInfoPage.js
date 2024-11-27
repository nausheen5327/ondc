import React from 'react'
import { DeliveryCaption, DeliveryTitle } from './CheckOut.style'
import { useTranslation } from 'react-i18next'
import FormControl from '@mui/material/FormControl'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import DeliveryAddress from './DeliveryAddress'
import {
    CustomPaperBigCard,
    CustomStackFullWidth,
} from "@/styled-components/CustomStyles.style"
import OrderType from './order-type'
import AdditionalAddresses from './AdditionalAddresses'
import { Typography } from "@mui/material";
import CheckoutSelectedAddressGuest from "./guest-user/CheckoutSelectedAddressGuest";
import { getToken } from "./functions/getGuestUserId";
import useGetMostTrips from "@/hooks/react-query/useGetMostTrips";
import { useSelector } from 'react-redux'

const CustomerInfoPage = () => {
    const { t } = useTranslation()
    const location = useSelector((state)=>state.addressData.location)

    console.log('location in cart',location);

    
    return (
        <CustomPaperBigCard>
            <CustomStackFullWidth>
                <DeliveryTitle>
                    {t('CUSTOMER INFO')}
                </DeliveryTitle>
                <Typography variant="body" sx={{ fontWeight: 600 }}>
                {location?.descriptor.name}
              </Typography>
              <Typography variant="body" sx={{ fontWeight: 600 }}>
              {location.descriptor.email}
              </Typography>
            </CustomStackFullWidth>
        </CustomPaperBigCard>
    )
}

CustomerInfoPage.propTypes = {}

export default React.memo(CustomerInfoPage)
