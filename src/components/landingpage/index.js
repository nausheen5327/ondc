import CssBaseline from '@mui/material/CssBaseline'
import { useEffect, useState } from 'react'
import { NoSsr } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import BannerSection from './BannerSection'
import DownloadSection from './DownloadSection'
import FunFactSection from './FunFactSection'
import HeroSection from './HeroSection'
import LinkSection from './link-section/LinkSection'
import { useGetLandingPageData } from '@/hooks/react-query/landing-page/useGetLandingPageData'
import { setLandingPageData } from '@/redux/slices/storedData'
import { setGlobalSettings } from '@/redux/slices/global'
import CookiesConsent from '../CookiesConsent'
import DiscountBanner from './DiscountBanner'
import AvailableZoneSection from '@/components/landingpage/AvailableZoneSection'
import AddressList from '../address/addressList'
import CouponGrid from './Coupon'
import BrandSlider from './BrandSlider'
import Deals from './DealsSection'
import GiftCardSection from './GiftCardSection'

const LandingPage = ({ global, isAuthenticated }) => {
    console.log("LandingPage render:", { 
        hasGlobal: !!global, 
        isAuthenticated 
    })

    const dispatch = useDispatch()
    const [openAddressModal, setOpenAddressModal] = useState(true)
    const { landingPageData } = useSelector((state) => state.storedData)
    const location = useSelector((state) => state.addressData.location)
    
    // Get token from localStorage with safety check
    const [token, setToken] = useState(null)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token')
            console.log("Token from localStorage:", !!storedToken)
            setToken(storedToken)
        }
    }, [])

    // Handle landing page data fetching
    const onSuccessHandler = (res) => {
        console.log("Landing page data fetched successfully")
        dispatch(setLandingPageData(res))
    }

    const { data, refetch, isLoading } = useGetLandingPageData(onSuccessHandler)

    // Initial data fetch
    useEffect(() => {
        console.log("Initiating landing page data fetch")
        refetch()
    }, [token]) // Refetch when token changes

    // Set global settings
    useEffect(() => {
        if (global) {
            console.log("Setting global settings")
            dispatch(setGlobalSettings(global))
        } else {
            console.warn("Global settings object is missing")
        }
    }, [global])

    // Early return if no global settings
    if (!global) {
        console.warn("No global settings available, showing loading state")
        return (
            <NoSsr>
                <CssBaseline />
                <div>Loading...</div>
            </NoSsr>
        )
    }

    const handleModalClose = () => {
        setOpenAddressModal(false)
    }

    console.log("Rendering LandingPage content with data:", {
        hasLandingPageData: !!landingPageData,
        hasLocation: !!location,
        isLoading
    })

    return (
        <NoSsr>
            <CssBaseline />
            {isAuthenticated && !location && (
                <AddressList 
                    openAddressModal={openAddressModal} 
                    setOpenAddressModal={setOpenAddressModal} 
                />
            )}
            {/* <BannerSection
                global={global}
                banner_section_half={landingPageData?.react_promotional_banner}
            />
            <BrandSlider brands={landingPageData?.brands}/>
            <Deals deals={landingPageData?.deals}/>
            <GiftCardSection giftCards={landingPageData?.giftCards}/>
            <CouponGrid coupons={landingPageData?.coupons}/> */}
            
            

            {/* {(landingPageData?.download_app_section?.react_download_apps_play_store?.react_download_apps_play_store_status === '1' ||
              landingPageData?.download_app_section?.react_download_apps_app_store?.react_download_apps_link_status === '1') && (
                <DownloadSection
                    download_app_data={landingPageData?.download_app_section}
                    isLoading={isLoading}
                    global={global}
                    landing_page_links={landingPageData?.landing_page_links}
                    download_app_image_urls={landingPageData?.base_urls?.react_download_apps_image_url}
                />
            )} */}

            {/* <CookiesConsent text={global?.cookies_text} /> */}
        </NoSsr>
    )
}

export default LandingPage