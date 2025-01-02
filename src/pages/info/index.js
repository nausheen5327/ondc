import React, { useEffect, useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import Meta from '../../components/Meta'
import CustomContainer from '../../components/container'
import UserInfo from '../../components/user-info'
import { useRouter } from 'next/router'
import AuthGuard from '../../components/authentication/AuthGuard'
import jwt from "base-64";
import HomeGuard from "../../components/home-guard/HomeGuard";
const index = () => {
    const router = useRouter()
    const { page, orderId, token, ticketId } = router.query
    const [attributeId, setAttributeId] = useState('')

  

    return (
        <div>
        {/* <HomeGuard> */}
            <CssBaseline />
            <CustomContainer>
                    {page && <UserInfo page={page} orderId={orderId ?? attributeId} setAttributeId={setAttributeId} ticketId={ticketId}/>}
            </CustomContainer>
        {/* </HomeGuard> */}
        </div>
    )
}

export default index