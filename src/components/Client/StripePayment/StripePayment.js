import React, { useState, useEffect } from 'react';
import { useStripePayment } from '../../../hooks';
import { CardElement } from '@stripe/react-stripe-js';
import { Button } from 'primereact/button';
import './StripePayment.scss';

export function StripePayment(props) {

    const { totalPayment } = props;
    const { error, loading, checkoutStripe } = useStripePayment();

    const makePayment = async () => {
        try {
            const response = await checkoutStripe(totalPayment);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div>
                <span className="font-bold">Introduce tu tarjeta de crédito:</span>
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
                <Button label='Realizar el pago' onClick={makePayment}/>
            </div>
        </>
    );
}
