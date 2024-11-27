import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@mui/material'
import { CustomTypography } from '../custom-tables/Tables.style'
import CircularLoader from "../loader/CircularLoader";
import IncrementDecrementManager from './IncrementDecrementManager';

const AddOrderToCart = (props) => {
    const { product, t, addToCard, orderNow, addToCartLoading,isInCart,incrementItem,decrementItem,quantity } = props
    console.log("haii order to cart",isInCart);

    return (
        <>
            <div style={{ display: 'flex', flexDirection: "row", alignItems: 'center', justifyContent: "space-evenly" }}>
                {!isInCart && <Button
                    // disabled={quantity <= 0}
                    onClick={() => addToCard?.()}
                    variant="contained"
                    style={{ width: "90%", marginLeft: '5px', marginRight: '5px' }}
                    sx={{
                        borderRadius: '4px',
                    }}
                >

                    {addToCartLoading ? <CircularLoader size="1.4rem" /> : <CustomTypography
                        sx={{
                            color: (theme) => theme.palette.whiteContainer.main,
                        }}
                    >
                        {t('Add to cart')}
                    </CustomTypography>}

                </Button>}
                {isInCart && <IncrementDecrementManager
                                                        decrementItem={
                                                            decrementItem
                                                        }
                                                        quantity={quantity}
                                                        incrementItem={
                                                            incrementItem
                                                        }
                                                    />}
                <Button
                    onClick={() => orderNow?.()}
                    variant="contained"
                    style={{ width: "90%", marginLeft: '5px', marginRight: '5px' }}
                >
                    {addToCartLoading ? <CircularLoader size="1.4rem" /> : <CustomTypography
                        sx={{
                            color: (theme) => theme.palette.whiteContainer.main,
                        }}
                    >
                        {t('Order Now')}
                    </CustomTypography>}

                </Button>
            </div>
        </>
    )
}
export default AddOrderToCart
