//import { useState } from "react";
import { createPaymentApi } from "../api/payment";
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

    return {
        createPayment,
    };
}