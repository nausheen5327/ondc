import React, { useEffect, useState } from 'react'
import CustomModal from '../custom-modal/CustomModal'
import UserAddressList from './addressListComp';
import { useTheme } from '@emotion/react';
import { useMediaQuery } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { postCall } from '@/api/MainApi';
import { setAddressList } from '@/redux/slices/customer';
import { CustomToaster } from '../custom-toaster/CustomToaster';
import {  setlocation } from '@/redux/slices/addressData';
import toast from 'react-hot-toast';

const AddressList = (props) => {
    const {openAddressModal, setOpenAddressModal} = props;
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('md'))
    const addresses = useSelector((state)=>state.user.addressList)
    const dispatch = useDispatch();

    const onUpdateAddresses=async(addr)=>{
        try {
            let data = await cancellablePromise(
              postCall("/clientApis/v1/delivery_address",addr)
            );
            // if (deliveryAddress) {
            //   const findIndex = data.findIndex((item) => item.id === deliveryAddress.id);
            //   data.unshift(data.splice(findIndex, 1)[0]);
            // }
            // setDeliveryAddresses(data);
            // dispatch(setAddressList(data));
            let mergedAddr = Object.assign({}, addresses,addr);
            dispatch(setAddressList(mergedAddr));
          } catch (err) {
            // if (err.response.data.length > 0) {
            //   return;
            // }
            //toast for error in fetching addresses
          } finally {
            CustomToaster('success', 'Addresses added successfully')
            // setFetchDeliveryAddressLoading(false);
          }
    }

    const handleDeliveryAddressSelect=(addr)=>{
        //dispatch addr selected & show in top bar
        dispatch(setlocation(addr));
        localStorage.setItem('location', JSON.stringify(addr))
        const values = { lat: addr?.lat, lng: addr?.lng }
        localStorage.setItem('currentLatLng', JSON.stringify(values))
        setOpenAddressModal(false);
        CustomToaster("success","New delivery address selected.");

    }
  return (
    <CustomModal openModal={openAddressModal} bgColor={theme.palette.customColor.ten} closeButton={false} disable  maxWidth={isSmall ?"350px":"450px"} setModalOpen={setOpenAddressModal} >
        <UserAddressList addresses={addresses} onUpdateAddresses={onUpdateAddresses} onSelectAddress={handleDeliveryAddressSelect}/>
    </CustomModal>
  )
}


export default AddressList