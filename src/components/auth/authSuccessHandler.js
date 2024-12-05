import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setIsLoading } from '@/redux/slices/global';
import { setAddressList } from '@/redux/slices/customer';
import { setlocation } from '@/redux/slices/addressData';
import { setCartList } from '@/redux/slices/cart';
import { getCall } from '@/api/MainApi';
import useCancellablePromise from '@/api/cancelRequest';

export const useAuthData = () => {
    const dispatch = useDispatch();
    const { cancellablePromise } = useCancellablePromise();

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
                }
            }
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

        // Optional: Setup listener for token changes
        const handleStorageChange = (e) => {
            if (e.key === 'token' && e.newValue) {
                fetchUserData();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return null;
};