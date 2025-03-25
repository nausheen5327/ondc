// import React, { useEffect, useState } from 'react'
// import { useScrollTrigger } from '@mui/material'
// import { AppBarStyle } from './Navbar.style'
// import { throttle } from 'lodash'
// import TopNav from './top-navbar/TopNav'
// import dynamic from 'next/dynamic'
// import useMediaQuery from '@mui/material/useMediaQuery'
// import { useTheme } from '@emotion/react'
// import { useSelector } from 'react-redux'
// import SecondNavbar, {
//     getSelectedAddons,
//     getSelectedVariations,
// } from './second-navbar/SecondNavbar'
// import { setCategoryIsSticky, setSticky } from '@/redux/slices/scrollPosition'
// import { useDispatch } from 'react-redux'
// import { useRouter } from 'next/router'
// import {
//     calculateItemBasePrice,
//     checkMaintenanceMode,
//     getConvertDiscount,
//     handleProductValueWithOutDiscount,
// } from '@/utils/customFunctions'
// import { cart } from '@/redux/slices/cart'
// import { getGuestId } from '../checkout-page/functions/getGuestUserId'
// import { ConfigApi } from '@/hooks/react-query/config/useConfig'
// import { useQuery } from 'react-query'
// import { onSingleErrorResponse } from '@/components/ErrorResponse'
// import { setCategoriesList, setGlobalSettings } from '@/redux/slices/global'
// import { Box, styled } from '@mui/system'
// import { usePathname } from 'next/navigation'
// import { getCallTest } from '@/api/MainApi'

// // Dynamically import the CategoryMenu component with loading state
// const CategoryMenu = dynamic(() => import('./category-navbar.js'), {
//     loading: () => (
//         <Box
//             sx={{
//                 width: '100%',
//                 backgroundColor: '#1E1E1E',
//                 height: '64px',
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//             }}
//         >
//             <Box
//                 sx={{
//                     width: '80%',
//                     height: '8px',
//                     backgroundColor: '#333',
//                     borderRadius: '4px',
//                     opacity: 0.5,
//                     animation: 'pulse 1.5s infinite ease-in-out',
//                 }}
//             />
//         </Box>
//     ),
//     ssr: false,
// });

// const Navigation = () => {
//     const { global } = useSelector((state) => state.globalSettings)
//     const router = useRouter()
//     const dispatch = useDispatch()
//     const guestId = getGuestId()
//     const theme = useTheme()
//     const isSmall = useMediaQuery(theme.breakpoints.down('md'))
//     const { isSticky } = useSelector((state) => state.scrollPosition)
//     const scrolling = useScrollTrigger()
//     const [userLocation, setUserLocation] = useState(null)
//     const { userLocationUpdate } = useSelector((state) => state.globalSettings)
//     const categories = useSelector(state => state.globalSettings.categoriesList);
  
//     // // Lazy-load category data
//     // const fetchCategories = async () => {
//     //   try {
//     //     // Use dynamic import for the API call
//     //     const response = await getCallTest('/nodeStrapi/strapi/categories');
//     //     dispatch(setCategoriesList(response));
//     //   } catch (error) {
//     //     console.error('Failed to fetch categories:', error);
//     //     let categories = [
//     //         {title:'Food',
//     //             imageSrc:'https://res.cloudinary.com/dbctmcyg0/image/upload/v1741167043/pizza_r66op5.png'
//     //         },
//     //         {title:'Electronics',
//     //             imageSrc:'https://res.cloudinary.com/dbctmcyg0/image/upload/v1741167046/smartphone_dotw66.png'
//     //         },
//     //         {title:'Fashion',
//     //             imageSrc:'https://res.cloudinary.com/dbctmcyg0/image/upload/v1741167043/shirt_pvhvvp.png'
//     //         },
//     //         {title:'Groceries',
//     //             imageSrc:'https://res.cloudinary.com/dbctmcyg0/image/upload/v1741167042/shopping-basket_fayoda.png'
//     //         },
//     //         {title:'Home Decor',
//     //             imageSrc:'https://res.cloudinary.com/dbctmcyg0/image/upload/v1741167042/bed-double_lhr4iq.png'
//     //         },
//     //         {title:'Gift-Cards',
//     //             imageSrc:'https://res.cloudinary.com/dbctmcyg0/image/upload/v1741167043/gift_uxvev1.png'
//     //         }
//     //     ]
//     //     dispatch(setCategoriesList(categories))
//     //   }
//     // };

//     // // Only fetch categories on client side
//     // useEffect(() => {
//     //   if (typeof window !== 'undefined') {
//     //     // Use requestIdleCallback for non-critical data fetching
//     //     if ('requestIdleCallback' in window) {
//     //       window.requestIdleCallback(() => {
//     //         fetchCategories();
//     //       });
//     //     } else {
//     //       // Fallback for browsers that don't support requestIdleCallback
//     //       setTimeout(fetchCategories, 100);
//     //     }
//     //   }
//     // }, []);

