import React, { useEffect } from 'react'
import Meta from '../../components/Meta'
import {  CssBaseline } from '@mui/material'
import {    CustomStackFullWidth
} from "@/styled-components/CustomStyles.style"
import  { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import CustomContainer from '../../components/container'
import HomeGuard from "../../components/home-guard/HomeGuard";
import PlayerDetails from '@/components/user-info/profile/PlayerDetails'
import PlayerDetailsPage from '@/components/user-info/profile/PlayerDetailsPage'
const PlayerDetailLayout = ({ configdata }) => {
   
    const router = useRouter()
    const { page } = router.query


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