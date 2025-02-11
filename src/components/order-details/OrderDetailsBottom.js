import React, { useEffect, useState } from 'react'
import { CustomPaperBigCard } from '../../styled-components/CustomStyles.style'
import { CustomButton } from '../custom-cards/CustomCards.style'
import { Grid, Stack } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import Router from 'next/router'
import { useMutation } from 'react-query'
import { OrderApi } from "@/hooks/react-query/config/orderApi"
import CustomDialogConfirm from '../custom-dialog/confirm/CustomDialogConfirm'
import { onErrorResponse } from '../ErrorResponse'
import { toast } from 'react-hot-toast'
import { useTheme } from '@mui/material/styles'
import CustomModal from '../custom-modal/CustomModal'
import CancelOrder from './CancelOrder'
import { useGetOrderCancelReason } from "@/hooks/react-query/config/order-cancel/useGetCanelReasons"
import DigitalPaymentManage from './DigitalPaymentManage'
import { getGuestId } from "../checkout-page/functions/getGuestUserId";

const OrderDetailsBottom = ({
    id,
    refetchOrderDetails,
    refetchTrackData,
    trackData,
    isTrackOrder
}) => {
    const [openModal, setOpenModal] = useState(false)
    const [openModalForPayment, setModalOpenForPayment] = useState()
    const [cancelReason, setCancelReason] = useState(null)
    const { t } = useTranslation()
    const theme = useTheme()
    const { data: cancelReasonsData, refetch } = useGetOrderCancelReason()
    useEffect(() => {
        refetch()
    }, [])
    
    const handleTrackOrderClick = () => {
        //Router.push(`/tracking/${id}`)
        Router.push({
            pathname: '/info',
            query: {
                page: "order",
                orderId: id,
                isTrackOrder: true

            },
        })
    }

   

    return (
        <>
            <Stack width={"100%"}  gap="15px" flexDirection="row" justifyContent={{ xs: "flex-end", sm: "flex-end", md: "flex-end" }}>
                
                    <>
                        <CustomButton
                            variant="contained"
                            onClick={handleTrackOrderClick}
                        >
                            <Typography variant="h6">
                                {t('Track Order')}
                            </Typography>
                        </CustomButton></>

                
                
                   
                        {/* <CustomButton
                            variant="outlined"
                            onClick={() => setOpenModal(true)}
                        >
                            <Typography
                                variant="h5"
                                color={theme.palette.primary.main}
                            >
                                {t('Cancel Order')}
                            </Typography>
                        </CustomButton> */}
                    
            </Stack>
            
        </>
    )
}

export default OrderDetailsBottom
