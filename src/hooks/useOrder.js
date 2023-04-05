import { useState, useCallback } from 'react';
import { useAuth } from './';
import { getOrdersByTableApi, checkDeliveredOrderApi, addOrderToTableApi, deleteOrderApi } from '../api/order';

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

    const checkDeliveredOrder = async (id, status) => {
        try {
            await checkDeliveredOrderApi(id, status, auth.token);
        } catch (error) {
            throw error;
        }
    };

    const addOrderToTable = async (idTableBooking, idProduct) => {
        try {
            await addOrderToTableApi(idTableBooking, idProduct, auth.token);
        } catch (error) {
            throw error;
        }
    };

    const deleteOrder = async (id) => {
        try {
            await deleteOrderApi(id, auth.token);
        } catch (error) {
            throw error;
        }
    };

    return {
        orders,
        getOrdersByTable,
        checkDeliveredOrder,
        addOrderToTable,
        deleteOrder,
    };
}