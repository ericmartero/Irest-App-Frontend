import { useState, useCallback } from 'react';
import { useAuth } from './';
import { getOrdersByTableApi, checkDeliveredOrderApi, addOrderToTableApi, deleteOrderApi } from '../api/order';

export function useOrder() {

    const { auth } = useAuth();
    const [orders, setOrders] = useState(null);
    const [loading, setLoading] = useState(true);

    const getOrdersByTable = useCallback( async (id, status) => {
        try {
            setLoading(true);
            const response = await getOrdersByTableApi(id, auth.token, status);
            setLoading(false);
            setOrders(response);
        } catch (error) {
            setLoading(false);
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
        loading,
        getOrdersByTable,
        checkDeliveredOrder,
        addOrderToTable,
        deleteOrder,
    };
}