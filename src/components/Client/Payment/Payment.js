import React, { useState, useEffect } from 'react';
import { useOrder, usePayment } from '../../../hooks';
import { PAYMENT_TYPE } from '../../../utils/constants';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { forEach, size } from 'lodash';
import './Payment.scss';

export function Payment(props) {

    const { table, isPaidToast, noOrdersToPaymentToast, requestedAccount } = props;

    const { createClientPayment, getPaymentByIdClient } = usePayment();
    const { orders, getOrdersByTableClient, addPaymentToOrderClient } = useOrder();

    const [refreshOrders, setRefreshOrders] = useState(false);
    const [ordersTable, setOrdersTable] = useState(null);
    const [paymentType, setPaymentType] = useState(null);
    const [paymentData, setPaymentData] = useState(null);
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [showConfirmPaymentDialog, setShowConfirmPaymentDialog] = useState(false);
    const [finishPaymentDialog, setFinishPaymentDialog] = useState(false);

    useEffect(() => {
        (async () => {
            if (table) {
                getOrdersByTableClient(table.tableBooking?.id);
            }
        })();
    }, [table, getOrdersByTableClient, refreshOrders]);

    useEffect(() => {
        if (orders) {
            setOrdersTable(orders);
        }
    }, [orders]);

    useEffect(() => {
        if (size(orders) > 0) {
            if (size(orders[0].payment) > 0) {
                (async () => {
                    const response = await getPaymentByIdClient(orders[0].payment.id);
                    setPaymentData(response);
                })();
            }
        }
    }, [orders, getPaymentByIdClient, refreshOrders]);

    const onRefresh = () => setRefreshOrders((state) => !state);

    const onShowPaymentDialog = () => {
        onRefresh();
        
        if (paymentData) {
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

        onRefresh();
        requestedAccount();
        setShowConfirmPaymentDialog(false);
    };

    const finishPayment = async () => {
        /*try {
          await closePayment(paymentData.id);
    
          for await (const order of orders) {
            await closeOrder(order.id);
          }
    
          await updateTable(table.id, { tableBooking: null });
          
          toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Pago finalizado correctamente', life: 3000 });
          history.push("/admin");
        } catch (error) {
          showError(error);
        }
        onRefreshOrders();*/
        setFinishPaymentDialog(false);
    };

    const onPaymentDialog = async (paymentType) => {
        setShowPaymentDialog(false);
        setShowConfirmPaymentDialog(true);
        setPaymentType(paymentType);
    };

    const hideShowConfirmPaymentDialog = () => {
        setShowConfirmPaymentDialog(false);
        setShowPaymentDialog(true);
    };

    const hideFinishPaymentDialog = () => {
        setFinishPaymentDialog(false);
    };

    const showConfirmPaymentDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideShowConfirmPaymentDialog} style={{ marginTop: "10px" }} />
            <Button label="Si" icon="pi pi-check" onClick={createPayment} />
        </React.Fragment>
    );

    const finishPaymentDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideFinishPaymentDialog} />
            <Button label="Si" icon="pi pi-check" onClick={finishPayment} />
        </React.Fragment>
    );

    return (
        <>
            <i className="pi pi-credit-card" style={{ fontSize: '1.8rem' }} onClick={onShowPaymentDialog} />

            <Dialog visible={showPaymentDialog} style={{ width: '90vw' }} header="Método de pago" modal onHide={hideShowPaymentDialog}>
                <div className='paymentDialog-top-buttons'>
                    <Button icon="pi pi-credit-card" label='Tarjeta' className='mr-1 paymentDialog-button' onClick={() => onPaymentDialog(PAYMENT_TYPE.CARD)} />
                    <Button icon="pi pi-wallet" label='Efectivo' className='ml-1 paymentDialog-button' onClick={() => onPaymentDialog(PAYMENT_TYPE.CASH)} />
                </div>

                <div className='paymentDialog-bottom-buttons'>
                    <Button icon="pi pi-credit-card" label='Aplicación' className='paymentDialog-button' style={{ width: "49%" }} onClick={() => onPaymentDialog(PAYMENT_TYPE.CARD)} />
                </div>
            </Dialog>

            <Dialog visible={showConfirmPaymentDialog} style={{ width: '90vw' }} header="Confirmar pago" modal footer={showConfirmPaymentDialogFooter} onHide={hideShowConfirmPaymentDialog}
                className='dialog-payment-confirm-container'>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>¿Seguro que quieres realizar el pago con {paymentType === PAYMENT_TYPE.CARD ? "tarjeta" : "efectivo"}?</span>
                </div>
            </Dialog>

            <Dialog visible={finishPaymentDialog} style={{ width: '90vw' }} header="Finalizar estancia en la mesa" modal footer={finishPaymentDialogFooter} onHide={hideFinishPaymentDialog}
                className='dialog-payment-confirm-container'>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>¿Seguro que deseas finalizar la estancia en la mesa?</span>
                </div>
            </Dialog>
        </>
    )
}
