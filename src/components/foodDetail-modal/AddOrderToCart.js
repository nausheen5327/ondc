import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@mui/material'
import { CustomTypography } from '../custom-tables/Tables.style'
import CircularLoader from "../loader/CircularLoader";

const AddOrderToCart = (props) => {
    const { product, t, addToCard, orderNow,addToCartLoading,getFullFillRequirements } = props
    return (
        <>
            
                                                
               <div style={{display:'flex', flexDirection:"row", alignItems:'center', justifyContent:"space-evenly"}}>                             
                <Button
                    // disabled={quantity <= 0}
                    onClick={() => addToCard?.()}
                    variant="contained"
                    style={{width:"90%",marginLeft:'5px',marginRight:'5px'}}
                    sx={{
                        borderRadius: '4px',
                    }}
                >

                    {addToCartLoading ? <CircularLoader size="1.4rem"/>: <CustomTypography
                      sx={{
                          color: (theme) => theme.palette.whiteContainer.main,
                      }}
                    >
                        {t('Add to cart')}
                    </CustomTypography>}

                </Button>
                <Button
                disabled={!getFullFillRequirements()}
               onClick={() => orderNow?.()}
               variant="contained"
               style={{width:"90%",marginLeft:'5px',marginRight:'5px'}}
               >
               {addToCartLoading ? <CircularLoader size="1.4rem"/>: <CustomTypography
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
