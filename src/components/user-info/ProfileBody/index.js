import React from 'react'
import ProfilePage from '../profile/ProfilePage'
import Wallet from '../wallets/WalletList'
import CouponList from '../coupon/CouponList'
import LoyalityList from '../loyality/LoyalityList'
import ReferCodePage from '../refer-code/ReferCodePage'
import SettingPage from '../settings/SettingPage'
import OrderHistoryPage from '../../order-history/OrderHistoryPage'
import Chat from '../../chat/Chat'
import WishlistPage from '../../wishlist-page/WishlistPage'
import { RTL } from '../../RTL/RTL'
import OrderDetail from '../../order-details/OrderDetail'
import Complaint from '@/components/order-details/Complaints'
import ComplaintHistory from '@/components/order-details/Complaints'
import ComplaintDetail from '@/components/order-details/ComplaintDetail'

const ProfileBody = ({ page, orderId,ticketId }) => {
    let languageDirection = undefined
    if (typeof window !== 'undefined') {
        languageDirection = localStorage.getItem('direction')
    }
    const activeComponent = () => {
        if (page === 'profile') {
            return <ProfilePage />
        }
        if ((page === "order" || page === "order?flag=success" || page === "order?flag=cancel") && orderId) {

            return (<OrderDetail orderId={orderId} />)
        }
        if (page === "ticket" && !ticketId)
        {
            return <ComplaintHistory />
        }
        if(page === "ticket")
        {
            return <ComplaintDetail ticketId={ticketId}/>
        }
        if (
            page === 'wallets' ||
            page === 'wallets?flag=success' ||
            page === 'wallets?flag=cancel'
        ) {
            return <Wallet page={page} />
        }
        if (page === 'coupons') {
            return <CouponList />
        }
        if (page === 'loyalty') {
            return <LoyalityList />
        }
        if (page === 'referral') {
            return <ReferCodePage />
        }
        if (page === 'settings') {
            return <SettingPage />
        }
        if (page === 'order' && !orderId) {
            return <OrderHistoryPage />
        }
        if (page === 'inbox') {
            return <Chat />
        }
        if (page === 'wishlist') {
            return <WishlistPage />
        }
    }

    return <RTL direction={languageDirection}>{activeComponent()}</RTL>
}

export default ProfileBody
