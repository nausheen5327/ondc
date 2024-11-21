import LandingPage from '../components/landingpage'
import React, { useEffect } from 'react'
import Meta from '../components/Meta'
import { setGlobalSettings } from "@/redux/slices/global"
import { useDispatch, useSelector } from 'react-redux'
import Router, { useRouter } from "next/router";
import { CustomHeader } from "@/api/Headers"
import { setAddressList } from '@/redux/slices/customer'
import useCancellablePromise from '@/api/cancelRequest'
import { getCall } from '@/api/MainApi'
import { setlocation } from '@/redux/slices/addressData'
import cart, { setCartList } from '@/redux/slices/cart'
import { withAuth } from '@/components/withAuth'

const Home = () => {
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
        try {
            let data = await cancellablePromise(
              getCall("/clientApis/v1/delivery_address")
            );
            if(localLocation)
            {
                console.log("testing...",localLocation);
                const findIndex = data.findIndex((item) => item.id === localLocation.id);
                console.log("testing...",findIndex);
                if(findIndex!==-1){
                    dispatch(setlocation(localLocation));
                    localStorage.setItem('location',JSON.stringify(data[findIndex]));
                }
            }
            // if (deliveryAddress) {
            //   const findIndex = data.findIndex((item) => item.id === deliveryAddress.id);
            //   data.unshift(data.splice(findIndex, 1)[0]);
            // }
            // setDeliveryAddresses(data);
            dispatch(setAddressList(data));
          } catch (err) {
            if (err?.response?.data?.length > 0) {
              return;
            }
            //toast for error in fetching addresses
          } finally {
            // setFetchDeliveryAddressLoading(false);
          }
      };

      let configData = {
        business_name: "Mock Business",
        base_urls: { react_landing_page_images: "https://mockurl.com/images" },
        fav_icon_full_url : "https://ondcpreprod.nazarasdk.com/static/media/logo1.ae3b79430a977262a2e9.jpg",
        default_location: {
            lat:21.13,
            lng:79.06
        }
    };

    let landingPageData = {
                    banner_section_full: { banner_section_img_full: "https://source.unsplash.com/random/400x300" },
                };

    dispatch(setGlobalSettings(configData));
    const getCartItems = async () => {
        try {
        //   setLoading(true);
          const url = `/clientApis/v2/cart/${user.localId}`;
          const res = await getCall(url);
          console.log("cart...",res);
          dispatch(setCartList(res));
          //add in cart 
        //   setCartItems(res);
        //   updatedCartItems.current = res;
        //   if (setCheckoutCartItems) {
        //     setCheckoutCartItems(res);
        //   }
        } catch (error) {
          console.log("Error fetching cart items:", error);
        //   setLoading(false);
        } finally {
        //   setLoading(false);
        }
      };

     
    useEffect(() => {
        const isLoggedIn = checkIfUserIsLoggedIn(); // Implement this function

        if (!isLoggedIn) {
            router.push('/login'); // Redirect to login if not logged in
            return;
        }
        //            dispatch(setGlobalSettings(configData));
        fetchDeliveryAddress();
        getCartItems();

       
    }, [router, dispatch]);

   

   

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

export default withAuth(Home);



// export const getServerSideProps = async (context) => {
//     // console.log("heloo.....")
//     let configData = null;
//     let landingPageData = null;
//     const token = localStorage.getItem("token");
//     try {
//         const configRes = await fetch(
//             `${process.env.NEXT_PUBLIC_BASE_URL}/v1/delivery_address`,
//             {
//                 method: 'GET',
//                 headers: {
//                     origin: process.env.NEXT_CLIENT_HOST_URL,
//                     Authorization: `Bearer ${token}`
//                 },
//             }
//         );

//         if (!configRes.ok) throw new Error(`Failed to fetch config data: ${configRes.status}`);
//         let configResData = await configRes.json();
        
//         let configInfoData = {
//             business_name: "Mock Business",
//             base_urls: { react_landing_page_images: "https://mockurl.com/images" },
//             fav_icon_full_url : "https://ondcpreprod.nazarasdk.com/static/media/logo1.ae3b79430a977262a2e9.jpg",
//             default_location: {
//                 lat:21.13,
//                 lng:79.06
//             }
//         };
//         configData = Object.assign({}, configResData,configInfoData);
//     } catch (error) {
//         console.log('Error in config data fetch, using mock data:', error);
//     }

//     try {
//         const landingPageRes = await fetch(
//             `${process.env.NEXT_PUBLIC_BASE_URL}/v2/providers`,
//             { method: 'GET', headers: CustomHeader }
//         );

//         if (!landingPageRes.ok) throw new Error(`Failed to fetch landing page data: ${landingPageRes.status}`);
//         landingPageData = await landingPageRes.json();
//         landingPageData['banner_section_full'] = { banner_section_img_full: "https://source.unsplash.com/random/400x300" }
//     } catch (error) {
//         console.log('Error in landing page data fetch, using mock data:', error);
//         landingPageData = {
//             banner_section_full: { banner_section_img_full: "https://source.unsplash.com/random/400x300" },
//         };
//     }

//     return {
//         props: {
//             configData,
//             landingPageData,
//         },
//     };
// };
