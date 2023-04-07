import { useCallback } from "react";
import { createPaymentApi, getPaymentByTableApi } from "../api/payment";
import { useAuth } from './';

export function usePayment() {

    const { auth } = useAuth();

    const createPayment = async (paymentData) => {
        try {
            return await createPaymentApi(paymentData, auth.token);
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

    return {
        createPayment,
        getPaymentByTable,
    };
}