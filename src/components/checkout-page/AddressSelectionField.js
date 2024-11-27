import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { InputField, Saveaddress_Box } from './CheckOut.style'
import { alpha, InputBase, Typography } from "@mui/material";
import Link from 'next/link'
import Router from 'next/router'
import { Stack } from "@mui/system";
import LocationOnIcon from '@mui/icons-material/LocationOn';

const address_SelectionField = (props) => {
    const { theme, address, refetch, t } = props
    const borderColor = "rgba(255, 130, 0, 0.20)"
    const [address_,setaddress_] = useState({});

    useEffect(()=>{
       if(address)setaddress_(address?.address);
    },[address])
    const handleRoute = () => {
        Router.push(
            {
                pathname: '/info',
                query: { page: 'profile' },
            },
            undefined,
            { shallow: true }
        )
    }
    console.log("address_ 12345",address_);
    return (
        <>

                <InputField
                    variant="outlined"
                    sx={{
                        p: '8px 4px',
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        border: `1px solid ${borderColor}`,
                        gap: '5px',
                        borderRadius:"5px",
                        backgroundColor:theme=>alpha(theme.palette.primary.light,.2),

                    }}
                >
                    <LocationOnIcon sx={{color:theme=>theme.palette.primary.main,}}/>
                    <Typography fontSize="14px" fontWeight="600">
                        {t(address_?.address?.tag)}:
                    </Typography>
                    <InputBase
                        sx={{
                            ml: 1,
                            flex: 1,
                            fontSize: '15px',
                            color:theme=>theme.palette.neutral[600],
                            [theme.breakpoints.down('sm')]: {
                                fontSize: '12px',
                            },
                        }}
                        placeholder="Set Location"
                        inputProps={{
                            'aria-label': 'search google maps',
                        }}
                        value={`${address_?.address?.building} ${address_?.address?.street} ${address_?.address?.city} ${address_?.address?.state} ${address_?.address?.areaCode}`}
                    />

                    {/*<AddNewaddress_ refetch={refetch} buttonbg="true" />*/}
                </InputField>

        </>
    )
}

address_SelectionField.propTypes = {}

export default address_SelectionField
