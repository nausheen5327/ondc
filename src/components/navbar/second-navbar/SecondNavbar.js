import { setOfflineWithPartials } from '@/redux/slices/OfflinePayment'
import { SignInButton } from '@/styled-components/CustomButtons.style'
import { CustomStackFullWidth } from '@/styled-components/CustomStyles.style'
import ChatIcon from '@mui/icons-material/Chat'
import LockIcon from '@mui/icons-material/Lock'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { Avatar, Badge, Box, ButtonBase, NoSsr, Stack } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled } from '@mui/system'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import useClickOutside from '../../../utils/use-click-outside'
import { RTL } from '../../RTL/RTL'
import AuthModal from '../../auth'
import CustomContainer from '../../container'
import { CustomTypography } from '../../custom-tables/Tables.style'
import SearchBox from '../../home/hero-section-with-search/SearchBox'
import { AccountPopover } from '../AccountPopover'
import CustomDrawerWishlist from '../CustomDrawerWishlist'
import { CustomNavSearchIcon, LefRightBorderBox } from '../Navbar.style'
import ThemeSwitches from '../top-navbar/ThemeSwitches'
import AddressReselect from '../top-navbar/address-reselect/AddressReselect'
import LogoSide from './LogoSide'
import NavLinks from './NavLinks'
import Wishlist from './Wishlist'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FloatingCart from '@/components/floating-cart/FloatingCart'


export const getSelectedAddons = (addon) => {
    return addon?.filter((item) => {
        return item?.isChecked !== undefined && item?.isChecked !== false
    })
}
export const getSelectedVariations = (variations) => {
    let selectedItem = []
    if (variations?.length > 0) {
        variations?.forEach((item, index) => {
            item?.values?.forEach((value, optionIndex) => {
                if (value?.isSelected) {
                    const itemObj = {
                        choiceIndex: index,
                        isSelected: value?.isSelected,
                        label: value?.label,
                        optionIndex: optionIndex,
                        optionPrice: value?.optionPrice,
                        current_stock: value?.current_stock,
                        option_id: value?.option_id,
                        stock_type: value?.stock_type


                        // type:item?.
                    }
                    selectedItem.push(itemObj)
                }
            })
        })
    }
    return selectedItem
}

