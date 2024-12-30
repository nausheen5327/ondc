import React, { useEffect, useState } from 'react'
import CheckoutPage from './CheckoutPage'
import { getValueFromCookie } from '@/utils/cookies';
import { useDispatch } from 'react-redux';
import { setAuthModalOpen } from '@/redux/slices/global';

const CheckOut = () => {
    const token = getValueFromCookie("token");
    const dispatch = useDispatch();
    useEffect(() => {
        if (!token) {
            dispatch(setAuthModalOpen(true))
            return
        }
    }, [])

    return (
        <>
            <CheckoutPage />
        </>
    )
}

export default CheckOut
