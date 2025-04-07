import React, { useEffect, useState } from 'react'
import Meta from '../../../components/Meta.js'
import CategoryDetailsPage from '../../../components/category/CategoryDetailsPage'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { CategoryApi } from "@/hooks/react-query/config/categoryApi"
import {
    CustomPaperBigCard,
    CustomStackFullWidth,
} from "@/styled-components/CustomStyles.style"
import { Container } from '@mui/material'
import CustomContainer from '../../../components/container'
import HomeGuard from "../../../components/home-guard/HomeGuard";
import { getAllProductRequest } from '@/api/productApi.js'
import useCancellablePromise from '@/api/cancelRequest.js'
import { useSelector } from 'react-redux'
import { CustomToaster } from '@/components/custom-toaster/CustomToaster.jsx'
import SearchFilterWithResults from '@/components/products-page/SearchFilterWithResults.js'

const index = () => {
    const [type, setType] = useState('all')
    const [offset, setOffset] = useState(1)
    const [page_limit, setPageLimit] = useState(10)
    const [filterByData, setFilterByData] = useState({})
    const router = useRouter()
    const { id, name } = router.query
    const [pageData, setPageData] = useState({})
    const [category_id, setCategoryId] = useState(id)
    const [foodOrRestaurant, setFoodOrRestaurant] = useState('products')
    const [products, setProducts] = useState([])
    const [totalProductCount, setTotalProductCount] = useState(0)
    const [cachedPages, setCachedPages] = useState({})
    const { global } = useSelector((state) => state.globalSettings)
    const { location } = useSelector((state) => state.addressData)
    
    // Track current location to detect changes
    const [currentLocation, setCurrentLocation] = useState(null)

    const [paginationModel, setPaginationModel] = useState({
        page: 1,
        pageSize: 10,
        searchData: [],
    })

    const { cancellablePromise } = useCancellablePromise()

    useEffect(() => {
        type && setOffset(1)
    }, [type])

    const getAllProducts = async (searchName, currentOffset) => {
        // Create location-aware cache key
        const cacheKey = `${currentOffset}-${JSON.stringify(location)}-${searchName}`
        
        // Check if data is already cached
        if (cachedPages[cacheKey]) {
            setPageData(cachedPages[cacheKey])
            return
        }

        try {
            const paginationData = {
                ...paginationModel,
                page: currentOffset,
                searchData: {
                    ...paginationModel.searchData.reduce((r, e) => ({
                        ...r,
                        [e.code]: e.selectedValues.join()
                    }), {}),
                    pageNumber: currentOffset,
                    limit: paginationModel.pageSize,
                    name: searchName
                }
            }

            const data = await cancellablePromise(
                getAllProductRequest(paginationData.searchData)
            )

            // Cache the results with location-aware key
            setCachedPages(prev => ({
                ...prev,
                [cacheKey]: data.data
            }))

            // Replace products instead of appending when location changes
            if (JSON.stringify(currentLocation) !== JSON.stringify(location)) {
                setProducts(data.data)
            } else {
                setProducts(prevProducts => [...prevProducts, ...data.data])
            }
            
            setTotalProductCount(data.count)
            setPageData(data.data)
        } catch (err) {
            CustomToaster('error', err)
        }
    }

    // Reset pagination and data when location changes
    useEffect(() => {
        if (location && JSON.stringify(currentLocation) !== JSON.stringify(location)) {
            setOffset(1)
            setPaginationModel(prev => ({ ...prev, page: 1 }))
            setProducts([])
            // Don't clear the cache completely, just let the new location data be cached separately
            setCurrentLocation(location)
            
            // Reload data with the new location if name is available
            if (name) {
                getAllProducts(name, 1)
            }
        }
    }, [location])

    useEffect(() => {
        if (name) {
            setPaginationModel(prev => ({ ...prev, page: offset }))
            getAllProducts(name, offset)
        }
    }, [offset, name])
    
    return (
        <HomeGuard>
        <CustomContainer>
            <CustomStackFullWidth
                sx={{ paddingBottom: '1rem', paddingTop: {xs:"2rem",md:"4.5rem" }}}
            >
                <Meta title={name} keyword="" description="" />
                {pageData && (
                    <SearchFilterWithResults
                        filterData={pageData}
                        searchValue={name}
                        foodOrRestaurant={foodOrRestaurant}
                        setFoodOrRestaurant={setFoodOrRestaurant}
                        data={pageData}
                        page_limit={page_limit}
                        offset={offset}
                        setOffset={setOffset}
                        global={global}
                        page={'item'}
                        totalData={totalProductCount}
                    />
                )}
            </CustomStackFullWidth>
        </CustomContainer>
        </HomeGuard>
    )
}

export default index