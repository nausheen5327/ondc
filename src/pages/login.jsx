import LockIcon from '@mui/icons-material/Lock'
import MenuIcon from '@mui/icons-material/Menu'
import { Button, IconButton, Stack, Typography, alpha } from '@mui/material'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { styled } from '@mui/material/styles'
import Router, { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ButtonContainer, CustomDrawer } from '@/components/navbar/Navbar.style'
import { setWelcomeModal } from '@/redux/slices/utils'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { CategoryApi } from '../hooks/react-query/config/categoryApi'
import { RestaurantsApi } from '../hooks/react-query/config/restaurantApi'
import { useGetCuisines } from '../hooks/react-query/cuisines/useGetCuisines'
import { setClearCart } from '../redux/slices/cart'
import {
    setCuisines,
    setFeaturedCategories,
} from '../redux/slices/storedData'
import { removeToken } from '../redux/slices/userToken'
import { clearWishList } from '../redux/slices/wishList'
import AuthModal from '@/components/auth'
import { withAuth } from '@/components/withAuth'




const Login = ({ zoneid, cartListRefetch }) => {
    const [forSignup, setForSignup] = useState('')
    const [modalFor, setModalFor] = useState('sign-in')
    const { featuredCategories, cuisines } = useSelector(
        (state) => state.storedData
    )
    const { t } = useTranslation()
    const router = useRouter()
    const dispatch = useDispatch()
    // const token = getToken()
    const [authModalOpen, setOpen] = useState(true)
    const handleOpenAuthModal = (page) => {
        setModalFor(page)
        setOpen(true)
        setForSignup(page)
    }

    const handleCloseAuthModal = () => {
        setOpen(false)
        setForSignup('sign-in')
    }


    return (
        <Box>
                <AuthModal
                    open={authModalOpen}
                    handleClose={false}
                    forSignup={forSignup}
                    modalFor={modalFor}
                    setModalFor={setModalFor}
                    cartListRefetch={cartListRefetch}
                />
        </Box>
    )
}

export default withAuth(Login,false)
