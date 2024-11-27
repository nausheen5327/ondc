import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'
const initialState = {
    paymentStatus: null,
    paymentResponse: null
}

export const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        setPayment_Status:(state, action)=>{
            state.paymentStatus = action.payload
        },
        setPayment_Response:(state, action)=>{
            state.paymentResponse = action.payload
        }
    },
})

// Action creators are generated for each case reducer function
export const {
    setPayment_Response,setPayment_Status
} = paymentSlice.actions
export default paymentSlice.reducer
