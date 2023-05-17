import { useCallback, useState } from "react";
import { createPaymentApi, getPaymentByTableApi, closePaymentApi, getPaymentsApi, getPaymentByIdApi } from "../api/payment";
import { useAuth } from './';

export function usePayment() {

    const { auth, authClient } = useAuth();
    const [loading, setLoading] = useState(true);
    const [payments, setPayments] = useState(null);
    const [error, setError] = useState(null);

    const createPayment = async (paymentData) => {
        try {
            return await createPaymentApi(paymentData, auth.token);
        } catch (error) {
            throw error;
        }
    }

    const createClientPayment = async (paymentData) => {
        try {
            return await createPaymentApi(paymentData, authClient.token);
        } catch (error) {
            throw error;
        }
    }

    const getPaymentByTable = useCallback( async (idTable) => {
        try {
            return await getPaymentByTableApi(idTable, auth.token);
        } catch (error) {
            throw error;
        }
    }, [auth?.token]);

    const getPaymentByIdClient = useCallback( async (idTable) => {
        try {
            return await getPaymentByIdApi(idTable, authClient.token);
        } catch (error) {
            throw error;
        }
    }, [authClient?.token]);

    const closePayment = async (idPayment) => {
        try {
            await closePaymentApi(idPayment, auth.token);
        } catch (error) {
            throw error;
        }
    };

    const closePaymentClient = async (idPayment) => {
        try {
            await closePaymentApi(idPayment, authClient.token);
        } catch (error) {
            throw error;
        }
    };

    const getPayments = useCallback( async () => {
        try {
            setLoading(true);
            const response = await getPaymentsApi(auth.token);
            setLoading(false);

            if (response.error) {
                setError(response.error);
            } else {
                setPayments(response);
            }
            
        } catch (error) {
            setLoading(false);
            throw error;
        }
    }, [auth?.token]);

    return {
        payments,
        loading,
        error,
        createPayment,
        createClientPayment,
        getPaymentByTable,
        getPaymentByIdClient,
        closePayment,
        closePaymentClient,
        getPayments
    };
}