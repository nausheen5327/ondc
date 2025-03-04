import { CampaignApi } from '@/hooks/react-query/config/campaignApi'
import {
    MostReviewedApi,
    PopularFoodNearbyApi,
} from '@/hooks/react-query/config/productsApi'
import { useWishListGet } from '@/hooks/react-query/config/wish-list/useWishListGet'
import {
    setFilterbyByDispatch,
    setFoodOrRestaurant,
} from '@/redux/slices/searchFilter'
import {
    setSearchTagData,
    setSelectedName,
    setSelectedValue,
} from '@/redux/slices/searchTagSlice'
import {
    setBanners,
    setBestReviewedFood,
    setCampaignFoods,
    setPopularFood,
} from '@/redux/slices/storedData'
import { setWelcomeModal } from '@/redux/slices/utils'
import { setWishList } from '@/redux/slices/wishList'
import { CustomStackFullWidth } from '@/styled-components/CustomStyles.style'
import { Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Box } from '@mui/system'
import { t } from 'i18next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { onSingleErrorResponse } from '../ErrorResponse'
import PushNotificationLayout from '../PushNotificationLayout'
import CashBackPopup from '../cash-back-popup/CashBackPopup'
import CustomContainer from '../container'
import CustomModal from '../custom-modal/CustomModal'
import ProductSearchPage from '../products-page/ProductSearchPage'
import Banner from './Banner'
import DifferentFoodCompontent from './DefferntFoodCompontent'
import NewRestaurant from './NewRestaurant'
import PromotionalBanner from './PromotionalBanner'
import Restaurant from './Restaurant'
import SearchFilterTag from './Search-filter-tag/SearchFilterTag'
import Cuisines from './cuisines'
import FeatureCatagories from './featured-categories/FeatureCatagories'
import VisitAgain from './visit-again'
import AddsSection from '@/components/home/add-section'

const Homes = () => {
    
    const { global } = useSelector((state) => state.globalSettings)
    const { filterData, foodOrRestaurant } = useSelector(
        (state) => state.searchFilterStore
    )
    const [sort_by, setSort_by] = useState('')
    const { searchTagData } = useSelector((state) => state.searchTags)
    const router = useRouter()
    const { query, page, restaurantType, tags } = router.query
    const dispatch = useDispatch()
    const theme = useTheme()
    const isSmall = useMediaQuery(theme.breakpoints.down('md'))
    const location = useSelector(state => state.addressData.location)
    useEffect(() => {
        const activeFilters = searchTagData.filter(
            (item) => item.isActive === true
        )
        if (activeFilters?.length > 0) {
            if (router.asPath === '/home') {
                const newArr = searchTagData.map((item) => ({
                    ...item,
                    isActive: false,
                }))
                dispatch(setSearchTagData(newArr))
                dispatch(setFoodOrRestaurant('products'))
                dispatch(setSelectedValue(''))
                dispatch(setSelectedName(''))
                setSort_by('')
            }
        }
        dispatch(setFilterbyByDispatch(activeFilters))
    }, [tags, page, restaurantType, query])

   
    return (
        <>
             <PushNotificationLayout>
                {query &&<CustomContainer>
                    <CustomStackFullWidth
                        sx={{
                            marginTop: { xs: '60px', md: '130px' },
                            marginBottom: '10px',
                        }}
                    >
                        <Typography
                            fontSize={{ xs: '16px', md: '20px' }}
                            fontWeight={{
                                xs: '500',
                                md: '700',
                            }}
                            color={theme.palette.neutral[1000]}
                        >
                            {t('Find Best Restaurants and Foods')}
                        </Typography>
                    </CustomStackFullWidth>
                </CustomContainer>}
                {query && <SearchFilterTag
                    sort_by={sort_by}
                    setSort_by={setSort_by}
                    tags={tags}
                    query={query}
                    page={page}
                />}
                {query || page || restaurantType || tags ? (
                    <CustomContainer>
                        <ProductSearchPage
                            tags={tags}
                            query={query}
                            page={page}
                            restaurantType={restaurantType}
                        />
                    </CustomContainer>
                ) : (
                    <>
                        <Box>
                            <FeatureCatagories height="70px" />
                            {/* <CustomContainer>
                                <VisitAgain />
                                <AddsSection />
                            </CustomContainer> */}
                        </Box>
                        <CustomContainer>
                            <DifferentFoodCompontent
                                isLoading={false}
                                isLoadingNearByPopularRestaurantData={
                                    false
                                }
                            />
                            {global && <Cuisines />}

                            {global?.banner_data?.promotional_banner_image && (
                                <PromotionalBanner global={global} />
                            )}

                        </CustomContainer>
                    </>
                )}
            </PushNotificationLayout>

        </>
    )
}

export default Homes
