import React from 'react'
import PropTypes from 'prop-types'
import NotAvailableCard from './NotAvailableCard'
import { Button, Stack } from '@mui/material'
import { CustomTypography } from '../custom-tables/Tables.style'
import { isAvailable } from "@/utils/customFunctions"


const AddUpdateOrderToCart = (props) => {
    const { isUpdateDisabled,modalData, isInCart, addToCard, t, product, orderNow,addToCartLoading,getFullFillRequirements } = props
    console.log("props...",modalData)
    return (
        <Stack spacing={1}>
            <NotAvailableCard
                endTime={
                    modalData.length > 0 && modalData[0].location_details?.range?.end
                }
                endDate={ modalData.length > 0 &&modalData[0].location_details?.range?.end}
                startTime={
                    modalData.length > 0 && modalData[0].location_details?.range?.start
                }
            />
            {modalData.length > 0 && modalData[0].schedule_order && (
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
                            {!product?.available_date_starts ? (
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
                            ) : (
                                <Button
                                    disabled={
                                        !isAvailable(
                                            modalData[0].available_time_starts,
                                            modalData[0].available_time_ends
                                        )|| !getFullFillRequirements()
                                    }
                                    onClick={() => orderNow()}
                                    variant="contained"
                                    fullWidth
                                >
                                    {t('Order Now')}
                                </Button>
                            )}
                        </>
                    )}
                </>
            )}
        </Stack>
    )
}

AddUpdateOrderToCart.propTypes = {}

export default AddUpdateOrderToCart
