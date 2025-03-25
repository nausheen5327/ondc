import {
    setFilterbyByDispatch,
    setFoodOrRestaurant,
} from '@/redux/slices/searchFilter'
import {
    setSearchTagData,
    setSelectedName,
    setSelectedValue,
} from '@/redux/slices/searchTagSlice'
import { CustomStackFullWidth } from '@/styled-components/CustomStyles.style'
import { Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Box } from '@mui/system'
import { t } from 'i18next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PushNotificationLayout from '../PushNotificationLayout'
import CustomContainer from '../container'
import ProductSearchPage from '../products-page/ProductSearchPage'
import DifferentFoodCompontent from './DefferntFoodCompontent'
import PromotionalBanner from './PromotionalBanner'
import SearchFilterTag from './Search-filter-tag/SearchFilterTag'
import Cuisines from './cuisines'
import FeatureCatagories from './featured-categories/FeatureCatagories'
import Link from 'next/link'


const Homes = () => {
    
    const { global } = useSelector((state) => state.globalSettings)
    const { filterData, foodOrRestaurant } = useSelector(
        (state) => state.searchFilterStore
    )
    let comingSoonImageUrl = 'https://res.cloudinary.com/dbctmcyg0/image/upload/v1741774448/comingSoon_b42usi.jpg'
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
             {(router.query?.category==='Food' || !router.query.category) ?<PushNotificationLayout>
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
            </PushNotificationLayout>:
             <Box
             sx={{
                 display: 'flex',
                 justifyContent: 'center',
                 alignItems: 'start',
                 minHeight: 'auto',
                 width: '100%',
                 backgroundColor: theme.palette.background.default
             }}
         >
             <Box
                 sx={{
                     width: { xs: '100%', sm: '100%', md: '70%' },
                     maxWidth: '1000px',
                     height: 'auto',
                     borderRadius: '8px',
                     overflow: 'hidden',
                    //  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
                 }}
             >
                 <img 
                     src={comingSoonImageUrl} 
                     alt="Coming Soon" 
                     style={{ 
                         width: '100%', 
                         height: 'auto', 
                         objectFit: 'contain'
                     }} 
                 />
                 <Link style={{
                    cursor:'pointer'
                 }} href='/home'><p style={{textAlign:'center', color:'#ff7818b3'}}>Explore Food</p></Link>
             </Box>
         </Box>
            }

        </>
    )
}

export default Homes
