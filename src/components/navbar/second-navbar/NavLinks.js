import React, { useState } from 'react'
import { Stack, Typography } from '@mui/material'
import Link from 'next/link'
import { NavLinkStyle } from '../Navbar.style'
import NavCatagory from '../NavCatagory'
import NavResturant from '../NavResturant'
import NavCuisines from '../NavCuisines'
import { setHandleHomePage } from '../../../redux/slices/global'
import { useRouter } from 'next/router'
import { useDispatch,useSelector } from 'react-redux'

const NavLinks = () => {
    const router = useRouter()
    let languageDirection = 'rtl'
    const dispatch = useDispatch()
    const [openCategoryModal, setCategoryModal] = useState(false)
    const [openRestaurantModal, setRestaurantModal] = useState(false)
    const location = useSelector(state=>state.addressData.location)
    const handleClick = () => {
        router.push('/home')
        // dispatch(setHandleHomePage(false))
    }

    return (
        <Stack direction="row" spacing={2.5}>
            
                
                    <NavLinkStyle
                        onClick={handleClick}
                        underline="none"
                        languageDirection={languageDirection}
                        sx={{ cursor: 'pointer',paddingInlineEnd:languageDirection==="rtl" && "1.5rem" }}
                    >
                        <Typography fontSize="14px">{'Home'}</Typography>
                    </NavLinkStyle>

                    {/* <NavCatagory
                        openModal={openCategoryModal}
                        setModal={setCategoryModal}
                        setRestaurantModal={setRestaurantModal}
                        languageDirection={languageDirection}
                    /> */}
                    
                
            
        </Stack>
    )
}

NavLinks.propTypes = {}

export default NavLinks
