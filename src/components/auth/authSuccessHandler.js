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
              await fetchDeliveryAddress();
            } catch (err) {
              CustomToaster("error", err);
              dispatch(setIsLoading(false));
            } finally {
              dispatch(setIsLoading(false));
              // setAddAddressLoading(false);
            }
    }
    const fetchDeliveryAddress = async () => {
        dispatch(setIsLoading(true));
        try {
            const data = await getCall("/clientApis/v1/delivery_address")
            // Check if we have stored location and update it
            const storedLocation = localStorage.getItem('location');
            if (storedLocation) {
                const locationData = JSON.parse(storedLocation);
                const findIndex = data.findIndex((item) => item.id === locationData.id);
                if (findIndex !== -1) {
                    dispatch(setlocation(locationData));
                    localStorage.setItem('location', JSON.stringify(data[findIndex]));
                }}
            // }else{
            //     dispatch(setlocation(data[0]));
            //     localStorage.setItem('location', JSON.stringify(data[0]));
            // }
            dispatch(setAddressList(data));
        } catch (err) {
            console.error('Error fetching delivery address:', err);
        } finally {
            dispatch(setIsLoading(false));
        }
    };

    const fetchCartItems = async () => {
        const userData = localStorage.getItem('user');
        if (!userData) return;

        const parsedUser = JSON.parse(userData);
        if (!parsedUser.localId) return;

        dispatch(setIsLoading(true));
        try {
            const url = `/clientApis/v2/cart/${parsedUser.localId}`;
            const res = await getCall(url);
            dispatch(setCartList(res));
        } catch (error) {
            console.error("Error fetching cart items:", error);
        } finally {
            dispatch(setIsLoading(false));
        }
    };

    // Function to fetch both address and cart
    const fetchUserData = () => {
        const token = localStorage.getItem('token');
        if (token) {
            if(!location?.id) {
               postUserLocation();
            }
            fetchDeliveryAddress();
            fetchCartItems();
        }
    };

    return {
        fetchDeliveryAddress,
        fetchCartItems,
        fetchUserData
    };
};

// Optional: Auth state listener component
export const AuthDataListener = () => {
    const { fetchUserData } = useAuthData();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUserData();
        }
    }, []);

    return null;
};