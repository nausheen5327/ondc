import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
// import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
// import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import counterReducer from '../redux/slices/counter';
// import storage from 'redux-persist/lib/storage'; // Default to localStorage
import layoutReducer from '../redux/slices/layout';
import offlinePaymentInfoReducer from './slices/OfflinePayment';
import addressDataReducer from './slices/addressData';
import cartReducer from './slices/cart';
import cashbackReducer from './slices/cashbackList';
import userSlice from './slices/customer';
import editProfileReducer from './slices/editProfile';
import fbCredentialSlice from './slices/fbCredentials';
import globalSettingsReducer from './slices/global';
import guestUserReducer from './slices/guestUserInfo';
import landingPageSliceReducer from './slices/landingpagedata';
import languageChangeReducer from './slices/languageChange';
import orderTypeSlice from './slices/orderType';
import restaurantFoodFilterSlice from './slices/restaurantFoodFilter';
import scrollPosition from './slices/scrollPosition';
import searchFilterSlice from './slices/searchFilter';
import searchTagsReducer from './slices/searchTagSlice';
import storedDataSliceReducer from './slices/storedData';
import userTokenReducer from './slices/userToken';
import utilsReducers from './slices/utils';
import wishListSlice from './slices/wishList';

const createNoopStorage = () => ({
    getItem(_key) {
        return Promise.resolve(null);
    },
    setItem(_key, value) {
        return Promise.resolve(value);
    },
    removeItem(_key) {
        return Promise.resolve();
    },
});

// 



const reducers = combineReducers({
    counter: counterReducer,
    layout: layoutReducer,
    globalSettings: globalSettingsReducer,
    cart: cartReducer,
    wishList: wishListSlice,
    restaurantFoodFilterStore: restaurantFoodFilterSlice,
    searchFilterStore: searchFilterSlice,
    user: userSlice,
    orderType: orderTypeSlice,
    fbCredentialsStore: fbCredentialSlice,
    storedData: storedDataSliceReducer,
    landingPage: landingPageSliceReducer,
    userToken: userTokenReducer,
    languageChange: languageChangeReducer,
    offlinePayment: offlinePaymentInfoReducer,
    guestUserInfo: guestUserReducer,
    scrollPosition,
    searchTags: searchTagsReducer,
    addressData: addressDataReducer,
    isEditProfile: editProfileReducer,
    cashbackList: cashbackReducer,
    utilsData: utilsReducers,
});

// const persistedReducer = typeof window !== 'undefined' ? persistReducer(persistConfig, reducers) : reducers;

export const store = configureStore({
    reducer: reducers,
    // middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware({
    //         serializableCheck: {
    //             ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    //         },
    //     }),
});
