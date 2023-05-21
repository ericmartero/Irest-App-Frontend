import { useState } from 'react'
import { useAuth } from './useAuth'
import { checkoutStripeApi } from '../api/stripe';
import { useElements, useStripe } from '@stripe/react-stripe-js';

export function useStripePayment() {

    const stripe = useStripe();
    const elements = useElements()
    const { authClient } = useAuth();
    const [loading, setLoading] = useState(true);

    const checkoutStripe = async (totalPayment, element) => {
        try {
            setLoading(true);

            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: "card",
                card: elements.getElement(element),
            });

            if (error) {
                setLoading(false);
                return { error: error, result: null };
            } else {
                const result = await checkoutStripeApi(totalPayment, paymentMethod.id, authClient.token);
                setLoading(false);
                return { error: null, result: result };
            }
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    return {
        loading,
        checkoutStripe
    }
}


