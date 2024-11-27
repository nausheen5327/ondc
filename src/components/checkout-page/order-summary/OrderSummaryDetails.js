import React from 'react'
import PropTypes from 'prop-types'
import { OrderSummary } from '../CheckOut.style'
import {Grid, Stack} from '@mui/material'
import { useTranslation } from 'react-i18next'
import RegularOrders from './RegularOrders'
import CampaignOrders from './CampaignOrders'
import SimpleBar from "simplebar-react";
import 'simplebar-react/dist/simplebar.min.css'
const OrderSummaryDetails = (props) => {
    const { type, page, global } = props
    const { t } = useTranslation()

    return (
        <>
            <Grid item md={12} xs={12} container spacing={1} mt="10px" pl="10px" style={{maxHeight:'100% !important',height:"100% !important"}} >
                   <RegularOrders/>
                   {/* {page === 'campaign' && <CampaignOrders global={global} />} */}
            </Grid>
        </>
    )
}

OrderSummaryDetails.propTypes = {}

export default React.memo(OrderSummaryDetails)
