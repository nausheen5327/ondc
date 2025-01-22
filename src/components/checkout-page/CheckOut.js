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
const LoadingScreen = ({ message = "Preparing your order..." }) => {
    const styles = {
      wrapper: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'rgba(25, 21, 21, 0.95)',
        backdropFilter: 'blur(4px)'
      },
      overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(17, 14, 12, 0.05)'
      },
      contentContainer: {
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '42rem',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      },
      svgContainer: {
        width: '100%',
        aspectRatio: '4/3',
        marginBottom: '2rem'
      },
      textContainer: {
        textAlign: 'center',
        color: 'white',
      },
      title: {
        fontSize: '1.5rem',
        fontWeight: 600,
        color: 'white',
        marginBottom: '0.5rem'
      },
      subtitle: {
        color: '#6B7280',
        fontSize: '1rem'
      }
    };
  
    return (
      <div style={styles.wrapper}>
        <div style={styles.overlay} />
        
        <div style={styles.contentContainer}>
          <div style={styles.svgContainer}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" style={{ width: '100%', height: '100%' }}>
              {/* Background */}
              <rect width="400" height="300" fill="transparent"/>
              
              {/* Delivery route path */}
              <path d="M50,150 Q200,50 350,150" stroke="#e2e8f0" strokeWidth="4" fill="none"/>
              
              {/* Animated scooter */}
              <g transform="translate(0,0)">
                <animateMotion
                  dur="2s"
                  repeatCount="indefinite"
                  path="M50,150 Q200,50 350,150"
                  rotate="auto">
                  <mpath href="#deliveryPath"/>
                </animateMotion>
                
                {/* Scooter body */}
                <path d="M-15,-10 h30 v20 h-30z" fill="#3b82f6">
                  <animate attributeName="fill"
                    values="#3b82f6;#2563eb;#3b82f6"
                    dur="1s"
                    repeatCount="indefinite"/>
                </path>
                
                {/* Wheels */}
                <circle cx="-10" cy="15" r="5" fill="#1e293b">
                  <animate attributeName="r"
                    values="5;6;5"
                    dur="0.5s"
                    repeatCount="indefinite"/>
                </circle>
                <circle cx="10" cy="15" r="5" fill="#1e293b">
                  <animate attributeName="r"
                    values="5;6;5"
                    dur="0.5s"
                    repeatCount="indefinite"/>
                </circle>
                
                {/* Food box */}
                <rect x="-8" y="-20" width="16" height="16" fill="#f97316">
                  <animate attributeName="y"
                    values="-20;-22;-20"
                    dur="0.5s"
                    repeatCount="indefinite"/>
                </rect>
              </g>
              
              {/* Loading dots */}
              <g transform="translate(200,200)">
                <circle cx="-20" cy="0" r="5" fill="#94a3b8">
                  <animate attributeName="cy"
                    values="0;-10;0"
                    dur="0.6s"
                    repeatCount="indefinite"
                    begin="0s"/>
                </circle>
                <circle cx="0" cy="0" r="5" fill="#94a3b8">
                  <animate attributeName="cy"
                    values="0;-10;0"
                    dur="0.6s"
                    repeatCount="indefinite"
                    begin="0.2s"/>
                </circle>
                <circle cx="20" cy="0" r="5" fill="#94a3b8">
                  <animate attributeName="cy"
                    values="0;-10;0"
                    dur="0.6s"
                    repeatCount="indefinite"
                    begin="0.4s"/>
                </circle>
              </g>
            </svg>
          </div>
  
          <div style={styles.textContainer}>
            <h2 style={styles.title}>
              {message}
            </h2>
            <p style={styles.subtitle}>
              This will just take a moment
            </p>
          </div>
        </div>
      </div>
    );
  };
  
const CheckOut = () => {
    const token = getValueFromCookie("token")
    const dispatch = useDispatch()
    const cartItems = useSelector(state => state.cart.cartList, shallowEqual)
    const location = useSelector((state) => state.addressData.location, shallowEqual)
    const { handleCheckoutFlow } = useCheckoutFlow()
    
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
            await handleCheckoutFlow(cartItems, location)
        } catch (error) {
            console.error('Error in checkout flow:', error)
            CustomToaster('error', 'Failed to process few items in your cart, please try again')
        } finally {
            setIsProcessing(false)
            setIsLoading(false)
        }
    }
    
    useEffect(() => {
        initializeCheckout()
    }, [])
    
    if (!token) {
        return null
    }
    
    if (isLoading || isProcessing) {
        return <LoadingScreen message={isProcessing ? "Processing your checkout..." : "Loading your order details..."} />
    }
    
    return <CheckoutPage />
}

export default CheckOut;