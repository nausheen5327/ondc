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

const DeliveryDetails = (props) => {
    const {
        global,
        restaurantData,
        setOrderType,
        orderType,
        setAddress,
        address,
        subscriptionStates,
        subscriptionDispatch,
        page,
        additionalInformationStates,
        additionalInformationDispatch,
        setDeliveryTip,
        setPaymenMethod,
        setPaymentMethodDetails,
        setUsePartialPayment,
        setSwitchToWallet, token
    } = props
    const { t } = useTranslation()

    const handleChange = (e) => {
        if (e.target.value === 'take_away') {
            setDeliveryTip(0)
        }
        setOrderType(e.target.value)
    }
    return (
        <CustomPaperBigCard>
            <CustomStackFullWidth>
                <DeliveryTitle>
                    {global?.cash_on_delivery &&
                        restaurantData?.data?.order_subscription_active &&
                        t('ORDER TYPE &')}{' '}
                    {t('DELIVERY DETAILS')}
                </DeliveryTitle>
                <FormControl>
                    {page !== 'campaign' &&
                         (
                            <OrderType
                                t={t}
                                subscriptionStates={subscriptionStates}
                                subscriptionDispatch={subscriptionDispatch}
                                setDeliveryTip={setDeliveryTip}
                                setPaymenMethod={setPaymenMethod}
                                setPaymentMethodDetails={
                                    setPaymentMethodDetails
                                }
                                setUsePartialPayment={setUsePartialPayment}
                                setSwitchToWallet={setSwitchToWallet}
                            />
                        )}
                    
                            <DeliveryCaption id="demo-row-radio-buttons-group-label">
                                {t('Delivery Options')}
                            </DeliveryCaption>
                        

                        <RadioGroup
                            value={orderType}
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            onChange={(e) => handleChange(e)}
                        >
                           
                                    <FormControlLabel
                                        value="delivery"
                                        control={<Radio />}
                                        label={t('Home Delivery - Delivery in an hour')}
                                    />
                            
                                    <FormControlLabel
                                        value="take_away"
                                        control={<Radio />}
                                        label={t('Take Away -  Delivery in 30 minutes')}
                                    />
                                
                        </RadioGroup>
                </FormControl>
                
                    <>
                        {orderType && orderType !== 'take_away' && (
                            <DeliveryAddress
                                setAddress={setAddress}
                                address={address}
                                additionalInformationDispatch={
                                    additionalInformationDispatch
                                }
                                restaurantId={restaurantData?.data?.zone_id}
                                token={token}
                            />
                        )}</>

                {getToken() &&
                    <AdditionalAddresses
                        orderType={orderType}
                        t={t}
                        additionalInformationStates={additionalInformationStates}
                        additionalInformationDispatch={
                            additionalInformationDispatch
                        }
                    />}
            </CustomStackFullWidth>
        </CustomPaperBigCard>
    )
}

DeliveryDetails.propTypes = {}

export default React.memo(DeliveryDetails)