//     useEffect(() => {
//         let location = undefined
//         if (typeof window !== 'undefined') {
//             location = localStorage.getItem('location')
//         }
//         setUserLocation(location)
//     }, [userLocationUpdate])

//     useEffect(() => {
//         if (router.pathname !== '/home') dispatch(setSticky(false))
//         dispatch(setCategoryIsSticky(false))
//     }, [router.pathname])

//     const handleConfigData = (res) => {
//         if (res?.data) {
//             dispatch(setGlobalSettings(res?.data))
//         }
//     }

//     const { isLoading, data, refetch } = useQuery(
//         ['config'],
//         ConfigApi.config,
//         {
//             enabled: false,
//             onError: onSingleErrorResponse,
//             onSuccess: handleConfigData,
//             staleTime: 1000 * 60 * 8,
//             cacheTime: 8 * 60 * 1000,
//         }
//     )

//     useEffect(() => {
//         if (!global) {
//             refetch()
//         }
//     }, [data])

//     useEffect(() => {
//        if(userLocation && pathname === '/') router.push('/home')
//     }, [userLocation])


//     const [scrollState, setScrollState] = useState({
//         direction: 'down', // 'up' or 'down'
//         prevPosition: 0,
//         visible: true
//       });


//       useEffect(() => {
//         let lastScrollY = window.pageYOffset;
        
//         const handleScroll = throttle(() => {
//           const currentScrollY = window.pageYOffset;
//           const direction = currentScrollY > lastScrollY ? 'down' : 'up';
//           const visible = direction === 'up' || currentScrollY < 50;
          
//           setScrollState({
//             direction,
//             prevPosition: lastScrollY,
//             visible
//           });
          
//           lastScrollY = currentScrollY;
//           dispatch(setSticky(currentScrollY > 100));
//         }, 100);
        
//         window.addEventListener('scroll', handleScroll);
//         return () => window.removeEventListener('scroll', handleScroll);
//       }, []);
//     const pathname = usePathname();

//     const NavigationWrapper = styled('div')({
//         width: '100%',
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         zIndex: 1200,
//     });
      
//     // Top navigation bar wrapper
//     const TopNavWrapper = styled(Box)({
//         width: '100%',
//         backgroundColor: '#fff',
//         position: 'relative',
//         zIndex: 1101,
//     });
      
//     // Second navigation bar wrapper
//     const SecondNavWrapper = styled(Box)(({ theme, isSticky }) => ({
//         width: '100%',
//         backgroundColor: theme.palette.navbarBg || '#fff',
//         position: 'relative',
//         zIndex: 1201,
//         boxShadow: '0px 5px 15px 0px rgba(0, 0, 0, 0.05)',
//         transition: 'transform 0.3s ease',
//         transform: isSticky ? 'translateY(0)' : 'translateY(-100%)',
//     }));
      
//     // Category menu wrapper
//     const CategoryMenuWrapper = styled(Box)(({ theme }) => ({
//         width: '100%',
//         backgroundColor: '#1E1E1E',
//         position: 'relative',
//         zIndex: 1200,
//     }));
      
//     // Determine if we should show the category menu (only on small screens and home page)
//     const shouldShowCategoryMenu = isSmall && (router.pathname === '/' || router.pathname === '/home');
    
//     return (
//         <NavigationWrapper>
//       <AppBarStyle 
//         disableGutters={true}
//         scrolling={scrollState.prevPosition > 50}
//         isSmall={isSmall}
//       >
//         {/* <TopNavWrapper style={{ 
//           transform: !isSmall && !scrollState.visible ? 'translateY(-100%)' : 'translateY(0)',
//           transition: 'transform 0.3s ease'
//         }}>
//           <TopNav />
//         </TopNavWrapper> */}
//          <TopNavWrapper style={{ opacity: 1, visibility: 'visible' }}>
//             <TopNav />
//         </TopNavWrapper>
        
//         {/* Update SecondNavWrapper */}
//         {/* <Box sx={{
//           width: '100%',
//           transform: scrollState.visible ? 'translateY(0)' : 'translateY(-100%)',
//           transition: 'transform 0.3s ease',
//           position: 'relative'
//         }}> */}
//           <SecondNavbar isSticky={isSticky} location={userLocation} />
//         {/* </Box> */}
                            

//                 {/* {shouldShowCategoryMenu && (
//                     <CategoryMenuWrapper>
//                         {categories?.length > 0 && (
//                             <CategoryMenu categories={categories} />
//                         )}
//                     </CategoryMenuWrapper>
//                 )}             */}
//             </AppBarStyle>
//         </NavigationWrapper>
//     )
// }

