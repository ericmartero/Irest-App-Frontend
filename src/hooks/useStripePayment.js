import { useState } from 'react'
import { useAuth } from './useAuth'
import { PAYMENT_TYPE } from '../utils/constants';
import { checkoutStripeApi } from '../api/stripe';
import { useElements, useStripe } from '@stripe/react-stripe-js';

export function useStripePayment() {

    const stripe = useStripe();
    const elements = useElements()
    const { authClient } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const checkoutStripe = async (totalPayment, element) => {
        try {
            setLoading(true);

            const response = await stripe.createPaymentMethod({
                type: PAYMENT_TYPE.CARD,
                card: elements.getElement(element),
            });

            if (response.error) {
                setError(response.error);
            }
            const paymentStripe = { "amount": totalPayment };
            
            const result = await checkoutStripeApi(paymentStripe, authClient.token);
            setLoading(false);

            return result;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    }

    return {
        error,
        loading,
        checkoutStripe
    }
}


