import { useState } from 'react'
import { useAuth } from './useAuth'
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

            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: "card",
                card: elements.getElement(element),
            });

            if (error) {
                setError(error);
            }
            
            const result = await checkoutStripeApi(totalPayment, paymentMethod.id, authClient.token);
            setLoading(false);

            return result;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    return {
        error,
        loading,
        checkoutStripe
    }
}


