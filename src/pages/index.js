import LandingPage from '../components/landingpage'
import React, { useEffect } from 'react'
import Meta from '../components/Meta'
import { setGlobalSettings, setIsLoading } from "@/redux/slices/global"
import { useDispatch, useSelector } from 'react-redux'
import Router, { useRouter } from "next/router";
import { CustomHeader } from "@/api/Headers"
import { setAddressList } from '@/redux/slices/customer'
import useCancellablePromise from '@/api/cancelRequest'
import { getCall } from '@/api/MainApi'
import { setlocation } from '@/redux/slices/addressData'
import cart, { setCartList } from '@/redux/slices/cart'
import { withAuth } from '@/components/withAuth'

const Home = ({ configData, landingPageData, searchQuery }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { cancellablePromise } = useCancellablePromise();
    const addressList = useSelector((state) => state.user.addressList);
    console.log(addressList,"address list");
    let user ;
    let localLocation ='';
    useEffect(()=>{
        if(localStorage.getItem('location'))
        {
            localLocation = JSON.parse(localStorage.getItem('location'));
        }
        if(localStorage.getItem('user'))
        {
            user = JSON.parse(localStorage.getItem('user'));
        }
    },[])
    //here check for address selected
    // const { deliveryAddress, billingAddress, setDeliveryAddress } =
    // useContext(AddressContext);
    const fetchDeliveryAddress = async () => {
        // setFetchDeliveryAddressLoading(true);
        dispatch(setIsLoading(true));
        try {
            let data = await cancellablePromise(
              getCall("/clientApis/v1/delivery_address")
            );
            dispatch(setIsLoading(false));

            if(localLocation)
            {
                console.log("testing...",localLocation);
                const findIndex = data.findIndex((item) => item.id === localLocation.id);
                console.log("testing...",findIndex);
                if(findIndex!==-1){
                    dispatch(setlocation(localLocation));
                    localStorage.setItem('location',JSON.stringify(data[findIndex]));
                    router.replace('/home')
                }
            }
            // if (deliveryAddress) {
            //   const findIndex = data.findIndex((item) => item.id === deliveryAddress.id);
            //   data.unshift(data.splice(findIndex, 1)[0]);
            // }
            // setDeliveryAddresses(data);
            dispatch(setAddressList(data));
          } catch (err) {
            dispatch(setIsLoading(false));
            if (err?.response?.data?.length > 0) {
              return;
            }
            //toast for error in fetching addresses
          } finally {
            dispatch(setIsLoading(false));
            // setFetchDeliveryAddressLoading(false);
          }
      };


    dispatch(setGlobalSettings(configData));
    const getCartItems = async () => {
        try {
        //   setLoading(true);
        dispatch(setIsLoading(true));
          const url = `/clientApis/v2/cart/${user.localId}`;
          const res = await getCall(url);
          dispatch(setIsLoading(false));

          console.log("cart...",res);
          dispatch(setCartList(res));
          //add in cart 
        //   setCartItems(res);
        //   updatedCartItems.current = res;
        //   if (setCheckoutCartItems) {
        //     setCheckoutCartItems(res);
        //   }
        } catch (error) {
            dispatch(setIsLoading(false));

          console.log("Error fetching cart items:", error);
        //   setLoading(false);
        } finally {
            dispatch(setIsLoading(false));

        //   setLoading(false);
        }
      };

     
    useEffect(() => {
        //use this logic for login
        // const isLoggedIn = checkIfUserIsLoggedIn(); 
        // if (!isLoggedIn) {
        //     router.push('/login'); 
        //     return;
        // }
       //use this logic for login
      //  console.log("bhaiii token");
      
        console.log("bhaiii token",localStorage.getItem('token'));
        if(localStorage.getItem('token'))
        {
         dispatch(setGlobalSettings(configData));
         fetchDeliveryAddress();
         getCartItems();
        }
         if(!localStorage.getItem('token') && localStorage.getItem('location'))
         {
           dispatch(setlocation(JSON.parse(localStorage.getItem('location'))));
           router.replace('/home')
         }
      
     
       
    }, []);
    return (
        <>
            <Meta
                title={"ONDC"}
                ogImage={`https://ondcpreprod.nazarasdk.com/static/media/logo1.ae3b79430a977262a2e9.jpg`}
            />
                {configData && (
                    <LandingPage
                        global={configData}
                        landingPageData={landingPageData}
                    />
                )}
        </>
    );
}

// Example function to check if user is logged in
const checkIfUserIsLoggedIn = () => {
    // You can check for a token in localStorage or cookies
    const token = localStorage.getItem('token'); // Example token key
    // alert(token);
    return !!token; // Returns true if token exists, false otherwise
}

export default withAuth(Home,false);



// pages/index.js
export async function getServerSideProps(context) {
    const { query } = context
  
    // Your existing data fetching logic
    let configData = {
      business_name: "ONDC",
      // ... other config data
    }
  
    let landingPageData = {
      banner_section_full: { 
        banner_section_img_full: "https://source.unsplash.com/random/400x300" 
      }
    }
  
    // If there's a search query, fetch search results
    let searchResults = null
    if (query.query) {
      try {
        // Add your search API call here
        // searchResults = await fetchSearchResults(query.query)
      } catch (error) {
        console.error('Search error:', error)
      }
    }
  
    return {
      props: {
        configData,
        landingPageData,
        searchResults,
        searchQuery: query.query || null
      }
    }
  }