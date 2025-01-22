import React, { useEffect, useState } from "react";
import CustomModal from "../custom-modal/CustomModal";
import UserAddressList from "./addressListComp";
import { useTheme } from "@emotion/react";
import { Box, useMediaQuery } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getCall, postCall } from "@/api/MainApi";
import { setAddressList } from "@/redux/slices/customer";
import { CustomToaster } from "../custom-toaster/CustomToaster";
import { setlocation } from "@/redux/slices/addressData";
import toast from "react-hot-toast";
import useCancellablePromise from "@/api/cancelRequest";
import { setIsLoading } from "@/redux/slices/global";
import { useRouter } from "next/router";

const AddressList = (props) => {
  const { openAddressModal, setOpenAddressModal } = props;
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const addresses = useSelector((state) => state.user.addressList);
  console.log("address list", addresses);
  const [updatedAddedAddr, setUpdatedAddedAddr] = useState();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const router = useRouter();

  const fetchDeliveryAddress = async () => {
    // setFetchDeliveryAddressLoading(true);
    try {
      dispatch(setIsLoading(true));
      let data = await getCall("/clientApis/v1/delivery_address");
      if (updatedAddedAddr) {
        const findIndex = data.findIndex(
          (item) => item.id === updatedAddedAddr.id
        );
        console.log("findIndex", findIndex);
        if (findIndex !== -1) {
          dispatch(setlocation(updatedAddedAddr));
          localStorage.setItem("location", JSON.stringify(data[findIndex]));
        }
        dispatch(setlocation(updatedAddedAddr));
      }
      dispatch(setAddressList(data));
      dispatch(setIsLoading(false));
      router.push('/home')
    } catch (err) {
      CustomToaster("error", 'Unable to fetch delivery information');
      dispatch(setIsLoading(false));
      //toast for error in fetching addresses
    } finally {
      dispatch(setIsLoading(false));
      // setFetchDeliveryAddressLoading(false);
    }
  };
  const onUpdateAddresses = async (address) => {
    console.log("addr to be updated", address);
    if (!token) {
      let data = {
        descriptor: {
          name: address.descriptor.name.trim(),
          email: address.descriptor.email.trim(),
          phone: address.descriptor.phone.trim(),
        },
        address: {
          areaCode: address.address.areaCode.trim(),
          building: address.address.building.trim(),
          city: address.address.city.trim(),
          country: "IND",
          door: address.address.building.trim(),
          building: address.address.building.trim(),
          state: address.address.state.trim(),
          street: address.address.street.trim(),
          tag: address.address.tag.trim(),
          lat: address.address.lat,
          lng: address.address.lng,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUpdatedAddedAddr(data);
      dispatch(setlocation(data));
      dispatch(setAddressList([data]));
      localStorage.setItem("location", JSON.stringify(data));
      const values = { lat: address.address.lat, lng: address.address.lng };
      localStorage.setItem("currentLatLng", JSON.stringify(values));
      setOpenAddressModal(false);
      CustomToaster("success", "New delivery address selected.");
      router.push('/home');
      dispatch(setIsLoading(false));
      return;
    }else{
      try {
        dispatch(setIsLoading(true));
        const data = await postCall(
          `/clientApis/v1/update_delivery_address/${address.id}`,
          {
            descriptor: {
              name: address.descriptor.name.trim(),
              email: address.descriptor.email.trim(),
              phone: address.descriptor.phone.trim(),
            },
            address: {
              areaCode: address.address.areaCode.trim(),
              building: address.address.building.trim(),
              city: address.address.city.trim(),
              country: "IND",
              door: address.address.building.trim(),
              building: address.address.building.trim(),
              state: address.address.state.trim(),
              street: address.address.street.trim(),
              tag: address.address.tag.trim(),
              lat: address.address.lat,
              lng: address.address.lng,
            },
          }
        );
        setUpdatedAddedAddr(data);
        dispatch(setIsLoading(false));
        fetchDeliveryAddress();
      } catch (err) {
        CustomToaster("error", 'Unable to update address');
        dispatch(setIsLoading(false));
      } finally {
        // setAddAddressLoading(false);
        dispatch(setIsLoading(false));
      }
    }
    
  };

  const onAddAddress = async (address) => {
    if (!token) {
      let data = {
        descriptor: {
          name: address.descriptor.name.trim(),
          email: address.descriptor.email.trim(),
          phone: address.descriptor.phone.trim(),
        },
        address: {
          areaCode: address.address.areaCode.trim(),
          building: address.address.building.trim(),
          city: address.address.city.trim(),
          country: "IND",
          door: address.address.building.trim(),
          building: address.address.building.trim(),
          state: address.address.state.trim(),
          street: address.address.street.trim(),
          tag: address.address.tag.trim(),
          lat: address.address.lat,
          lng: address.address.lng,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUpdatedAddedAddr(data);
      dispatch(setlocation(data));
      dispatch(setAddressList([data]));
      localStorage.setItem("location", JSON.stringify(data));
      const values = { lat: address.address.lat, lng: address.address.lng };
      localStorage.setItem("currentLatLng", JSON.stringify(values));
      setOpenAddressModal(false);
      CustomToaster("success", "New delivery address selected.");
      router.push('/home');
      dispatch(setIsLoading(false));
      return;
    }
    try {
      dispatch(setIsLoading(true));
      const data = await postCall(`/clientApis/v1/delivery_address`, {
        descriptor: {
          name: address.descriptor.name.trim(),
          email: address.descriptor.email.trim(),
          phone: address.descriptor.phone.trim(),
        },
        address: {
          areaCode: address.address.areaCode.trim(),
          building: address.address.building.trim(),
          city: address.address.city.trim(),
          country: "IND",
          door: address.address.building.trim(),
          building: address.address.building.trim(),
          state: address.address.state.trim(),
          street: address.address.street.trim(),
          tag: address.address.tag.trim(),
          lat: address.address.lat,
          lng: address.address.lng,
        },
      });
      dispatch(setIsLoading(false));
      setUpdatedAddedAddr(data);
      fetchDeliveryAddress();
    } catch (err) {
      CustomToaster("error", 'Unable to add delivery address ');
      dispatch(setIsLoading(false));
    } finally {
      dispatch(setIsLoading(false));
      // setAddAddressLoading(false);
    }
  };

  const handleDeliveryAddressSelect = (addr) => {
    //dispatch addr selected & show in top bar
    dispatch(setlocation(addr));
    localStorage.setItem("location", JSON.stringify(addr));
    const values = { lat: addr?.lat, lng: addr?.lng };
    localStorage.setItem("currentLatLng", JSON.stringify(values));
    setOpenAddressModal(false);
    CustomToaster("success", "New delivery address selected.");
    router.push('/home');
  };
  return (
    <CustomModal
      openModal={openAddressModal}
      bgColor={theme.palette.customColor.ten}
      closeButton={false}
      disable
      maxWidth={isSmall ? "350px" : "450px"}
      setModalOpen={setOpenAddressModal}
    >
      <Box sx={{ maxHeight: "100%", overflowY: "auto" }}>
        <UserAddressList
          addresses={addresses}
          onUpdateAddresses={onUpdateAddresses}
          onSelectAddress={handleDeliveryAddressSelect}
          onAddAddress={onAddAddress}
        />
      </Box>
    </CustomModal>
  );
};

export default AddressList;
