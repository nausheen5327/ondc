import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userData: {},
    addressList: []
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.userData = action.payload
        },
        setAddressList: (state, action) => {
            state.addressList = action.payload
        }
    },
})

// Action creators are generated for each case reducer function
export const { setUser, setAddressList } = userSlice.actions
export default userSlice.reducer
