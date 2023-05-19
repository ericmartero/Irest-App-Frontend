import { useState, useCallback } from 'react';
import { useAuth } from './';
import { 
    getOrdersByTableApi, 
    checkDeliveredOrderApi, 
    addOrderToTableApi, 
    deleteOrderApi, 
    addPaymentToOrderApi, 
    closeOrderApi,
    getOrdersByPaymentApi 
} from '../api/order';

export function useOrder() {

    const { auth, authClient } = useAuth();
    const [orders, setOrders] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getOrdersByTable = useCallback( async (id, status) => {
        try {
            setLoading(true);
            const response = await getOrdersByTableApi(id, auth.token, status);
            setLoading(false);

            if (response.error) {
                setError(response.error);
            } else {
                setOrders(response);
            }

        } catch (error) {
            setLoading(false);
            throw error;
        }
    }, [auth?.token]);

    const getOrdersByTableClient = useCallback( async (id, status) => {
        try {
            setLoading(true);
            const response = await getOrdersByTableApi(id, authClient.token, status);
            setLoading(false);
            setOrders(response);
        } catch (error) {
            setLoading(false);
            throw error;
        }
    }, [authClient?.token]);

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

    const addClientOrderToTable = async (idTableBooking, idProduct) => {
        try {
            await addOrderToTableApi(idTableBooking, idProduct, authClient.token);
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

    const addPaymentToOrder = async (idOrder, idPayment) => {
        try {
            await addPaymentToOrderApi(idOrder, idPayment, auth.token);
        } catch (error) {
            throw error;
        }
    };

    const addPaymentToOrderClient = async (idOrder, idPayment) => {
        try {
            await addPaymentToOrderApi(idOrder, idPayment, authClient.token);
        } catch (error) {
            throw error;
        }
    };

    const closeOrder = async (idOrder) => {
        try {
            await closeOrderApi(idOrder, auth.token);
        } catch (error) {
            throw error;
        }
    };

    const closeOrderClient = async (idOrder) => {
        try {
            await closeOrderApi(idOrder, authClient.token);
        } catch (error) {
            throw error;
        }
    };

    const getOrdersByPayment = useCallback( async (idPayment) => {
        try {
            return await getOrdersByPaymentApi(idPayment, auth.token);
        } catch (error) {
            throw error;
        }
    }, [auth?.token]);

    return {
        error,
        orders,
        loading,
        getOrdersByTable,
        checkDeliveredOrder,
        addOrderToTable,
        addClientOrderToTable,
        deleteOrder,
        addPaymentToOrder,
        addPaymentToOrderClient,
        closeOrder,
        closeOrderClient,
        getOrdersByPayment,
        getOrdersByTableClient,
    };
}