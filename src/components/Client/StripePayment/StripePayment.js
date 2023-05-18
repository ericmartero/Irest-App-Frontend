import React, { useState, useEffect } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Button } from 'primereact/button';
import './StripePayment.scss';

export function StripePayment() {

    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe no ha sido cargado todavía
            return;
        }

        const cardElement = elements.getElement(CardElement);

        // Realizar la lógica de pago con Stripe aquí
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <span className='font-bold text-900'>Tarjeta de crédito:</span>
                <div className='stripe-payment-container'>
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    fontFamily: 'Arial, sans-serif',
                                },
                            },
                        }}
                        className='mt-4 mb-4'
                    />
                </div>
            </div>
            <div className='btn-stripe-payment'>
                <Button type="submit" label='Realizar el pago' disabled={!stripe} />
            </div>
        </form>
    );
}