// export default Navigation


import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useScrollTrigger } from '@mui/material'
import { AppBarStyle } from './Navbar.style'
import { throttle } from 'lodash'
import TopNav from './top-navbar/TopNav'
import dynamic from 'next/dynamic'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@emotion/react'
import { useSelector } from 'react-redux'
import SecondNavbar from './second-navbar/SecondNavbar'
import { setCategoryIsSticky, setSticky } from '@/redux/slices/scrollPosition'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { Box, styled } from '@mui/system'
import { usePathname } from 'next/navigation'

// Dynamically import the CategoryMenu component with loading state
const CategoryMenu = dynamic(() => import('./category-navbar.js'), {
    loading: () => (
        <Box
            sx={{
                width: '100%',
                backgroundColor: '#1E1E1E',
                height: '64px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Box
                sx={{
                    width: '80%',
                    height: '8px',
                    backgroundColor: '#333',
                    borderRadius: '4px',
                    opacity: 0.5,
                    animation: 'pulse 1.5s infinite ease-in-out',
                }}
            />
        </Box>
    ),
    ssr: false,
});

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
    backgroundColor: '#fff',
    position: 'relative',
    zIndex: 1101,
});

// Second navigation bar wrapper
const SecondNavWrapper = styled(Box)(({ theme, isSticky }) => ({
    width: '100%',
    backgroundColor: theme?.palette?.navbarBg || '#fff',
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

const Navigation = () => {
    const { global } = useSelector((state) => state.globalSettings)
    const router = useRouter()
    const dispatch = useDispatch()
    const theme = useTheme()
    const isSmall = useMediaQuery(theme.breakpoints.down('md'))
    const { isSticky } = useSelector((state) => state.scrollPosition)
    const scrolling = useScrollTrigger()
    const [userLocation, setUserLocation] = useState(null)
    const { userLocationUpdate } = useSelector((state) => state.globalSettings)
    const categories = useSelector(state => state.globalSettings.categoriesList);
    const pathname = usePathname();
    const prevScrollY = useRef(0);
    const [scrollState, setScrollState] = useState({
        direction: 'down', // 'up' or 'down'
        prevPosition: 0,
        visible: true
    });

    // Load user location only once or when it updates
    useEffect(() => {
        try {
            const location = localStorage.getItem('location');
            if (location) {
                setUserLocation(JSON.parse(location));
            }
        } catch (error) {
            console.error('Error loading user location:', error);
        }
    }, [userLocationUpdate]);

    // Reset sticky state when changing routes
    useEffect(() => {
        if (router.pathname !== '/home') {
            dispatch(setSticky(false));
        }
        dispatch(setCategoryIsSticky(false));
    }, [router.pathname, dispatch]);

    // Redirect to home if location is available and user is on root path
    useEffect(() => {
        if (userLocation && pathname === '/') {
            router.push('/home');
        }
    }, [userLocation, pathname, router]);

    // Optimized scroll handler using useCallback and requestAnimationFrame
    const handleScroll = useCallback(
        throttle(() => {
            requestAnimationFrame(() => {
                const currentScrollY = window.pageYOffset;
                const direction = currentScrollY > prevScrollY.current ? 'down' : 'up';
                const visible = direction === 'up' || currentScrollY < 50;
                
                setScrollState({
                    direction,
                    prevPosition: prevScrollY.current,
                    visible
                });
                
                prevScrollY.current = currentScrollY;
                dispatch(setSticky(currentScrollY > 100));
            });
        }, 100),
        [dispatch]
    );

    // Add scroll event listener with cleanup
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            handleScroll.cancel(); // Cancel any pending throttled calls
        };
    }, [handleScroll]);

    // Determine if we should show the category menu (only on small screens and home page)
    const shouldShowCategoryMenu = isSmall && (router.pathname === '/' || router.pathname === '/home');
    
    return (
        <NavigationWrapper>
            <AppBarStyle 
                disableGutters={true}
                scrolling={scrollState.prevPosition > 50}
                isSmall={isSmall}
            >
                {/* Use a stable rendering approach for the TopNav */}
                <TopNavWrapper style={{ opacity: 1, visibility: 'visible' }}>
                    <TopNav />
                </TopNavWrapper>
                
                {/* Second Navbar with stable props */}
                <SecondNavbar 
                    isSticky={isSticky} 
                    location={userLocation} 
                />
                
                {/* Only render CategoryMenu when needed */}
                {/* {shouldShowCategoryMenu && categories?.length > 0 && (
                    <CategoryMenuWrapper>
                        <CategoryMenu categories={categories} />
                    </CategoryMenuWrapper>
                )} */}
            </AppBarStyle>
        </NavigationWrapper>
    )
}

export default Navigation