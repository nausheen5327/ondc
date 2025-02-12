import { Grid, IconButton, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import { ArrowButton, IconButtonGrid, WishlistBox } from './WishList.style'
import dynamic from 'next/dynamic'
const FoodDetailModal = dynamic(() =>
    import('../foodDetail-modal/FoodDetailModal')
)
import { useDispatch, useSelector } from 'react-redux'
import {
    CustomFavICon,
    RatingStarIcon,
    RatingWrapTypography,
} from '../food-card/FoodCard.style'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import CustomImageContainer from '../CustomImageContainer'
import { t } from 'i18next'
import { RTL } from '../RTL/RTL'
import { useMutation } from 'react-query'
import { ProductsApi } from '@/hooks/react-query/config/productsApi'
import { addWishList, removeWishListFood } from '@/redux/slices/wishList'
import { toast } from 'react-hot-toast'
// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
// import FavoriteIcon from '@mui/icons-material/Favorite'
import { useWishListDelete } from '@/hooks/react-query/config/wish-list/useWishListDelete'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import CustomPopover from '../custom-popover/CustomPopover'
import WishlistDeleteItem from './WishlistDeleteItem'
import WishListImage from '../../assets/images/WishListImage'

const WishlistCard = ({ product, productImageUrl, recommenedproducts }) => {
    const { wishLists } = useSelector((state) => state.wishList)
    const theme = useTheme()
    const dispatch = useDispatch()
    const color1 = theme.palette.error.main
    const isXSmall = useMediaQuery(theme.breakpoints.down('sm'))
    const [openModal, setOpenModal] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const { token } = useSelector((state) => state.userToken)
    const { global } = useSelector((state) => state.globalSettings)
    let currencySymbol
    let currencySymbolDirection
    let digitAfterDecimalPoint

    if (global) {
        currencySymbol = global.currency_symbol
        currencySymbolDirection = global.currency_symbol_direction
        digitAfterDecimalPoint = global.digit_after_decimal_point
    }
    const {
        name,
        image_full_url,
        restaurant_name,
        avg_rating,
        price,
        discount,
        discount_type,
        restaurant_discount,
    } = product

    const imageUrl = image_full_url
    const discountPrice = price - discount
    const handleFoodDetailModal = () => setOpenModal(true)
    const handleModalClose = () => {
        setOpenModal(false)
    }
    const onSuccessHandlerForDelete = (res) => {
        dispatch(removeWishListFood(product.id))
        toast.success(res.message, {
            id: 'wishlist',
        })
    }
    const { mutate } = useWishListDelete()
    const deleteWishlistItem = (id) => {
        mutate(id, {
            onSuccess: onSuccessHandlerForDelete,
            onError: (error) => {
                toast.error(error.response.data.message)
            },
        })
    }

    const handleClick = () => {
        deleteWishlistItem(product?.id)
    }
    const [languageDirection, setLanguageDirection] = React.useState('ltr')
    useEffect(() => {
        if (localStorage.getItem('direction')) {
            setLanguageDirection(localStorage.getItem('direction'))
        }
    }, [])
    const {
        mutate: addFavoriteMutation,
        isLoading,
        error,
        data,
    } = useMutation(
        'add-favourite',
        () => ProductsApi.addFavorite(product.id),
        {
            onSuccess: (response) => {
                if (response?.data) {
                    dispatch(addWishList(product))
                    toast.success(response.data.message)
                }
            },
            onError: (error) => {
                toast.error(error.response.data.message)
            },
        }
    )

    const addToFavorite = () => {
        if (token) {
            addFavoriteMutation()
            // notify(data.message)
        } else toast.error(t('You are not logged in'))
    }
    const isInList = (id) => {
        return !!wishLists?.food?.find((wishFood) => wishFood.id === id)
    }
    const handleClickDelete = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = (event) => {
        setAnchorEl(null)
    }
    return (
        <>
            <WishlistBox sx={{ cursor: 'pointer' }}>
                <Grid container md={12} xs={12} spacing={{ xs: 1 }}>
                    <Grid item md={4} sm={4} xs={4}>
                        <Stack
                            onClick={handleFoodDetailModal}
                            sx={{ cursor: 'pointer' }}
                        >
                            <CustomImageContainer
                                src={imageUrl}
                                alt={name}
                                maxWidth="120px"
                                smMaxWidth="80px"
                                height="120px"
                                smHeight="80px"
                                objectFit="cover"
                                borderRadius=".7rem"
                                smWidth="80px"
                                mdHeight="87px"
                            />
                            {recommenedproducts === 'true' &&
                                discountChipHandler(
                                    restaurant_discount,
                                    languageDirection,
                                    discount,
                                    discount_type,
                                    currencySymbolDirection,
                                    currencySymbol,
                                    digitAfterDecimalPoint
                                )}
                        </Stack>

                        {/*<img src={imageUrl} alt={name} className="PopularRes_img"  />*/}
                    </Grid>
                    <Grid item md={7} sm={6} xs={6}>
                        <Stack padding=".6rem" onClick={handleFoodDetailModal}>
                            <Typography
                                variant={isXSmall ? 'h6' : 'h5'}
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: '1',
                                    WebkitBoxOrient: 'vertical',
                                }}
                            >
                                {name}
                            </Typography>
                            <Typography variant="h6">
                                {restaurant_name}
                            </Typography>
                            <RatingWrapTypography variant="subtitle2">
                                {avg_rating?.toFixed(1) ||
                                    avg_rating?.toFixed(1)}
                                <RatingStarIcon
                                    fontSize="small"
                                    sx={{
                                        ml: '3px',
                                        color: (theme) =>
                                            theme.palette.primary.main,
                                    }}
                                />
                            </RatingWrapTypography>
                            <Typography>
                                <span
                                    style={{
                                        color: color1,
                                        fontSize: '13px',
                                        textDecoration: 'line-through',
                                    }}
                                >
                                    {discount > 0 &&
                                        getAmount(
                                            price,
                                            currencySymbolDirection,
                                            currencySymbol,
                                            digitAfterDecimalPoint
                                        )}
                                </span>
                                <span
                                    style={{
                                        fontSize: '15px',
                                        marginInlineStart: '3px',
                                    }}
                                >
                                    {discountPrice &&
                                        getAmount(
                                            discountPrice,
                                            currencySymbolDirection,
                                            currencySymbol,
                                            digitAfterDecimalPoint
                                        )}
                                </span>
                            </Typography>
                        </Stack>
                    </Grid>
                    <IconButtonGrid item md={1} xs={2}>
                        <Stack
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            {recommenedproducts === 'true' ? (
                                <>
                                    {!isInList(product?.id) && (
                                        <IconButton onClick={addToFavorite}>
                                            {/* <FavoriteBorderIcon color="primary" /> */}
                                        </IconButton>
                                    )}
                                    {isInList(product?.id) && (
                                        <IconButton
                                            onClick={() =>
                                                deleteWishlistItem(product.id)
                                            }
                                        >
                                            {/* <FavoriteIcon color="primary" /> */}
                                        </IconButton>
                                    )}
                                </>
                            ) : (
                                <IconButton onClick={handleClickDelete}>
                                    <DeleteIcon
                                        sx={{
                                            color: (theme) =>
                                                theme.palette.error.main,
                                        }}
                                    />
                                </IconButton>
                            )}

                            <Stack>
                                {languageDirection && (
                                    <IconButton onClick={handleFoodDetailModal}>
                                        <ShoppingBagOutlinedIcon color="primary" />
                                    </IconButton>
                                    // <ArrowButton
                                    //     size="small"
                                    //     onClick={handleFoodDetailModal}
                                    //     languageDirection={languageDirection}
                                    // >
                                    //     {languageDirection === 'rtl' ? (
                                    //         <ArrowBackIcon fontSize="small" />
                                    //     ) : (
                                    //         <ArrowForwardIcon fontSize="small" />
                                    //     )}
                                    // </ArrowButton>
                                )}
                            </Stack>
                        </Stack>
                    </IconButtonGrid>
                </Grid>
            </WishlistBox>

            {openModal && languageDirection && (
                <RTL direction={languageDirection}>
                    <FoodDetailModal
                        product={product}
                        image={imageUrl}
                        open={openModal}
                        setOpen={setOpenModal}
                        handleModalClose={handleModalClose}
                        currencySymbolDirection={currencySymbolDirection}
                        currencySymbol={currencySymbol}
                        digitAfterDecimalPoint={digitAfterDecimalPoint}
                        handleBadge={handleBadge}
                    />
                </RTL>
            )}
            <CustomPopover
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                maxWidth="421px"
                padding="20px 35px 25px"
            >
                <WishlistDeleteItem
                    icon={<WishListImage />}
                    deleteItem={handleClick}
                    handleClose={handleClose}
                    confirmButtonText="Yes , Remove"
                    cancelButtonText="Cancel"
                    title="Remove this food"
                    subTitle="Want to remove this food your favourite list ?"
                />
            </CustomPopover>
        </>
    )
}

export default WishlistCard
