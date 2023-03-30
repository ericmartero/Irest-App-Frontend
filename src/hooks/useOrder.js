import { useState, useCallback } from 'react';
import { useAuth } from './';
import { getOrdersByTableApi, checkDeliveredOrderApi } from '../api/order';

export function useOrder() {

    const { auth } = useAuth();
    const [orders, setOrders] = useState(null);

    const getOrdersByTable = useCallback( async (id, status) => {
        try {
            const response = await getOrdersByTableApi(id, auth.token, status);
            setOrders(response);
        } catch (error) {
            throw error;
        }
    }, [auth?.token]);

    const checkDeliveredOrder = async (id) => {
        try {
            await checkDeliveredOrderApi(id, auth.token);
        } catch (error) {
            throw error;
        }
    }

    return {
        orders,
        getOrdersByTable,
        checkDeliveredOrder,
    };
}