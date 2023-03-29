import { useState } from 'react';
import {useAuth } from './';
import { getOrdersByTableApi } from '../api/order';

export function useOrder() {

    const { auth } = useAuth();
    const [orders, setOrders] = useState(null);

    const getOrdersByTable = async (id, status, ordering) => {
        try {
            const response = await getOrdersByTableApi(id, status, ordering, auth.token);
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