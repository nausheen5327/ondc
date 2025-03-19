import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from "next/router"
import { setGlobalSettings, setIsLoading } from "@/redux/slices/global"
import { setAddressList } from '@/redux/slices/customer'
import { setlocation } from '@/redux/slices/addressData'
import { setCartList } from '@/redux/slices/cart'
import { getCall, getCallTest } from '@/api/MainApi'
import useCancellablePromise from '@/api/cancelRequest'
import Meta from '../components/Meta'
import LandingPage from '../components/landingpage'
import { withAuth } from '@/components/withAuth'
import { setLandingPageData } from '@/redux/slices/storedData'

import { json } from 'react-router-dom'

const Home = ({ configData, landingPageData, searchQuery, isAuthenticated }) => {
  console.log("==== Component Mount ====")
  console.log("Initial props:", { 
      hasConfigData: !!configData, 
      hasLandingPageData: !!landingPageData,
      isAuthenticated 
  })

  const router = useRouter()
  const dispatch = useDispatch()
  const { cancellablePromise } = useCancellablePromise()
  const addressList = useSelector((state) => state.user.addressList)
  
  const [userData, setUserData] = useState(null)
  const [locationData, setLocationData] = useState(null)
  const [cartData, setCartData] = useState(null)
  const [token, setToken] = useState(null)

  // First useEffect - initialization
  useEffect(() => {
      
      const currentToken = localStorage.getItem('token')
      setToken(currentToken)

      const storedLocation = localStorage.getItem('location')
      const storedUser = localStorage.getItem('user')

      const storedCartItems = localStorage.getItem('cartItemsPreAuth')
      
      
      if(storedCartItems){
        const parsedCartItems = JSON.parse(storedCartItems)
        setCartData(parsedCartItems)
      }
      if (storedLocation) {
          const parsedLocation = (storedLocation)
          setLocationData(parsedLocation)
      }
      
      if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setUserData(parsedUser)
      }

      // Set global settings immediately
      if (configData) {
          console.log("Setting global settings with configData")
          dispatch(setGlobalSettings(configData))
      } else {
          console.warn("No configData available for global settings")
      }
      if(landingPageData)
      {
        dispatch(setLandingPageData(landingPageData));
      }
  }, [])
  const fetchDeliveryAddress = async () => {
    console.log("Fetching delivery address")
    dispatch(setIsLoading(true))
    try {
        const data = await cancellablePromise(
            getCall("/clientApis/v1/delivery_address")
        )
        console.log("Delivery address data:", data)
        
        if (locationData) {
            const findIndex = data.findIndex((item) => item.id === locationData.id)
            if (findIndex !== -1) {
                dispatch(setlocation(locationData))
                localStorage.setItem('location', JSON.stringify(data[findIndex]))
                router.replace('/home')

            }
        }
        
        dispatch(setAddressList(data))
    } catch (err) {
        console.error('Error fetching delivery address:', err)
    } finally {
        dispatch(setIsLoading(false))
    }
}

const getCartItems = async () => {
    console.log("Getting cart items, userData:", userData)
    if (!userData?.localId) {
        console.log("No user ID found, checking localStorage")
        const storedUser = localStorage.getItem('user')
        if (!storedUser) {
            console.log("No user found in localStorage")
            return
        }
        const parsedUser = JSON.parse(storedUser)
        if (!parsedUser.localId) {
            console.log("No localId in stored user data")
            return
        }
        console.log("Found user ID in localStorage:", parsedUser.localId)
    }
    
    dispatch(setIsLoading(true))
    try {
        const userForCart = userData || JSON.parse(localStorage.getItem('user'))
        const url = `/clientApis/v2/cart/${userForCart._id}`
        console.log("Fetching cart from URL:", url)
        const res = await getCall(url)
        console.log("Cart response:", res)
        dispatch(setCartList(res))
    } catch (error) {
        console.error("Error fetching cart items:", error)
    } finally {
        dispatch(setIsLoading(false))
    }
}
  // Token-dependent operations
  useEffect(() => {
      if (token) {
          console.log("Authenticated state - fetching user data")
          fetchDeliveryAddress()
          getCartItems()
      } else if (!token) {
          console.log("Unauthenticated with location - redirecting")
          if(cartData)dispatch(setCartList(cartData))
         if(locationData){ 
          dispatch(setlocation(locationData))
          router.replace('/home')
        }
      }
  }, [])

 

  if (!configData) {
      console.warn("Rendering fallback - configData missing")
      return (
          <div className="p-4">
              <Meta title="ONDC" />
              <div>Loading...</div>
          </div>
      )
  }

  return (
      <>
          <Meta
              title={"ONDC"}
              ogImage={process.env.NEXT_PUBLIC_LOGO}
          />
          <LandingPage
              global={configData}
              landingPageData={landingPageData}
              isAuthenticated={isAuthenticated}
          />
      </>
  )
}

