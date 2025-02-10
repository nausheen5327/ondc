import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsLoading } from '@/redux/slices/global';
import { setAddressList } from '@/redux/slices/customer';
import { setlocation } from '@/redux/slices/addressData';
import { setCartList } from '@/redux/slices/cart';
import { getCall, postCall } from '@/api/MainApi';
import useCancellablePromise from '@/api/cancelRequest';
import { CustomToaster } from '../custom-toaster/CustomToaster';

export const useAuthData = () => {
    const dispatch = useDispatch();
    const { cancellablePromise } = useCancellablePromise();
    const location = useSelector(state=>state.addressData.location);
    const postUserLocation = async()=>{
        console.log('verified 2')
        try {
              dispatch(setIsLoading(true));
              const data = await postCall(`/clientApis/v1/delivery_address`, {
                descriptor: {
                  name: location.descriptor.name.trim(),
                  email: location.descriptor.email.trim(),
                  phone: location.descriptor.phone.trim(),
                },
                address: {
                  areaCode: location.address.areaCode.trim(),
                  building: location.address.building.trim(),
                  city: location.address.city.trim(),
                  country: "IND",
                  door: location.address.building.trim(),
                  building: location.address.building.trim(),
                  state: location.address.state.trim(),
                  street: location.address.street.trim(),
                  tag: location.address.tag.trim(),
                  lat: location.address.lat,
                  lng: location.address.lng,
                },
              });
              dispatch(setIsLoading(false));
            //   dispatch(setlocation(null));
            //   dispatch(setAddressList([]));
            if (response && response.id) {
              await fetchDeliveryAddress(response.id);
          }
            } catch (err) {
              console.log("error", err);
              dispatch(setIsLoading(false));
            } finally {
            console.log('verified 3')
              dispatch(setIsLoading(false));
              // setAddAddressLoading(false);
            }
    }
    // const fetchDeliveryAddress = async () => {
    //     console.log('verified 4')
    //     dispatch(setIsLoading(true));
    //     try {
    //         const data = await getCall("/clientApis/v1/delivery_address")
    //         // Check if we have stored location and update it
    //         const storedLocation = localStorage.getItem('location');
    //         if (storedLocation) {
    //             const locationData = JSON.parse(storedLocation);
    //             const findIndex = data.findIndex((item) => item.id === locationData.id);
    //             if (findIndex !== -1) {
    //                 dispatch(setlocation(locationData));
    //                 localStorage.setItem('location', JSON.stringify(data[findIndex]));
    //             } else{
    //               dispatch(setlocation(data[data?.length-1]));
    //               localStorage.setItem('location', JSON.stringify(data[data?.length-1]));
    //             }
    //             // else{
    //             //         let len_data = data.length;
    //             //         if(len_data){
    //             //             dispatch(setlocation(data[len_data-1]));
    //             //             localStorage.setItem('location', JSON.stringify(data[len_data-1]));
    //             //         }
                        
    //             //     }
    //         }
    //         // }
    //         dispatch(setAddressList(data));
    //         localStorage.setItem('addressList', JSON.stringify(data))
    //     } catch (err) {
    //         console.error('Error fetching delivery address:', err);
    //         CustomToaster('error', 'Error fetching delivery address')
    //     } finally {
    //         console.log('verified 5')
    //         dispatch(setIsLoading(false));
    //     }
    // };

    
    const fetchDeliveryAddress = async (newAddressId = null) => {
      dispatch(setIsLoading(true));
      try {
          const data = await getCall("/clientApis/v1/delivery_address");
          
          if (newAddressId) {
              // If we just posted a new address, find and set it
              const newAddress = data.find(addr => addr.id === newAddressId);
              if (newAddress) {
                  dispatch(setlocation(newAddress));
                  localStorage.setItem('location', JSON.stringify(newAddress));
              }
          } else {
              // Handle existing stored location
              const storedLocation = localStorage.getItem('location');
              if (storedLocation) {
                  const locationData = JSON.parse(storedLocation);
                  const existingAddress = data.find(addr => addr.id === locationData.id);
                  
                  if (existingAddress) {
                      dispatch(setlocation(existingAddress));
                      localStorage.setItem('location', JSON.stringify(existingAddress));
                  } else {
                      // If stored location not found, use latest address
                      const latestAddress = data[data.length - 1];
                      if (latestAddress) {
                          dispatch(setlocation(latestAddress));
                          localStorage.setItem('location', JSON.stringify(latestAddress));
                      }
                  }
              }
          }
          
          dispatch(setAddressList(data));
          localStorage.setItem('addressList', JSON.stringify(data));
      } catch (err) {
          console.error('Error fetching delivery address:', err);
          CustomToaster('error', 'Error fetching delivery address');
      } finally {
          dispatch(setIsLoading(false));
      }
  };
    const fetchCartItems = async () => {
        const userData = localStorage.getItem('user');
        if (!userData) return;
        console.log('verified 6')
        const parsedUser = JSON.parse(userData);
        if (!parsedUser._id) return;

        // dispatch(setIsLoading(true));
        try {
            const url = `/clientApis/v2/cart/${parsedUser._id}`;
            const res = await getCall(url);
            dispatch(setCartList(res));
        } catch (error) {
            console.error("Error fetching cart items:", error);
            CustomToaster('error', "Error fetching cart items")
        } finally {
            console.log('verified 7')
            // dispatch(setIsLoading(false));
        }
    };
    const postCartItems=async(preAuthItems)=>{
        const user = JSON.parse(localStorage.getItem('user'));
        try {
            for (const item of preAuthItems) {
              await postCall(`/clientApis/v2/cart/${user._id}`, item);
            }
            
            // Clear pre-auth cart after successful sync
            localStorage.removeItem('cartItemsPreAuth');
            localStorage.removeItem('cartListPreAuth');
          } catch (error) {
            console.error('Error syncing pre-auth cart:', error);
          }
    }
    // Function to fetch both address and cart
    const fetchUserData = () => {
        const token = localStorage.getItem('token');
        let cartItemsPreAuth = localStorage.getItem('cartItemsPreAuth');
        console.log('verified 1',token);
        if (token) {
            if(!location?.id) {
               postUserLocation();
            }else{
              fetchCartItems();
            }
            if(cartItemsPreAuth)
            {
                cartItemsPreAuth = JSON.parse(cartItemsPreAuth);
                if(cartItemsPreAuth.length)
                {
                   postCartItems(cartItemsPreAuth);
                }
            }
            fetchDeliveryAddress(); 
        }
    };

    return {
        fetchDeliveryAddress,
        fetchCartItems,
        fetchUserData
    };
};

