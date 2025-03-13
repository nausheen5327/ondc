import ChatIcon from '@mui/icons-material/Chat'
// import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import HomeIcon from '@mui/icons-material/Home'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import {
    Badge,
    BottomNavigation,
    BottomNavigationAction,
    Paper,
    styled,
} from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import CustomDrawerWishlist from './CustomDrawerWishlist'
import { setCartList } from '@/redux/slices/cart';
import { useAuthData } from '../auth/authSuccessHandler';

const BottomNav = (props) => {
    const { t } = useTranslation()
    const router = useRouter()
    const { setSideDrawerOpen } = props
    const { cartList } = useSelector((state) => state.cart)
    const [openWishlistModal, setOpenWishlistModal] = useState(false)
        const { fetchCartItems } = useAuthData();
    
    let zoneid = undefined
    if (typeof window !== 'undefined') {
        zoneid = localStorage.getItem('zoneid')
    }
    let token = undefined
    if (typeof window != 'undefined') {
        token = localStorage.getItem('token')
    }
    const [value, setValue] = useState(0)
    const dispatch = useDispatch();
    const orangeColor = '#65748B'

    const MuiBottomNavigationAction = styled(BottomNavigationAction)(
        ({ theme }) => ({
            // color: '#ccc',
            '&.Mui-selected': {
                color: orangeColor,
            },
        })
    )
    const routeToWishList = (value) => {
        if (token) {
            router.push({
                pathname: '/info',
                query: {
                    page: value,
                },
            })
        } else toast.error(t('you are not logged in'))
    }

    if(router.pathname==='/login')return;

    useEffect(()=>{
        const user = localStorage.getItem('user');
        if(!user)
        {
            let cartListPreAuthStored = localStorage.getItem('cartListPreAuth');
            if(cartListPreAuthStored)
            {
                const cartListPreAuth = JSON.parse(cartListPreAuthStored);
                dispatch(setCartList(cartListPreAuth));

            }
        }else{
            fetchCartItems()
        }
    },[])

    return (
        <>
            <CustomDrawerWishlist
                openWishlistModal={openWishlistModal}
                setOpenWishlistModal={setOpenWishlistModal}
            />
            <Paper
                className="bottom-navigation-wrap"
                sx={{
                    display: { xs: 'block', md: 'none' },
                    py: 1,
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 999,
                    padding: 0
                }}
                elevation={3}
            >
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue)
                    }}
                >
                    
                        <MuiBottomNavigationAction
                        onClick={()=>router.push('/home')}
                        icon={
                            <Badge badgeContent={0} color="error">
                                <HomeIcon />
                            </Badge>
                        }
                           
                        />

                    {/* <MuiBottomNavigationAction
                        onClick={() => setOpenWishlistModal(!openWishlistModal)}
                        icon={
                            <Badge badgeContent={0} color="error">
                                <FavoriteBorderIcon />
                            </Badge>
                        }
                    /> */}

                    <MuiBottomNavigationAction
                        onClick={() => setSideDrawerOpen(true)}
                        // label="Cart"
                        icon={
                            <Badge
                                badgeContent={cartList?.length}
                                color="error"
                            >
                                <ShoppingCartOutlinedIcon />
                            </Badge>
                        }
                    />

                   
                </BottomNavigation>
            </Paper>
        </>
    )
}

export default BottomNav
