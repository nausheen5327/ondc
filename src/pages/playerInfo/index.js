// import React, { useEffect } from 'react'
// import Meta from '../../components/Meta'
// import {  CssBaseline } from '@mui/material'
// import {    CustomStackFullWidth
// } from "@/styled-components/CustomStyles.style"
// import  { useRouter } from 'next/router'
// import { useSelector } from 'react-redux'
// import CustomContainer from '../../components/container'
// import HomeGuard from "../../components/home-guard/HomeGuard";
// import PlayerDetails from '@/components/user-info/profile/PlayerDetails'
// import PlayerDetailsPage from '@/components/user-info/profile/PlayerDetailsPage'
// const PlayerDetailLayout = ({ configdata }) => {
   
//     const router = useRouter()
//     const { page } = router.query


//     return (
//         <>
//             <CssBaseline />
//             <CustomContainer>
//                 <CustomStackFullWidth sx={{ marginTop: '5rem' }}>
//                     <Meta
//                         title={`Player Details on ONDC`}
//                         description=""
//                         keywords=""
//                     />
//                     <PlayerDetails />
//                 </CustomStackFullWidth>
//             </CustomContainer>
//         </>
//     )
// }
// export default PlayerDetailLayout
//  // export { getServerSideProps }

import React, { useEffect, useState } from 'react'
import Meta from '../../components/Meta'
import { CssBaseline } from '@mui/material'
import { CustomStackFullWidth } from "@/styled-components/CustomStyles.style"
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import CustomContainer from '../../components/container'
import HomeGuard from "../../components/home-guard/HomeGuard"
import PlayerDetails from '@/components/user-info/profile/PlayerDetails'
import PlayerDetailsPage from '@/components/user-info/profile/PlayerDetailsPage'
import AuthModal from '../../components/auth'
import { getValueFromCookie } from '../../utils/cookies'
import LoadingScreen from '@/components/CheckoutLoader'

const PlayerDetailLayout = ({ configdata }) => {
    const router = useRouter()
    const { page } = router.query
    
    // Auth modal state
    const [authModalOpen, setAuthModalOpen] = useState(false)
    const [modalFor, setModalFor] = useState('sign-in')
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const token = getValueFromCookie("token")
        
        if (!token) {
            setAuthModalOpen(true)
            setIsAuthenticated(false)
        } else {
            setIsAuthenticated(true)
        }
        
        setIsLoading(false)
    }, [])

    const handleCloseAuthModal = () => {
        setAuthModalOpen(false)
        // router.push('/home')
    }

    if (isLoading) {
        return (
            <LoadingScreen message={"Processing your checkout..." } />
        )
    }

    if (!isAuthenticated) {
        return (
            <AuthModal
                open={authModalOpen}
                handleClose={handleCloseAuthModal}
                modalFor={modalFor}
                setModalFor={setModalFor}
            />
        )
    }

    return (
        <>
            <CssBaseline />
            <CustomContainer>
                <CustomStackFullWidth sx={{ marginTop: '5rem' }}>
                    <Meta
                        title={`Player Details on ONDC`}
                        description=""
                        keywords=""
                    />
                    <PlayerDetails />
                </CustomStackFullWidth>
            </CustomContainer>
        </>
    )
}

export default PlayerDetailLayout
// export { getServerSideProps }