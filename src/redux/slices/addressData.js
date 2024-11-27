import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    location:null,
    formatted_address:"",
    zoneId:null,
    userLocationUpdate:false,
}

export const AddressDataSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        setlocation: (state, action) => { 
            state.location = {...action.payload}
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
export const { setlocation,setFormattedAddress,setZoneIds } = AddressDataSlice.actions
export default AddressDataSlice.reducer
