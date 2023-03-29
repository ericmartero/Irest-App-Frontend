import { useState } from 'react';
import {useAuth } from './';
import { getOrdersByTableApi } from '../api/order';

export function useOrder() {

    const { auth } = useAuth();
    const [orders, setOrders] = useState(null);

    const getOrdersByTable = async (id, status) => {
        try {
            const response = await getOrdersByTableApi(id, auth.token, status);
            setOrders(response);
        } catch (error) {
            throw error;
        }
    };

    return {
        orders,
        getOrdersByTable,
    };
}