export default Home
// pages/index.js
// export async function getServerSideProps(context) {
//     const { query } = context
  
//     // Your existing data fetching logic
//     let configData = {
//       business_name: "ONDC",
//       // ... other config data
//     }
  
//     let landingPageData = {
//       banner_section_full: { 
//         banner_section_img_full: "https://source.unsplash.com/random/400x300" 
//       }
//     }
  
//     // If there's a search query, fetch search results
//     let searchResults = null
//     if (query.query) {
//       try {
//         // Add your search API call here
//         // searchResults = await fetchSearchResults(query.query)
//       } catch (error) {
//         console.error('Search error:', error)
//       }
//     }
  
//     return {
//       props: {
//         configData,
//         landingPageData,
//         searchResults,
//         searchQuery: query.query || null
//       }
//     }
//   }


export async function getServerSideProps(context) {
  const { query, req } = context
  
  try {
      // Get the auth token from cookies
      const token = req.cookies.token || ''
      
      // Fetch real config data
      let configData
      try {
          configData = await getCall('/clientApis/v1/config')  // Adjust endpoint as per your API
      } catch (error) {
          console.error('Error fetching config:', error)
          configData = {
              business_name: "ONDC",
              // Add other fallback config data
          }
      }

      // Fetch landing page data
      let landingPageData={
        banner_section_full: { 
            banner_section_img_full: "https://source.unsplash.com/random/400x300" 
        }
      }
    //   try {
    //       landingPageData['react_promotional_banner'] = await getCallTest('/nodeStrapi/strapi/offers')  // Adjust endpoint as per your API
    //   } catch (error) {
    //       console.error('Error fetching landing page data:', error)
    //   }


    //   try {
    //     landingPageData['deals'] = await getCallTest('/nodeStrapi/strapi/coupons')  // Adjust endpoint as per your API
    // } catch (error) {
    //     console.error('Error fetching landing page data:', error)
    // }

    // try {
    //     landingPageData['giftCards'] = await getCallTest('/nodeStrapi/strapi/gift-cards')  // Adjust endpoint as per your API
    // } catch (error) {
    //     console.error('Error fetching landing page data:', error)
    // }

    // try {
    //     landingPageData['coupons'] = await getCallTest('/nodeStrapi/strapi/site-coupons')  // Adjust endpoint as per your API
    // } catch (error) {
    //     console.error('Error fetching landing page data:', error)
    // }


    // try {
    //     landingPageData['brands'] = await getCallTest('/nodeStrapi/strapi/brands')  // Adjust endpoint as per your API
    // } catch (error) {
    //     console.error('Error fetching landing page data:', error)
    // }

      // Handle search query if present
      let searchResults = null
      if (query.query) {
          try {
              searchResults = await getCall(`/clientApis/v1/search?q=${query.query}`)  // Adjust endpoint as per your API
          } catch (error) {
              console.error('Search error:', error)
          }
      }

      return {
          props: {
              configData,
              landingPageData,
              searchResults,
              searchQuery: query.query || null,
              isAuthenticated: !!token  // Pass authentication status to component
          }
      }
  } catch (error) {
      console.error('getServerSideProps error:', error)
      // Return default props in case of error
      return {
          props: {
              configData: {
                  business_name: "ONDC",
                  // Add other necessary default config
              },
              landingPageData: {
                  banner_section_full: { 
                      banner_section_img_full: "https://source.unsplash.com/random/400x300" 
                  }
              },
              searchResults: null,
              searchQuery: null,
              isAuthenticated: false
          }
      }
  }
}