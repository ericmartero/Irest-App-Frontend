import React, { useState, useEffect } from 'react';
import { useOrder, usePayment } from '../../../hooks';
import { StripePayment } from '../StripePayment';
import { PAYMENT_TYPE } from '../../../utils/constants';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { forEach, size } from 'lodash';
import '../../../scss/Dialogs.scss';
import './Payment.scss';

export function Payment(props) {

    const { table, orders, payment, isPaidToast, noOrdersToPaymentToast, requestedAccount, onRefreshPayment } = props;

    const { createClientPayment } = usePayment();
    const { addPaymentToOrderClient } = useOrder();

    const [ordersTable, setOrdersTable] = useState(null);
    const [paymentType, setPaymentType] = useState(null);
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [showConfirmPaymentDialog, setShowConfirmPaymentDialog] = useState(false);
    const [showStripePaymentDialog, setShowStripePaymentDialog] = useState(false);

    useEffect(() => {
        if (orders) {
            setOrdersTable(orders);
        }
    }, [orders]);

    const onShowPaymentDialog = () => {
        if (payment) {
            isPaidToast();
        }

        else if (size(ordersTable) === 0) {
            noOrdersToPaymentToast();
        }

        else {
            setShowPaymentDialog(true);
        }
    };

    const hideShowPaymentDialog = () => {
        setShowPaymentDialog(false);
    };

    const createPayment = async () => {

        if (paymentType === PAYMENT_TYPE.APP) {
            setShowStripePaymentDialog(true);
        }

        else {
            let totalPayment = 0;
            forEach(ordersTable, (order) => {
                totalPayment += order.product.price;
            });

            const paymentData = {
                table: table.tableBooking.id,
                totalPayment: Number(totalPayment.toFixed(2)),
                paymentType,
            };

            const payment = await createClientPayment(paymentData);

            for await (const order of ordersTable) {
                await addPaymentToOrderClient(order.id, payment.id);
            };

            onRefreshPayment();
            requestedAccount();
        }

        setShowConfirmPaymentDialog(false);
    };

    const onPaymentDialog = async (paymentType) => {
        setShowPaymentDialog(false);
        setPaymentType(paymentType);
        setShowConfirmPaymentDialog(true);
    };

    const hideShowConfirmPaymentDialog = () => {
        setShowConfirmPaymentDialog(false);
        setShowPaymentDialog(true);
    };

    const hideShowStripePaymentDialog = () => {
        setShowPaymentDialog(true);
        setShowStripePaymentDialog(false);
    };

    const showConfirmPaymentDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideShowConfirmPaymentDialog} style={{ marginTop: "10px" }} />
            <Button label="Si" icon="pi pi-check" onClick={createPayment} />
        </React.Fragment>
    );

    const ShowStripePaymentDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideShowStripePaymentDialog} style={{ marginTop: "10px" }} />
            <Button label="Si" icon="pi pi-check" onClick={""} />
        </React.Fragment>
    );

    return (
        <>
            <i className="pi pi-credit-card" style={{ fontSize: '1.8rem' }} onClick={onShowPaymentDialog} />

            <Dialog visible={showPaymentDialog} style={{ width: '90vw' }} header="Método de pago" modal onHide={hideShowPaymentDialog}
                className='footer-orders-pay-container'>
                <div className='paymentDialog-top-buttons'>
                    <Button icon="pi pi-credit-card" label='Tarjeta' className='mr-1 paymentDialog-button' onClick={() => onPaymentDialog(PAYMENT_TYPE.CARD)} />
                    <Button icon="pi pi-wallet" label='Efectivo' className='ml-1 paymentDialog-button' onClick={() => onPaymentDialog(PAYMENT_TYPE.CASH)} />
                </div>

                <div className='paymentDialog-bottom-buttons'>
                    <Button icon="pi pi-credit-card" label='Aplicación' className='paymentDialog-button' style={{ width: "49%" }} onClick={() => onPaymentDialog(PAYMENT_TYPE.APP)} />
                </div>
            </Dialog>

            <Dialog visible={showConfirmPaymentDialog} style={{ width: '90vw' }} header="Pedir cuenta" modal footer={showConfirmPaymentDialogFooter} onHide={hideShowConfirmPaymentDialog}
                className='dialog-payment-confirm-container'>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>¿Seguro que quieres realizar el pago con {paymentType === PAYMENT_TYPE.CARD ? "tarjeta" : paymentType === PAYMENT_TYPE.CASH ? "efectivo" : "la aplicación"}?</span>
                </div>
            </Dialog>

            <Dialog visible={showStripePaymentDialog} style={{ width: '90vw' }} header={`Pago mesa ${table?.number}`} modal onHide={hideShowStripePaymentDialog}>
                <div className="mt-4">
                    <StripePayment table={table} payment={payment} orders={orders} />
                </div>
            </Dialog>
        </>
    )
}
