import React, { useEffect } from 'react'
import CheckOut from '../../components/checkout-page/CheckOut'
import Meta from '../../components/Meta'
import { Container, CssBaseline } from '@mui/material'
import {
    CustomPaperBigCard,
    CustomStackFullWidth,
} from "@/styled-components/CustomStyles.style"
import CustomContainer from '../../components/container'
import GiftCard from '@/components/giftcard/GiftCard'
const GiftCardPage = () => {
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
export default  GiftCardPage
 // export { getServerSideProps }