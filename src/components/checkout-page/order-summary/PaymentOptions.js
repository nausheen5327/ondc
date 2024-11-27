import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Grid, Stack, Typography, alpha } from '@mui/material'
import {
    PaymentButton,
    PaymentOptionGrid,
    PymentTitle,
} from '../CheckOut.style'
import cash from '../../../../public/static/buttonImg/cashonbtn.png'
import digital from '../../../../public/static/buttonImg/digitalbtn.png'
import wallet from '../../../../public/static/buttonImg/walletbtn.png'
import { useTranslation } from 'react-i18next'
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined'
import {
    CustomCheckBoxStack,
    CustomPaperBigCard,
    CustomStackFullWidth,
} from '../../../styled-components/CustomStyles.style'
import CustomImageContainer from '../../CustomImageContainer'
import placeholder from '../../../../public/static/no-image-found.jpg'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useTheme } from '@mui/material/styles'
import Divider from '@mui/material/Divider'
import CustomDivider from '../../CustomDivider'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import CustomModal from '../../custom-modal/CustomModal'
import AllPaymentMethod from '../AllPaymentMethod'
import OfflinePayment from '../assets/OfflinePayment'
import { useDispatch, useSelector } from "react-redux";
import { setOfflineInfoStep, setOfflineMethod } from "@/redux/slices/OfflinePayment"
import { styled } from '@mui/styles'
import money from '../assets/fi_2704332.png'

