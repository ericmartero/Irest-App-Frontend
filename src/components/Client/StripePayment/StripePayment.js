import React, { useRef } from 'react';
import { useStripePayment } from '../../../hooks';
import { CardElement } from '@stripe/react-stripe-js';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import './StripePayment.scss';

export function StripePayment(props) {

    const { totalPayment, createAppPayment } = props;

    const toast = useRef(null);
    const { loading, checkoutStripe } = useStripePayment();

    const makePayment = async () => {
        const result = await checkoutStripe(totalPayment, CardElement);

        if (result.error === null) {
            createAppPayment();
        } else {
            toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: result.error.message, life: 3000 });
        }
    };

    return (
        <>
            {loading && <ProgressSpinner style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }} />}
            <Toast ref={toast} position="bottom-center" />
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
                <Button label='Pagar' onClick={makePayment} />
            </div>
        </>
    );
}
