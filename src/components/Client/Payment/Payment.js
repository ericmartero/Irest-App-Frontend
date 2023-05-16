import React, { useState, useEffect } from 'react';
import { useOrder, usePayment } from '../../../hooks';
import { PAYMENT_TYPE } from '../../../utils/constants';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { forEach, size } from 'lodash';
import moment from 'moment';
import 'moment/locale/es';
import './Payment.scss';

export function Payment(props) {

    const { table, isPaidToast } = props;

    const { createClientPayment, getPaymentByIdClient } = usePayment();
    const { orders, getOrdersByTableClient, addPaymentToOrderClient } = useOrder();

    const [refreshOrders, setRefreshOrders] = useState(false);
    const [ordersTable, setOrdersTable] = useState(null);
    const [paymentType, setPaymentType] = useState(null);
    const [paymentData, setPaymentData] = useState(null);
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [showConfirmPaymentDialog, setShowConfirmPaymentDialog] = useState(false);
    const [finishPaymentDialog, setFinishPaymentDialog] = useState(false);
    const [showBillDialog, setShowBillDialog] = useState(false);

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
        if (paymentData) {
            isPaidToast();
        }

        else {
            setShowPaymentDialog(true);
        }
    };

    const hideShowPaymentDialog = () => {
        setShowPaymentDialog(false);
    };

    const hideBillDialog = () => {
        setShowBillDialog(false);
        setShowConfirmPaymentDialog(false);
        setShowPaymentDialog(false);
    };

    const openDialogFinishPayment = () => {
        setFinishPaymentDialog(true);
        setShowBillDialog(false);
    };

    const formatCurrency = (value) => {
        return value?.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.product.price * rowData.quantity);
    };

    const groupOrdersStatus = (data) => {
        return data.reduce((acc, order) => {
            const existingOrder = acc.find((o) => o.product.id === order.product.id);
            if (existingOrder) {
                existingOrder.quantity += 1;
            } else {
                acc.push({ id: order.id, product: order.product, status: order.status, tableBooking: order.tableBooking, quantity: 1, createdAt: order.createdAt });
            }
            return acc;
        }, []);
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
        setShowConfirmPaymentDialog(true);
        setShowBillDialog(true);
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
        setShowBillDialog(true);
    };

    const showBillDialogFooter = (
        <div className='footerBill'>
            <Button label="Realizar el pago" onClick={openDialogFinishPayment} className="bttnFoot" />
        </div>
    );

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
                <div className='paymentDialog-container'>
                    <Button icon="pi pi-credit-card" label='Tarjeta' className='mr-1 paymentDialog-button' onClick={() => onPaymentDialog(PAYMENT_TYPE.CARD)} />
                    <Button icon="pi pi-wallet" label='Efectivo' className='ml-1 paymentDialog-button' onClick={() => onPaymentDialog(PAYMENT_TYPE.CASH)} />
                </div>
            </Dialog>

            <Dialog visible={showBillDialog} style={{ width: '90vw' }} header={`Cuenta Mesa ${table?.number}`} modal className='bill-dialog-container'
                footer={paymentType === PAYMENT_TYPE.CARD && showBillDialogFooter} onHide={hideBillDialog}>
                <div className='product-add-order'>
                    <div className='product-add-info'>
                        <span className="font-bold">{`MESA: ${table?.number}`}</span>
                    </div>
                    <div>
                        <span><strong>FECHA:</strong> {moment(paymentData?.createdAt).format('DD/MM/YYYY HH:mm:ss')}</span>
                    </div>
                </div>

                <div className='table-orders-payment' style={{ marginTop: '1.5rem' }}>
                    <DataTable value={ordersTable && groupOrdersStatus(ordersTable)} >
                        <Column field="quantity" header="UNIDADES" bodyStyle={{ textAlign: 'center' }}></Column>
                        <Column field="product.title" header="PRODUCTO" bodyStyle={{ textAlign: 'center' }}></Column>
                        <Column field="product.price" header="IMPORTE" body={priceBodyTemplate} bodyStyle={{ textAlign: 'center' }}></Column>
                    </DataTable>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between", marginTop: "2rem" }}>
                    <span className="font-bold">MÉTODO DE PAGO:</span>
                    <i className={classNames({
                        "pi pi-credit-card": paymentData?.paymentType === PAYMENT_TYPE.CARD,
                        "pi pi-wallet": paymentData?.paymentType === PAYMENT_TYPE.CASH
                    })} style={{ fontSize: '1.5rem' }}></i>
                    <span className="font-bold">TOTAL: {paymentData?.totalPayment.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</span>
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
