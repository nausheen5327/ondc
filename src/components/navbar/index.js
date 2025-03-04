import React, { useEffect, useState } from 'react'
import { useScrollTrigger } from '@mui/material'
import { AppBarStyle } from './Navbar.style'
//import SecondNavbar from './second-navbar/SecondNavbar'
import TopNav from './top-navbar/TopNav'
import dynamic from 'next/dynamic'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@emotion/react'
import { useSelector } from 'react-redux'
import SecondNavbar, {
    getSelectedAddons,
    getSelectedVariations,
} from './second-navbar/SecondNavbar'
import { setCategoryIsSticky, setSticky } from '@/redux/slices/scrollPosition'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import {
    calculateItemBasePrice,
    checkMaintenanceMode,
    getConvertDiscount,
    handleProductValueWithOutDiscount,
} from '@/utils/customFunctions'
import { cart } from '@/redux/slices/cart'
import useGetAllCartList from '../../hooks/react-query/add-cart/useGetAllCartList'
import { getGuestId } from '../checkout-page/functions/getGuestUserId'
import { ConfigApi } from '@/hooks/react-query/config/useConfig'
import { useQuery } from 'react-query'
import { onSingleErrorResponse } from '@/components/ErrorResponse'
import { setCategoriesList, setGlobalSettings } from '@/redux/slices/global'
import CategoryMenu from './category-navbar.js'
import { Box, styled } from '@mui/system'
import { usePathname } from 'next/navigation'
import { CustomToaster } from '../custom-toaster/CustomToaster'
import { getCallStrapi } from '@/api/MainApi'

const Navigation = () => {
    // const SecondNavbar = dynamic(() => import('./second-navbar/SecondNavbar'), {
    //     ssr: false,
    // })
    const { global } = useSelector((state) => state.globalSettings)
    const router = useRouter()
    const dispatch = useDispatch()
    const guestId = getGuestId()
    const theme = useTheme()
    const isSmall = useMediaQuery(theme.breakpoints.down('md'))
    const { isSticky } = useSelector((state) => state.scrollPosition)
    const scrolling = useScrollTrigger()
    const [userLocation, setUserLocation] = useState(null)
    const { userLocationUpdate } = useSelector((state) => state.globalSettings)
    const categories = useSelector(state => state.globalSettings.categoriesList); // Adjust the path according to your Redux store structure
  
    const fetchCategories = async () => {
      try {
        const response = await getCallStrapi('/categories');
        dispatch(setCategoriesList(response));
      } catch (error) {
        CustomToaster('error', "Please check your internet connection");
        console.error('Failed to fetch categories:', error);
      }
    };
    useEffect(() => {
      fetchCategories();
    }, []); 
    useEffect(() => {
        let location = undefined
        if (typeof window !== 'undefined') {
            location = localStorage.getItem('location')
        }
        setUserLocation(location)
    }, [userLocationUpdate])
    console.log('User location', userLocation)
    useEffect(() => {
        if (router.pathname !== '/home') dispatch(setSticky(false))
        dispatch(setCategoryIsSticky(false))
    }, [router.pathname])
    const cartListSuccessHandler = (res) => {
        if (res) {
            const setItemIntoCart = () => {
                return res?.map((item) => ({
                    ...item?.item,
                    cartItemId: item?.id,
                    totalPrice:
                        getConvertDiscount(
                            item?.item?.discount,
                            item?.item?.discount_type,
                            handleProductValueWithOutDiscount(item?.item),
                            item?.item?.restaurant_discount
                        ) * item?.quantity,
                    selectedAddons: getSelectedAddons(item?.item?.addons),
                    quantity: item?.quantity,
                    variations: item?.item?.variations,
                    itemBasePrice: getConvertDiscount(
                        item?.item?.discount,
                        item?.item?.discount_type,
                        calculateItemBasePrice(
                            item?.item,
                            item?.item?.variations
                        ),
                        item?.item?.restaurant_discount
                    ),
                    selectedOptions: getSelectedVariations(
                        item?.item?.variations
                    ),
                }))
            }
            dispatch(cart(setItemIntoCart()))
        }
    }

    const pathname = usePathname();


    const handleConfigData = (res) => {
        if (res?.data) {
            dispatch(setGlobalSettings(res?.data))
        }
    }
    const { isLoading, data, isError, error, refetch } = useQuery(
        ['config'],
        ConfigApi.config,
        {
            enabled: false,
            onError: onSingleErrorResponse,
            onSuccess: handleConfigData,
            staleTime: 1000 * 60 * 8,
            cacheTime: 8 * 60 * 1000,
        }
    )
    useEffect(() => {
        if (!global) {
            refetch()
        }
    }, [data])
    useEffect(()=>{
       if(userLocation && pathname === '/') router.push('/home')
    },[userLocation])
    // if (checkMaintenanceMode(global)) {
    //     return null;
    // }

    // useEffect(() => {
    //     if (!global && data) {
    //         dispatch(setGlobalSettings(data))
    //     }
    // }, [data])


    const NavigationWrapper = styled('div')({
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1200,
      });
      
      // Top navigation bar wrapper
      const TopNavWrapper = styled(Box)({
        width: '100%',
        // height: '64px',
        backgroundColor: '#fff',
        position: 'relative',
        zIndex: 1101,
      });
      
      // Second navigation bar wrapper
      const SecondNavWrapper = styled(Box)(({ theme, isSticky }) => ({
        width: '100%',
        // height: '64px',
        backgroundColor: theme.palette.navbarBg || '#fff',
        position: 'relative',
        zIndex: 1201,
        boxShadow: '0px 5px 15px 0px rgba(0, 0, 0, 0.05)',
        transition: 'transform 0.3s ease',
        transform: isSticky ? 'translateY(0)' : 'translateY(-100%)',
      }));
      
      // Category menu wrapper
      const CategoryMenuWrapper = styled(Box)(({ theme }) => ({
        width: '100%',
        backgroundColor: '#1E1E1E',
        position: 'relative',
        zIndex: 1200,
      }));
      
   


    
    return (
        <NavigationWrapper hasSecondNav={!!userLocation} isSmall={isSmall}>
        <AppBarStyle
            disableGutters={true}
            scrolling={
                userLocation && router.pathname !== '/home' ? scrolling : false
            }
            isSmall={isSmall}
        >
            { (
               <TopNavWrapper>
               <TopNav />
           </TopNavWrapper>
            )}
                <SecondNavbar
                    isSticky={isSticky}
                    
                    location={userLocation}
                />
                {isSmall && (router.pathname==='/' || router.pathname==='/home') &&  (
                    <CategoryMenuWrapper>
                        <CategoryMenu categories={categories} />
                    </CategoryMenuWrapper>
                )}            
        </AppBarStyle>
        </NavigationWrapper>
    )
}


export default Navigation
