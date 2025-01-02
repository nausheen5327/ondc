import React from 'react';
import { CssBaseline, Container } from '@mui/material';
import OrderDetails from './OrderDetails';
import PushNotificationLayout from "../PushNotificationLayout";
import { useSelector } from "react-redux";
import CustomContainer from '../container';

const ComplaintDetail = ({ticketId}) => {
    const { guestUserInfo } = useSelector((state) => state.guestUserInfo);

    return (
        <PushNotificationLayout>
            <OrderDetails phone={guestUserInfo?.contact_person_number} OrderIdDigital={ticketId}/>
        </PushNotificationLayout>
    );
};

export default ComplaintDetail;

