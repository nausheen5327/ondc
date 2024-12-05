import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    global: undefined,
    couponInfo: null,
    couponType: '',
    zoneData: null,
    handleHomePage: false,
    openMapDrawer: false,
    userLocationUpdate: false,
    isLoading: false,
    authModalOpen: false,
    sideDrawerOpen: false
}

export const globalSettingSlice = createSlice({
    name: 'globalData',
    initialState,
    reducers: {
        setGlobalSettings: (state, action) => {
            state.global = action.payload
        },
        setCustomerProfile: (state, action) => {
            state.customerProfile = action?.payload
        },
        setCouponInfo: (state, action) => {
            state.couponInfo = action?.payload
        },
        setCouponType: (state, action) => {
            state.couponType = action?.payload
        },
        setZoneData: (state, action) => {
            state.zoneData = action?.payload
        },
        setHandleHomePage: (state, action) => {
            state.handleHomePage = action.payload
        },
        setOpenMapDrawer: (state, action) => {
            state.openMapDrawer = action.payload
        },
        setUserLocationUpdate: (state, action) => {
            state.userLocationUpdate = action.payload
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setAuthModalOpen:(state,action)=>{
            state.authModalOpen = action.payload
        },
        setSideDrawerOpen:(state,action)=>{
            state.sideDrawerOpen = action.payload
        }
        
    },
})

// Action creators are generated for each case reducer function
export const {
    setGlobalSettings,

    setCustomerProfile,
    setCouponInfo,
    setCouponType,
    setZoneData,
    setHandleHomePage,
    setOpenMapDrawer,
    setUserLocationUpdate,
    setIsLoading,
    setAuthModalOpen,
    setSideDrawerOpen
} = globalSettingSlice.actions
export default globalSettingSlice.reducer
