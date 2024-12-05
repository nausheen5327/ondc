import React, {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import CssBaseline from "@mui/material/CssBaseline";
import { useSelector } from "react-redux";

const HomeGuard = (props) => {
    const {children,from,page} = props
    const router = useRouter()
    const { cartList } = useSelector((state) => state.cart)
    const [checked, setChecked] = useState(false)
    const location = useSelector(state=>state.addressData.location)
    // console.log("location inside homeguard",location);
   

    // If got here, it means that the redirect did not occur, and that tells us that the user is
    // authenticated / authorized.

    return <>
        <CssBaseline/>
        {children}</>
}

HomeGuard.propTypes = {}

export default HomeGuard
