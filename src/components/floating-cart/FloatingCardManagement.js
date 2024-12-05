import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import FloatingCart from './FloatingCart'
import BottomNav from '../navbar/BottomNav'
import { useSelector } from 'react-redux'

const FloatingCardManagement = () => {
    const [sideDrawerOpen, setSideDrawerOpen] = useState(false)
    const [showBottomNav, setShowBottomNav] = useState(false)
    useEffect(() => {
         setShowBottomNav(true)
    }, [])

    const sideDrawer = useSelector(state=>state.globalSettings.sideDrawerOpen)

    useEffect(()=>{
        setSideDrawerOpen(sideDrawer);
    },[sideDrawer])

    return (
        <>
            <FloatingCart
                sideDrawerOpen={sideDrawerOpen}
                setSideDrawerOpen={setSideDrawerOpen}
            />
            {showBottomNav && (
                <BottomNav setSideDrawerOpen={setSideDrawerOpen} />
            )}
        </>
    )
}

FloatingCardManagement.propTypes = {}

export default FloatingCardManagement
