import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { CustomStackFullWidth } from "@/styled-components/CustomStyles.style"
import SearchFilterWithResults from './SearchFilterWithResults'
import Meta from '../Meta'
import useCancellablePromise from '@/api/cancelRequest'
import { getAllProductRequest } from '@/api/productApi'
import { CustomToaster } from '../custom-toaster/CustomToaster'
import { removeSpecialCharacters } from '@/utils/customFunctions'
import { trackSearchEvent } from '@/utils/analytics'

const ProductSearchPage = ({
    query,
    page,
    restaurantType,
    tags
}) => {
    const router = useRouter()
    const [page_limit] = useState(10)
    const [offset, setOffset] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [foodOrRestaurant, setFoodOrRestaurant] = useState('products')
    const [pageData, setPageData] = useState({})
    const [products, setProducts] = useState([])
    const [totalProductCount, setTotalProductCount] = useState(0)
    const [cachedPages, setCachedPages] = useState({})
    const { global } = useSelector((state) => state.globalSettings)
    const { searchTagData } = useSelector((state) => state.searchTags)
    const { location, formatted_address, zoneId } = useSelector((state) => state.addressData)
    // Track current location to detect changes
    const [currentLocation, setCurrentLocation] = useState(null)

    const [paginationModel, setPaginationModel] = useState({
        page: 1,
        pageSize: 10,
        searchData: [],
    })

    const { cancellablePromise } = useCancellablePromise()

    const getAllProducts = async (searchName, currentOffset) => {
        // Check if data is already cached
        const cacheKey = `${currentOffset}-${JSON.stringify(location)}`
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

            trackSearchEvent(searchName, data.count);

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
            CustomToaster('error', 'Unable to fetch products, Please check your connection!')
        }
    }

    useEffect(() => {
        if (query) {
            setSearchValue(removeSpecialCharacters(query))
        } else if (page) {
            setSearchValue(removeSpecialCharacters(page))
        } else if (tags) {
            setSearchValue(null)
        } else {
            router.push('/home')
        }
    }, [query, tags])

    // Reset pagination and cache when location changes
    useEffect(() => {
        if (location && JSON.stringify(currentLocation) !== JSON.stringify(location)) {
            setOffset(1)
            setPaginationModel(prev => ({ ...prev, page: 1 }))
            setProducts([])
            setCachedPages({})
            setCurrentLocation(location)
        }
    }, [location])

    useEffect(() => {
        if (searchValue) {
            setPaginationModel(prev => ({ ...prev, page: offset }))
            getAllProducts(searchValue, offset)
        }
    }, [offset, searchValue, location])

    return (
        <>
            <Meta
                title={`${searchValue ? searchValue : 'Searching...'} on ONDC`}
            />
            <CustomStackFullWidth mb="5rem" sx={{ minHeight: '70vh' }}>
                {pageData && (
                    <SearchFilterWithResults
                        filterData={pageData}
                        searchValue={searchValue}
                        foodOrRestaurant={foodOrRestaurant}
                        setFoodOrRestaurant={setFoodOrRestaurant}
                        data={pageData}
                        page_limit={page_limit}
                        offset={offset}
                        setOffset={setOffset}
                        global={global}
                        page={page === 'most-reviewed' ? 'most_reviewed' : page}
                        totalData={totalProductCount}
                    />
                )}
            </CustomStackFullWidth>
        </>
    )
}

export default ProductSearchPage