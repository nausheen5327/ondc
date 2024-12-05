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
import PlacePickerMap from "../placePickerMap/placePickerMap";
import { useRouter } from "next/router";

const GuestAddressList = (props) => {
  const { openAddressModal, setOpenAddressModal } = props;
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const addresses = useSelector((state) => state.user.addressList);
  const [updatedAddedAddr, setUpdatedAddedAddr] = useState();
  const dispatch = useDispatch();
  const {cancellablePromise} = useCancellablePromise();
  const router = useRouter();

  const location = useSelector((state) => state.addressData.location);
  // console.log("location for def",location);
 
  const [currentAddress, setCurrentAddress] = useState({
    id: "",
    descriptor: {
      name: "",
      phone: "",
      email: "",
    },
    address: {
      door: "",
      building: "",
      street: "",
      city: "",
      state: "",
      areaCode: "",
      tag: "",
      lat: "",
      lng: "",
      country: "IND",
    },
  });
  const [customTag, setCustomTag] = useState("");
  const [formErrors, setFormErrors] = useState({});


  const handleSetCurrentAddress = (addr)=>{
    console.log("bhai inside",addr);
    setCurrentAddress(addr)
    setOpenAddressModal(false);
    dispatch(setlocation(addr));
    localStorage.setItem('location',JSON.stringify(addr));
    router.push('/home')
  }

  useEffect(()=>{
    console.log("bhai inside effect",currentAddress);
    if(currentAddress?.address?.lat)
    {
      handleSetCurrentAddress(currentAddress)
    }
  },[currentAddress])

  const fetchDeliveryAddress = async () => {
    // setFetchDeliveryAddressLoading(true);
    try {
      dispatch(setIsLoading(true));
        let data = await cancellablePromise(
          getCall("/clientApis/v1/delivery_address")
        );
        if(updatedAddedAddr)
        {
            const findIndex = data.findIndex((item) => item.id === updatedAddedAddr.id);
            console.log('findIndex', findIndex);
            if(findIndex!==-1){
                dispatch(setlocation(updatedAddedAddr));
                localStorage.setItem('location',JSON.stringify(data[findIndex]));
            }
        }
        dispatch(setAddressList(data));
        dispatch(setlocation(updatedAddedAddr))
        dispatch(setIsLoading(false));
      } catch (err) {
        CustomToaster('error',err)
        dispatch(setIsLoading(false));
        //toast for error in fetching addresses
      } finally {
        dispatch(setIsLoading(false));
        // setFetchDeliveryAddressLoading(false);
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
      <MapPicker
            address={currentAddress.address}
            setAddress={setCurrentAddress}
          />
      </Box>
    </CustomModal>
  );
};
const MapPicker = (props) => {
    const { address, setAddress } = props;
    console.log("MapPicker props=====>", props);
    let locationString = "28.679076630288467,77.06970870494843";
    locationString = locationString.split(",");
    const gps = {
      lat: locationString[0],
      lng: locationString[1],
    };
  
    const [location, setLocation] = useState(null);
  
    useEffect(() => {
      if (address.lat && address.lng) {
        console.log(address.areaCode);
        setLocation({
          lat: address.lat,
          lng: address.lng,
          street: address.street,
          city: address.city,
          state: address.state,
          pincode: address.areaCode,
        });
      }
    }, []);
  
    useEffect(() => {
      if (location) {
        setAddress((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            street: location.street,
            city: location.city,
            state: location.state,
            areaCode: location.pincode,
            lat: parseFloat(location.lat).toFixed(6).toString(),
            lng: parseFloat(location.lng).toFixed(6).toString(),
          },
        }));
      }
    }, [location]);
    console.log("location...", location);
    return (
      <div style={{ width: "100%", height: "400px" }}>
        <PlacePickerMap location={location || gps} setLocation={setLocation} />
      </div>
    );
  };
export default GuestAddressList;