const PayButton = styled(Button)(({ theme, value, paymentMethod }) => ({
  padding: '16px 16px',
  gap: '10px',
  alignItems: 'center',
  border: '1px solid',
  borderColor: alpha(theme.palette.neutral[400], 0.4),
  color:
      value === paymentMethod
          ? theme.palette.neutral[1000]
          : theme.palette.neutral[1000],
  background:
      value === paymentMethod && alpha(theme.palette.primary.main, 0.6),
  '&:hover': {
      color: theme.palette.neutral[1000],
      background: value === paymentMethod && theme.palette.primary.main,
  },
}))
const PaymentOptions = (props) => {
    const theme = useTheme()
    const {
        global,
        paymenMethod,
        setPaymenMethod,
        subscriptionStates,
        usePartialPayment,
        selected,
        setSelected,
        paymentMethodDetails,
        setPaymentMethodDetails,
        setSwitchToWallet,
        offlinePaymentOptions,
    } = props
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [openModal, setOpenModal] = useState(false)
    const { offLineWithPartial } = useSelector((state) => state.offlinePayment);
    const [isCheckedOffline, setIsCheckedOffline] = useState(selected?.method === "offline_payment" ? true : false);
    const { offlineInfoStep } = useSelector((state) => state.offlinePayment);
    const [initializeOrderLoading, setInitializeOrderLoading] = useState(false);
    const [eventData, setEventData] = useState([]);
    const cartItems = useSelector(state=>state.cart.cartList)
    const updatedCartItems = useRef([]);
    const responseRef = useRef([]);
    const eventTimeOutRef = useRef([]);
    


   

    const getPaymentMethod = (item) => {
        setSelected(item)
        setPaymenMethod(item.name)
        setPaymentMethodDetails(item);
    }

  

   
    
      
    
      // use this function to initialize the order
     
    
     
      
      
    
    

    return (
        <CustomPaperBigCard nopadding="true">
            <Grid container>
                <Grid item xs={12} md={12}>
                    <CustomStackFullWidth
                        justifyContent="space-between"
                        direction="row"
                        padding="19px 16px 3px 16px"
                    >
                        <PymentTitle>{t('Payment Options')}</PymentTitle>
                        {/* <BorderColorOutlinedIcon
                            onClick={handleClick}
                            color="primary"
                            style={{ cursor: 'pointer' }}
                        /> */}
                    </CustomStackFullWidth>
                </Grid>
                <CustomStackFullWidth
                direction="row"
                gap="1rem"
                sx={{ flexWrap: 'wrap' }}
                padding="20px"
            >
                {/* <PayButton
                    value="cash_on_delivery"
                    paymentMethod={selected?.name}
                    onClick={() => {
                        getPaymentMethod({
                            name: 'cash_on_delivery',
                            image: money,
                        })
                        // dispatch(setOfflineInfoStep(0))
                    }}
                >
                    <CustomImageContainer
                        src={money.src}
                        width="20px"
                        height="20px"
                        alt="cod"
                    />
                    <Typography
                        fontSize="12px"
                        color={
                            selected?.name ===
                                'cash_on_delivery'
                                ? theme.palette
                                    .neutral[1000]
                                : theme.palette.primary.main
                        }
                    >
                        {t('Pay after service')}
                    </Typography>
                </PayButton> */}
                <PayButton
                    value="prepaid"
                    paymentMethod={selected?.name}
                    onClick={() => {
                        getPaymentMethod({
                            name: 'prepaid',
                            image: wallet,
                        })
                        // dispatch(setOfflineInfoStep(0))
                    }}
                >
                    <CustomImageContainer
                        src={wallet.src}
                        width="20px"
                        height="20px"
                        alt="cod"
                    />
                    <Typography
                        fontSize="12px"
                        color={
                            selected?.name ===
                                'prepaid'
                                ? theme.palette
                                    .neutral[1000]
                                : theme.palette.primary.main
                        }
                    >
                        {t('Prepaid')}
                    </Typography>
                </PayButton>
            </CustomStackFullWidth>
                {/* <CustomStackFullWidth
                    direction="row"
                    padding="16px"
                    sx={{ cursor: 'pointer' }}
                    onClick={handleClick}
                >
                    {paymentMethodDetails?.name ? (
                        <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                        >
                            {paymentMethodDetails?.name === 'wallet' ||
                                paymentMethodDetails?.name ===
                                'cash_on_delivery' ? (
                                <CustomImageContainer
                                    maxWidth="100%"
                                    width="unset"
                                    height="32px"
                                    objectfit="contain"
                                    src={paymentMethodDetails?.image.src}
                                />
                            ) : (
                                <>
                                    {paymentMethodDetails?.method === 'offline_payment' ? (<OfflinePayment />)
                                        : (
                                            <CustomImageContainer
                                                maxWidth="100%"
                                                width="unset"
                                                height="32px"
                                                objectfit="contain"
                                                src={paymentMethodDetails?.image}
                                            />
                                        )

                                    }
                                </>
                            )
                            }
                            <Typography
                                fontSize="14px"
                                fontWeight="500"
                                color={theme.palette.primary.main}
                                textTransform="capitalize"
                            >
                                {paymentMethodDetails?.method ? `${t(paymentMethodDetails?.method?.replaceAll('_', ' '))} (${t(paymentMethodDetails?.name)})` : `${t(paymentMethodDetails?.name?.replaceAll('_', ' '))}`}
                            </Typography>
                        </Stack>
                    ) : (
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <AddCircleOutlineIcon
                                style={{ width: '22px', height: '22px' }}
                                color="primary"
                            />
                            <Typography
                                fontSize="14px"
                                fontWeight="500"
                                color={theme.palette.primary.main}
                            >
                                {t('Add Payment Method')}
                            </Typography>
                        </Stack>
                    )}
                </CustomStackFullWidth> */}
                {/* {openModal && (
                    <CustomModal
                        openModal={openModal}
                        handleClose={() => setOpenModal(false)}
                        setModalOpen={setOpenModal}
                        maxWidth="640px"
                        bgColor={theme.palette.customColor.ten}
                    >
                        <AllPaymentMethod
                            handleClose={() => setOpenModal(false)}
                            paymenMethod={paymenMethod}
                            usePartialPayment={usePartialPayment}
                            global={global}
                            setPaymenMethod={setPaymenMethod}
                            getPaymentMethod={getPaymentMethod}
                            setSelected={setSelected}
                            selected={selected}
                            handleSubmit={handleSubmit}
                            subscriptionStates={subscriptionStates}
                            offlinePaymentOptions={offlinePaymentOptions}
                            setIsCheckedOffline={setIsCheckedOffline}
                            isCheckedOffline={isCheckedOffline}
                            offLineWithPartial={offLineWithPartial}
                            paymentMethodDetails={paymentMethodDetails}
                        />
                    </CustomModal>
                )} */}
            </Grid>
        </CustomPaperBigCard>
    )
}

PaymentOptions.propTypes = {}

export default PaymentOptions
