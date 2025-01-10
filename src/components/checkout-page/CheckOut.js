// import React, { useEffect, useState } from 'react'
// import CheckoutPage from './CheckoutPage'
// import { getValueFromCookie } from '@/utils/cookies';
// import { useDispatch, useSelector } from 'react-redux';
// import { setAuthModalOpen } from '@/redux/slices/global';
// import { useCheckoutFlow } from '../checkout-guard/checkoutFlow';

// const CheckOut = () => {
//     const token = getValueFromCookie("token");
//     const dispatch = useDispatch();
//     const cartItems = useSelector(state=>state.cart.cartList)
//     const location = useSelector((state)=>state.addressData.location)
//     const { handleCheckoutFlow } = useCheckoutFlow()
     
//     useEffect(() => {
//         if (!token) {
//             dispatch(setAuthModalOpen(true))
//             return
//         }
//     }, [])

//     return (
//         <>
//             <CheckoutPage />
//         </>
//     )
// }

// export default CheckOut
import React, { useEffect, useState, useCallback } from 'react'
import CheckoutPage from './CheckoutPage'
import { getValueFromCookie } from '@/utils/cookies'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { setAuthModalOpen } from '@/redux/slices/global'
import { useCheckoutFlow } from '../checkout-guard/checkoutFlow'

const CheckOut = () => {
    const token = getValueFromCookie("token")
    const dispatch = useDispatch()
    const cartItems = useSelector(state => state.cart.cartList,shallowEqual)
    const location = useSelector((state) => state.addressData.location,shallowEqual)
    const { handleCheckoutFlow } = useCheckoutFlow()
    
    const [isLoading, setIsLoading] = useState(true)
    
    const initializeCheckout = async () => {
        if (!token) {
            dispatch(setAuthModalOpen(true))
            setIsLoading(false)
            return
        }
        
        if (!cartItems?.length) {
            setIsLoading(false)
            return
        }
        console.log('handle checkout initiated');
        try {
            console.log('verified 8');
            await handleCheckoutFlow(cartItems, location)
            setIsLoading(false)
        } catch (error) {
            console.error('Error in checkout flow:', error)
        }
        // } finally {
        //     setIsLoading(false)
        // }
    }
    
    useEffect(() => {
        initializeCheckout()
    }, [])
    
    if (!token) {
        return null
    }
    
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }
    
    return <CheckoutPage />
}

export default CheckOut

