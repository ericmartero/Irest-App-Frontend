import { useCallback, useState } from "react";
import { createPaymentApi, getPaymentByTableApi, closePaymentApi, getPaymentsApi, getPaymentByIdApi } from "../api/payment";
import { useAuth } from './';
import { useHistory } from "react-router-dom";

export function usePayment() {

    const history = useHistory();
    const { auth, authClient } = useAuth();
    const [loading, setLoading] = useState(true);
    const [payments, setPayments] = useState(null);
    const [error, setError] = useState(null);

    const createPayment = async (paymentData) => {
        try {
            const response = await createPaymentApi(paymentData, auth.token);

            if (response.statusCode === 401 || response.statusCode === 500) {
                localStorage.clear();
                history.push("/");
            }

            return response;
        } catch (error) {
            throw error;
        }
    }

    const createClientPayment = async (paymentData) => {
        try {
            const response = await createPaymentApi(paymentData, authClient.token);

            if (response.statusCode === 401 || response.statusCode === 500) {
                localStorage.clear();
                history.push("/");
            }

            return response;
        } catch (error) {
            throw error;
        }
    }

    const getPaymentByTable = useCallback( async (idTable) => {
        try {
            const response = await getPaymentByTableApi(idTable, auth.token);

            if (response.statusCode === 401 || response.statusCode === 500) {
                localStorage.clear();
                history.push("/");
            }

            return response;
        } catch (error) {
            throw error;
        }
    }, [auth?.token, history]);

    const getPaymentByIdClient = useCallback( async (idTable) => {
        try {
            const response = await getPaymentByIdApi(idTable, authClient.token);
            return response;
        } catch (error) {
            throw error;
        }
    }, [authClient?.token]);

    const closePayment = async (idPayment) => {
        try {
            const response = await closePaymentApi(idPayment, auth.token);

            if (response.statusCode === 401 || response.statusCode === 500) {
                localStorage.clear();
                history.push("/");
            }
        } catch (error) {
            throw error;
        }
    };

    const closePaymentClient = async (idPayment) => {
        try {
            const response = await closePaymentApi(idPayment, authClient.token);

            if (response.statusCode === 401 || response.statusCode === 500) {
                localStorage.clear();
                history.push("/");
            }
        } catch (error) {
            throw error;
        }
    };

    const getPayments = useCallback( async () => {
        try {
            setLoading(true);
            const response = await getPaymentsApi(auth.token);
            setLoading(false);

            if (response.statusCode === 401 || response.statusCode === 500) {
                localStorage.clear();
                history.push("/");
            }

            if (response.error) {
                setError(response.error);
            } else {
                setPayments(response);
            }
            
        } catch (error) {
            setLoading(false);
            throw error;
        }
    }, [auth?.token, history]);

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