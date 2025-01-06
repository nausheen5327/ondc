import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    location:null,
    formatted_address:"",
    zoneId:null,
    userLocationUpdate:false,
    customerInfo:null
}

export const AddressDataSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        setlocation: (state, action) => { 
            state.location = {...action.payload}
        },
        setCustomerInfo: (state, action) => { 
            state.customerInfo = {...action.payload}
        },
        setFormattedAddress:(state, action) =>{
            state.formatted_address = action.payload
          },
        setZoneIds:(state, action) =>{
            state.zoneId=action.payload
        },
        setUserLocationUpdate:(state,action)=>{
            state.userLocationUpdate=action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setlocation,setFormattedAddress,setZoneIds,setCustomerInfo } = AddressDataSlice.actions
export default AddressDataSlice.reducer
