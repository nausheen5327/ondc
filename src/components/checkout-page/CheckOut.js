// import React, { useEffect, useState, useCallback } from 'react'
// import CheckoutPage from './CheckoutPage'
// import { getValueFromCookie } from '@/utils/cookies'
// import { shallowEqual, useDispatch, useSelector } from 'react-redux'
// import { setAuthModalOpen } from '@/redux/slices/global'
// import { useCheckoutFlow } from '../checkout-guard/checkoutFlow'

// const CheckOut = () => {
//     const token = getValueFromCookie("token")
//     const dispatch = useDispatch()
//     const cartItems = useSelector(state => state.cart.cartList,shallowEqual)
//     const location = useSelector((state) => state.addressData.location,shallowEqual)
//     const { handleCheckoutFlow } = useCheckoutFlow()
    
//     const [isLoading, setIsLoading] = useState(true)
    
//     const initializeCheckout = async () => {
//         if (!token) {
//             dispatch(setAuthModalOpen(true))
//             setIsLoading(false)
//             return
//         }
        
//         if (!cartItems?.length) {
//             setIsLoading(false)
//             return
//         }
//         console.log('handle checkout initiated');
//         try {
//             console.log('verified 8');
//             await handleCheckoutFlow(cartItems, location)
//             setIsLoading(false)
//         } catch (error) {
//             console.error('Error in checkout flow:', error)
//         }
//         // } finally {
//         //     setIsLoading(false)
//         // }
//     }
    
//     useEffect(() => {
//         initializeCheckout()
//     }, [])
    
//     if (!token) {
//         return null
//     }
    
//     if (isLoading) {
//         return (
//             <div className="flex items-center justify-center min-h-screen">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//         )
//     }
    
//     return <CheckoutPage />
// }

// export default CheckOut

import React, { useEffect, useState } from 'react';
import { Coffee, Pizza, Utensils } from 'lucide-react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { useCheckoutFlow } from '../checkout-guard/checkoutFlow';
import CheckoutPage from './CheckoutPage';
import { getValueFromCookie } from '../../utils/cookies';
import { setAuthModalOpen } from '../../redux/slices/global';
import { CustomToaster } from '../custom-toaster/CustomToaster';
import { setCartContext, setCartList } from '@/redux/slices/cart';
import LoadingScreen from '../CheckoutLoader';

  
const CheckOut = () => {
    const token = getValueFromCookie("token")
    const dispatch = useDispatch()
    const cartItems = useSelector(state => state.cart.cartList, shallowEqual)
    const location = useSelector((state) => state.addressData.location, shallowEqual)
    const { handleCheckoutFlow, isQuoteComplete } = useCheckoutFlow();
    // const [isQuoteReady, setIsQuoteReady] = useState(false);
    const cartContext = useSelector(state => state.cart.cartContext);
    const [isLoading, setIsLoading] = useState(true)
    const [isProcessing, setIsProcessing] = useState(false)
    
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

        setIsProcessing(true)
        try {
              handleCheckoutFlow(cartItems, location).then((res)=>{
              setIsProcessing(false)
              setIsLoading(false)
             })
        } catch (error) {
            console.error('Error in checkout flow:', error)
            setIsProcessing(false)
            setIsLoading(false)
            CustomToaster('error', 'Failed to process few items in your cart, please try again')
           
        } 
    }
    
    useEffect(() => {

        // const cartItems = localStorage.getItem('userCartItems');
        // // const cartContext = localStorage.getItem('cartContext');
        // if(cartItems )
        // {
        //   dispatch(setCartList(JSON.parse(cartItems)));
        //   setIsLoading(false);
        // }
          initializeCheckout()
        
        
    }, [])
    
    if (!token) {
        return null
    }
    if (isLoading || isProcessing || !isQuoteComplete) {
        return <LoadingScreen message={isProcessing ? "Processing your checkout..." : "Loading your order details..."} />
    }
    
    return <CheckoutPage />
}

export default CheckOut;