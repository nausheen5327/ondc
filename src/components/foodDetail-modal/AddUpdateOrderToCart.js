import React from 'react'
import PropTypes from 'prop-types'
import NotAvailableCard from './NotAvailableCard'
import { Button, Stack } from '@mui/material'
import { CustomTypography } from '../custom-tables/Tables.style'
import { isAvailable } from "@/utils/customFunctions"


const AddUpdateOrderToCart = (props) => {
    const { isUpdateDisabled,modalData, isInCart, addToCard, t, product, orderNow,addToCartLoading,getFullFillRequirements } = props
    console.log("haii order update...",modalData)
    return (
        <Stack spacing={1}>
                <>
                    {isInCart(product?.id) && (
                        <Button
                             disabled={!isUpdateDisabled()}
                            onClick={() => addToCard()}
                            variant="contained"
                            fullWidth
                        >
                            {t('Update to cart')}
                        </Button>
                    )}
                    {!isInCart(product?.id) && (
                        <>
                            
                                <Button
                                    // disabled={quantity <= 0}
                                    onClick={() => addToCard()}
                                    variant="contained"
                                    fullWidth
                                >
                                    <CustomTypography
                                        variant="h5"
                                        sx={{
                                            color: (theme) =>
                                                theme.palette.whiteContainer
                                                    .main,
                                        }}
                                    >
                                        {t('Add to cart')}
                                    </CustomTypography>
                                </Button>
                            
                        </>
                    )}
                </>
            
        </Stack>
    )
}

AddUpdateOrderToCart.propTypes = {}

export default AddUpdateOrderToCart
