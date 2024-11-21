import React, { useEffect, useState } from 'react'
import { CustomStackFullWidth } from '@/styled-components/CustomStyles.style'
import {
    Stack,
    styled,
    Button,
    Grid,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    Tooltip,
} from '@mui/material'
import { PymentTitle } from './CheckOut.style'
import { t } from 'i18next'
import { alpha, Typography } from '@mui/material'
import money from './assets/fi_2704332.png'
import wallet from './assets/walletpayment.png'
import CustomImageContainer from '../CustomImageContainer'
import PaymentMethodCard from './PaymentMethodCard'
import { useTheme } from '@emotion/react'
import { PrimaryButton } from '../products-page/FoodOrRestaurant'
import CloseIcon from '@mui/icons-material/Close'
import { useDispatch, useSelector } from 'react-redux'
import InfoIcon from '@mui/icons-material/Info'
import {
    setOfflineInfoStep,
    setOfflineMethod,
} from '../../redux/slices/OfflinePayment'
import { getToken } from './functions/getGuestUserId'

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

const OfflineButton = styled(Button)(({ theme, value, paymentMethod }) => ({
    padding: '15px 15px',
    borderRadius: '10px',
    fontWeight: '400',
    border: `1px solid ${theme.palette.neutral[300]}`,
    gap: '5px',
    background:
        value === paymentMethod
            ? theme.palette.neutral[800]
            : theme.palette.neutral[100],
    color:
        value === paymentMethod
            ? `${theme.palette.whiteContainer.main} !important`
            : `${theme.palette.neutral[1000]} !important`,
    '&:hover': {
        color: `${theme.palette.whiteContainer.main} !important`,
        background: theme.palette.neutral[800],
    },
}))

const AllPaymentMethod = ({
    paymenMethod,
    usePartialPayment,
    global,
    setPaymenMethod,
    getPaymentMethod,
    selected,
    setSelected,
    handleSubmit,
    subscriptionStates,
    handleClose,
    offlinePaymentOptions,
    setIsCheckedOffline,
    isCheckedOffline,
    offLineWithPartial,
    paymentMethodDetails,
}) => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { token } = useSelector((state) => state.userToken)
    const [paymentMethodUser,setPaymenMethodUser] = useState('cash_on_delivery')

    return (
        <Stack width="100%" padding="2rem" spacing={2.4}>
            <button className="closebtn" onClick={handleClose}>
                <CloseIcon fontSize="18px" />
            </button>
            <Stack>
                <PymentTitle>{t('Payment Method')}</PymentTitle>
                <Typography
                    fontSize="12px"
                    textTransform="capitalize"
                    color={theme.palette.neutral[1000]}
                >
                    {t('Select a Payment Method to Proceed')}
                </Typography>
            </Stack>



            <CustomStackFullWidth
                direction="row"
                gap="1rem"
                sx={{ flexWrap: 'wrap' }}
            >
                <PayButton
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
                </PayButton>
                <PayButton
                    value="prepaid"
                    paymentMethod={selected?.name}
                    onClick={() => {
                        getPaymentMethod({
                            name: 'prepaid',
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
            <Stack paddingTop="30px">
                <PrimaryButton variant="contained" onClick={handleSubmit}>
                    {t('Select')}
                </PrimaryButton>
            </Stack>
        </Stack>
    )
}

export default AllPaymentMethod