export const CustomNavBox = styled(Box)(({ theme, isSticky }) => ({
    display: isSticky ? 'visible' : 'hidden',
    background: theme.palette.navbarBg,
    boxShadow: '0px 5px 15px 0px rgba(0, 0, 0, 0.05)',
}))
const SecondNavbar = ({ isSticky, cartListRefetch }) => {
    const [modalFor, setModalFor] = useState('sign-in')
    const [openSearchBox, setOpenSearchBox] = useState(true)
    const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
    const [authModalOpen, setOpen] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [openPopover, setOpenPopover] = useState(false)
    let languageDirection = 'rtl'
    const [openWishlistModal, setOpenWishlistModal] = useState(false)
    const { userData } = useSelector((state) => state.user)
    const { t } = useTranslation()
    const router = useRouter()
    const { query } = router.query
    const { global, userLocationUpdate } = useSelector(
        (state) => state.globalSettings
    )
    const { cartList } = useSelector((state) => state.cart)
    const theme = useTheme()
    const isSmall = useMediaQuery(theme.breakpoints.down('md'))
    const dispatch = useDispatch()
    const anchorRef = useRef(null)
    const { countryCode, language } = useSelector(
        (state) => state.languageChange
    )
    const businessLogo = global?.fav_icon_full_url

    const handleOpenPopover = () => {
        setOpenPopover(true)
        setModalFor('sign-in')
    }

    const searchBoxRef = useClickOutside(() => {
        setOpenSearchBox(false)
    })



    const handleClosePopover = () => {
        setOpenPopover(false)
    }

    let location = useSelector(state => state.addressData.location);
    console.log("location in second nav")

    const customerbaseUrl = global?.base_urls?.customer_image_url
    const handleClick = (value) => {
        router.push({
            pathname: '/info',
            query: {
                page: value,
            },
        })
    }

    useEffect(() => {
        if (router.pathname !== '/checkout') {
            dispatch(setOfflineWithPartials(false))
        }
    }, [])
    const handleAuthBasedOnRoute = () => {
        return (
            <RTL direction={'rtl'}>

                <>
                    <Stack direction="row" spacing={1}>
                        {/* <Box
                                align="center"
                                component={ButtonBase}
                                alignItem="center"
                                onClick={() => handleClick('inbox')}
                            >
                                <IconButton>
                                    <ChatIcon
                                        sx={{
                                            height: 25,
                                            width: 25,
                                            color: (theme) =>
                                                theme.palette.primary.main,
                                        }}
                                    ></ChatIcon>
                                </IconButton>
                            </Box> */}

                        <Box
                            align="center"
                            component={ButtonBase}
                            onClick={() => setSideDrawerOpen(true)}
                        >
                            <Badge
                                badgeContent={cartList?.length}
                                color="secondary"
                                overlap="circular"
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                            >
                                <IconButton>
                                    <ShoppingCartIcon />
                                </IconButton>
                            </Badge>
                        </Box>

                        {!isSmall && (
                            <LefRightBorderBox>
                                <Wishlist
                                    handleClick={() =>
                                        setOpenWishlistModal(true)
                                    }
                                />
                                <CustomDrawerWishlist
                                    openWishlistModal={openWishlistModal}
                                    setOpenWishlistModal={
                                        setOpenWishlistModal
                                    }
                                />
                            </LefRightBorderBox>
                        )}

                        <Box
                            align="center"
                            ml={languageDirection !== 'rtl' && '.9rem'}
                            mr={languageDirection === 'rtl' && '.9rem'}
                            component={ButtonBase}
                            onClick={handleOpenPopover}
                            ref={anchorRef}
                            sx={{ paddingInline: '10px' }}
                        >
                            <Avatar
                                sx={{
                                    height: 30,
                                    width: 30,
                                    backgroundColor: userData?.image
                                        ? (theme) =>
                                            theme.palette.neutral[100]
                                        : (theme) =>
                                            theme.palette.neutral[400],
                                }}
                                src={userData?.image_full_url}
                            />
                        </Box>
                    </Stack>
                    <AccountPopover
                        anchorEl={anchorRef.current}
                        onClose={handleClosePopover}
                        open={openPopover}
                    />
                </>

            </RTL>
        )
    }
    const handleShowSearch = () => {

        return (
            <Box sx={{ minWidth: '450px', marginInlineEnd: '20px' }}>
                <SearchBox query={query} setOpenSearchBox={setOpenSearchBox} />
            </Box>
        )
    }
    const currentPath = router.pathname;
    console.log(currentPath, 'currentPath');
    if (currentPath === '/checkout') return;
    return (
        <>
            <FloatingCart
                sideDrawerOpen={sideDrawerOpen}
                setSideDrawerOpen={setSideDrawerOpen}
            />
            <NoSsr>
                <CustomNavBox isSticky={isSticky}>
                    <CustomContainer>
                        <Toolbar disableGutters={true}>
                            <CustomStackFullWidth
                                ref={searchBoxRef}
                                direction="row"
                                justifyContent="space-between"
                            >
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="center"
                                    gap="1rem"
                                >

                                    {!isSmall && (
                                        <NavLinks
                                        />
                                    )}
                                </Stack>
                                <Stack direction="row" alignItems="center">
                                    {handleShowSearch()}
                                    <Box
                                        sx={{
                                            display: { xs: 'none', md: 'flex' },
                                            flexGrow: 0,
                                            height: '40px',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {handleAuthBasedOnRoute()}
                                    </Box>
                                </Stack>
                            </CustomStackFullWidth>
                        </Toolbar>
                    </CustomContainer>
                </CustomNavBox>
            </NoSsr>
        </>
    )
}
export default SecondNavbar
