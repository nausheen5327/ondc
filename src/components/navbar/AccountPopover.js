import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
// import toast from 'react-hot-toast'
import LogoutIcon from '@mui/icons-material/Logout'
import {
    alpha,
    Box,
    Divider,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
    Popover,
    Typography,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import { setWelcomeModal } from '@/redux/slices/utils'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cupons from '../../../public/static/profile/cupons.png'
import loyalty from '../../../public/static/profile/loyalty.svg'
import order from '../../../public/static/profile/order.svg'
import profile from '../../../public/static/profile/profileIcon.svg'
import settings from '../../../public/static/profile/settings.svg'
import wallet from '../../../public/static/profile/wallet.svg'
import wish from '../../../public/static/profile/wish.svg'
import refer from '../../../public/static/refer_code.png'
import { removeToken } from '../../redux/slices/userToken'
import { clearWishList } from '../../redux/slices/wishList'
import { logoutSuccessFull } from '../../utils/ToasterMessages'
import CustomDialogConfirm from '../custom-dialog/confirm/CustomDialogConfirm'
import { CustomToaster } from '../custom-toaster/CustomToaster'
import { removeCookie } from '@/utils/cookies'
import { setlocation } from '@/redux/slices/addressData'

export const menuData = [
    {
        id: 1,
        label: 'My Orders',
        value: 'order',
        img: order,
    },
    {
        id: 2,
        label: 'Profile',
        value: 'profile',
        img: profile,
    },
    {
        id: 3,
        label: 'Coupons',
        value: 'coupons',
        img: cupons,
    },
    {
        id: 4,
        label: 'Wallets',
        value: 'wallets',
        img: wallet,
    },
    {
        id: 5,
        label: 'Loyalty Points',
        value: 'loyalty',
        img: loyalty,
    },
    {
        id: 6,
        label: 'Referral Code',
        value: 'referral',
        img: refer,
    },
    {
        id: 7,
        label: 'Wish List',
        value: 'wishlist',
        img: wish,
    },
    { id: 8, label: 'Inbox', value: 'inbox' },
    {
        id: 9,
        label: 'Settings',
        value: 'settings',
        img: settings,
    },
]

export const AccountPopover = (props) => {
    const [openModal, setOpenModal] = useState(false)
    const [isLogoutLoading, setIsLogoutLoading] = useState(false)
    const [languageDirection, setLanguageDirection] = useState('ltr')
    const { global } = useSelector((state) => state.globalSettings)
    const router = useRouter()
    const { t } = useTranslation()
    const { cartListRefetch, anchorEl, onClose, open, ...other } = props
    const dispatch = useDispatch()
    const handleLogout = async () => {
        setIsLogoutLoading(true)
        try {
            setTimeout(() => {
                localStorage.removeItem('token')
                removeCookie('token')
                dispatch(removeToken())
                dispatch(setlocation(null))
                dispatch(setWelcomeModal(false))
                let a = []
                dispatch(clearWishList(a))
                // dispatch(setClearCart())
                // toast.success(t(logoutSuccessFull))
                //CustomToaster('success', logoutSuccessFull)
                onClose?.()
                router.push('/login')
            }, 500)
        } catch (err) {
            //   toast.error('Unable to logout.');
        }
    }
    const handleClick = (item) => {
        router.push({
            pathname: '/info',
            query: {
                page: item?.value,
            },
        })
        onClose()
    }
    useEffect(() => {
        if (localStorage.getItem('direction')) {
            setLanguageDirection(localStorage.getItem('direction'))
        }
    }, [])

    return (
        <>
            <Popover
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                keepMounted
                onClose={onClose}
                open={open}
                PaperProps={{ sx: { width: 300 } }}
                transitionDuration={5}
                {...other}
            >
                <Box
                    sx={{
                        alignItems: 'center',
                        p: 1,
                        cursor: 'pointer',
                    }}
                >
                    <MenuList>
                        {menuData.map((menu, index) => {
                            if (
                                (global?.customer_wallet_status === 0 &&
                                    menu.id === 4) ||
                                (global?.loyalty_point_status === 0 &&
                                    menu.id === 5) ||
                                (global?.ref_earning_status === 0 &&
                                    menu.id === 6)
                            ) {
                                return null
                            } else {
                                return (
                                    <MenuItem
                                        onClick={() => handleClick(menu)}
                                        key={menu.id}
                                        sx={{
                                            justifyContent: `${
                                                languageDirection === 'rtl' &&
                                                'flex-end'
                                            }`,
                                            '&:hover': {
                                                backgroundColor: (theme) =>
                                                    alpha(
                                                        theme.palette.primary
                                                            .main,
                                                        0.3
                                                    ),
                                            },
                                        }}
                                    >
                                        <Typography variant="body1">
                                            {t(menu.label)}
                                        </Typography>
                                    </MenuItem>
                                )
                            }
                        })}
                    </MenuList>
                </Box>
                <Divider />
                <Box
                    sx={{ my: 1, cursor: 'pointer' }}
                    alignItems={languageDirection === 'rtl' ? 'end' : 'start'}
                    width="100%"
                >
                    <MenuItem
                        onClick={() => setOpenModal(true)}
                        sx={{
                            justifyContent: `${
                                languageDirection === 'rtl'
                                    ? 'flex-end'
                                    : 'flex-start'
                            }`,
                            '&:hover': {
                                backgroundColor: (theme) =>
                                    alpha(theme.palette.primary.main, 0.3),
                            },
                        }}
                    >
                        <ListItemIcon>
                            <LogoutIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <Typography variant="body1">
                                    {t('Logout')}
                                </Typography>
                            }
                        />
                    </MenuItem>
                </Box>
            </Popover>
            <CustomDialogConfirm
                isLoading={isLogoutLoading}
                dialogTexts={t('Are you sure you want to  logout?')}
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSuccess={handleLogout}
            />
        </>
    )
}

AccountPopover.propTypes = {
    anchorEl: PropTypes.any,
    onClose: PropTypes.func,
    open: PropTypes.bool,
}
