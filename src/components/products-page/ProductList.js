import React from 'react'
import { Box, Grid } from '@mui/material'
import FoodCard from '../food-card/FoodCard'
import { useSelector } from 'react-redux'
import CustomePagination from '../pagination/Pagination'
import useMediaQuery from '@mui/material/useMediaQuery'
export default function ProductList({
    product_list,
    page_limit = 10,
    offset,
    setOffset,
}) {
    const { global } = useSelector((state) => state.globalSettings)
    const matchesToMd = useMediaQuery('(max-width:1200px)')
    const matches = useMediaQuery('(max-width:400px)')
    console.log("product list",product_list)
    return (
        <>
            
                <>
                    {product_list?.map((product) => {
                            return (
                                <Grid
                                    key={product?.id}
                                    item
                                    xs={12}  // Takes full width on mobile
                                    sm={6}   // Two cards per row on tablet
                                    md={2} 

                                >
                                    <FoodCard
                                        product={product}
                                        isRestaurantDetails={true}
                                        productImageUrl={
                                            product?.item_details?.descriptor?.images?.length ? product?.item_details?.descriptor?.images[0] : ''
                                        }
                                    />
                                </Grid>
                            )
                        
                    })}
                </>
            

            {product_list?.total_size > page_limit ? (
                <Grid item xs={12} sm={12} md={12} align="center">
                    <CustomePagination
                        total_size={product_list?.total_size}
                        page_limit={page_limit}
                        offset={offset}
                        setOffset={setOffset}
                    />
                </Grid>
            ) : (
                ''
            )}
        </>
    )
}
