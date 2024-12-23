import React, { useEffect } from 'react'
import CheckOut from '../../components/checkout-page/CheckOut'
import Meta from '../../components/Meta'
import { Container, CssBaseline } from '@mui/material'
import {
    CustomPaperBigCard,
    CustomStackFullWidth,
} from "@/styled-components/CustomStyles.style"
import Router, { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import CustomContainer from '../../components/container'
import HomeGuard from "../../components/home-guard/HomeGuard";
import { getServerSideProps } from '../index'
import GiftCard from '@/components/giftcard/GiftCard'
const CheckoutLayout = ({ configdata }) => {
    const { cartList } = useSelector((state) => state.cart)
    const { token } = useSelector((state) => state.userToken)
    const router = useRouter()
    const { page } = router.query
    const { global } = useSelector((state) => state.globalSettings)


    return (
        <>
            <CssBaseline />
            <CustomContainer>
                <CustomStackFullWidth sx={{ marginTop: '5rem' }}>
                    <Meta
                        title={`Giftcards on ONDC`}
                        description=""
                        keywords=""
                    />
                    <GiftCard/>
                </CustomStackFullWidth>
            </CustomContainer>
        </>
    )
}
export default CheckoutLayout
 // export { getServerSideProps }