import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, FormControlLabel, Grid } from '@mui/material'
import { ConditionTypography } from '../CheckOut.style'
import { useTranslation } from 'react-i18next'
import {
    CustomPaperBigCard,
    CustomStackFullWidth,
} from "@/styled-components/CustomStyles.style"
import { CustomTypographyGray } from '../../error/Errors.style'
import { CustomTypography } from '../../custom-tables/Tables.style'
import LoadingButton from '@mui/lab/LoadingButton'
import Link from 'next/link'
import FormGroup from '@mui/material/FormGroup'
import Checkbox from '@mui/material/Checkbox'
import { useDispatch, useSelector } from 'react-redux'
import { setOfflineInfoStep, setOfflineWithPartials } from "@/redux/slices/OfflinePayment";
import Router, { useRouter } from 'next/router'
import toast from 'react-hot-toast'

const PlaceOrder = (props) => {
    const { distanceLoading,placeOrder, orderLoading, offlinePaymentLoading, offlineFormRef, usePartialPayment, page, paymentMethodDetails } = props;
    const router = useRouter();
    const { t } = useTranslation()
    const dispatch = useDispatch();
    const [checked, setChecked] = useState(false)
    const { token } = useSelector((state) => state.userToken);
    const { offlineInfoStep } = useSelector((state) => state.offlinePayment);
    const { guestUserInfo } = useSelector((state) => state.guestUserInfo);
    const handleChange = (e) => {
        setChecked(e.target.checked)
    }
    

    return (
        <CustomStackFullWidth alignItems="center" spacing={2} marginTop="1rem">
            
                
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox checked={checked} onChange={handleChange} />
                            }
                            label={
                                <CustomTypography sx={{ fontSize: '13px' }}>
                                    {t(
                                        `I agree that placing the order places me under`
                                    )}{' '}
                                    <Link
                                        href="https://policy.nazara.com/terms.html"
                                        style={{ textDecoration: 'underline' }}
                                    >
                                        {t('Terms and Conditions')}
                                    </Link>{' '}
                                    {t('&')}
                                    <Link
                                        href="https://policy.nazara.com/privacypolicy.html"
                                        style={{ textDecoration: 'underline' }}
                                    >
                                        {t('Privacy Policy')}
                                    </Link>
                                </CustomTypography>
                            }
                        />
                    </FormGroup>
                    <LoadingButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        onClick={placeOrder}
                        disabled={!checked}
                    >
                        {t('Place Order')}
                    </LoadingButton>
                
            

        </CustomStackFullWidth >
    )
}

PlaceOrder.propTypes = {}

export default PlaceOrder
