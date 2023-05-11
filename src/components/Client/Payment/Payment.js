import React, { useState, useEffect } from 'react';
import { useOrder, usePayment } from '../../../hooks';
import { PAYMENT_TYPE } from '../../../utils/constants';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from "primereact/checkbox";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { forEach, size } from 'lodash';
import moment from 'moment';
import 'moment/locale/es';
import './Payment.scss';

export function Payment(props) {

    const { table } = props;

    const { createClientPayment, getPaymentByIdClient } = usePayment();
    const { orders, getOrdersByTableClient, addPaymentToOrder } = useOrder();

    const [refreshOrders, setRefreshOrders] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [ordersTable, setOrdersTable] = useState(null);
    const [paymentType, setPaymentType] = useState(null);
    const [paymentData, setPaymentData] = useState(null);
    const [checked, setChecked] = useState(false);
    const [showProductsToPayDialog, setShowProductsToPayDialog] = useState(false);
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [showConfirmPaymentDialog, setShowConfirmPaymentDialog] = useState(false);
    const [finishPaymentDialog, setFinishPaymentDialog] = useState(false);
    const [showBillDialog, setShowBillDialog] = useState(false);
    const [noOrderPaymentDialog, setNoOrderPaymentDialog] = useState(false);

    useEffect(() => {
        (async () => {
            if (table) {
                getOrdersByTableClient(table.tableBooking?.id);
            }
        })();
    }, [table, getOrdersByTableClient, refreshOrders]);

    useEffect(() => {
        if (orders) {
            const filteredOrders = orders.filter(order => order.payment === null);
            setOrdersTable(filteredOrders);
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
    }, [orders, getPaymentByIdClient]);

    const onRefresh = () => setRefreshOrders((state) => !state);

    const onShowPaymentDialog = () => {

        if (size(orders) === 0) {
            setNoOrderPaymentDialog(true);
        }

        else {
            onRefresh();
            setShowProductsToPayDialog(true);
        }
    };

    const priceOrderTemplate = (rowData) => {
        return formatCurrency(rowData.product.price);
    };

    const imageBodyTemplate = (rowData) => {
        return <img src={rowData.product.image} alt={rowData.product.image} className="shadow-2 border-round" style={{ width: '50px' }} />;
    };

    const hideShowProductsToPayDialog = () => {
        setShowProductsToPayDialog(false);
    };

    const hideShowPaymentDialog = () => {
        setShowPaymentDialog(false);
        setShowProductsToPayDialog(true);
    };

    const hideBillDialog = () => {
        setShowBillDialog(false);
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

    const allProductsChecked = (e) => {
        if (e.checked) {
            setSelectedProducts(ordersTable);
        }

        else {
            setSelectedProducts(null);
        }

        setChecked(e.checked)
    }

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
            await addPaymentToOrder(order.id, payment.id);
        };

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

    const onProductsToPay = () => {
        setShowPaymentDialog(true);
        setShowProductsToPayDialog(false);
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

    const hideNoOrderPaymentDialog = () => {
        setNoOrderPaymentDialog(false);
    };

    const finishShowProductsToPayDialogFooter = (
        <div className='footerBill'>
            <Button label="Realizar el pago" className='mt-4' onClick={onProductsToPay} />
        </div>
    );

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

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <div style={{ display: "flex" }}>
                <Checkbox onChange={e => allProductsChecked(e)} checked={checked}></Checkbox>
                <span className="ml-3">Todos</span>
            </div>
            <Button label="Mis pedidos" className="p-button-secondary" />
        </div>
    );

    return (
        <>
            <i className="pi pi-credit-card" style={{ fontSize: '1.8rem' }} onClick={onShowPaymentDialog} />

            <Dialog visible={showProductsToPayDialog} style={{ width: '93vw' }} modal header="Selección de productos" onHide={hideShowProductsToPayDialog}
                footer={finishShowProductsToPayDialogFooter} className='footer-orders-pay-container'>
                <div className="footer-payment-content">
                    <DataTable className='table-orders-pay' value={ordersTable} selection={selectedProducts}
                        header={header} onSelectionChange={(e) => setSelectedProducts(e.value)}>
                        <Column selectionMode="multiple"></Column>
                        <Column field="product.image" body={imageBodyTemplate}></Column>
                        <Column field="product.title" style={{ minWidth: '6rem' }}></Column>
                        <Column field="product.price" body={priceOrderTemplate}></Column>
                    </DataTable>
                </div>
            </Dialog>

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
                    <DataTable value={orders && groupOrdersStatus(orders)} >
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
                    <span>¿Seguro que quieres realizar el pago de los pedidos seleccionados?</span>
                </div>
            </Dialog>

            <Dialog visible={finishPaymentDialog} style={{ width: '90vw' }} header="Finalizar estancia en la mesa" modal footer={finishPaymentDialogFooter} onHide={hideFinishPaymentDialog}
                className='dialog-payment-confirm-container'>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>¿Seguro que deseas finalizar la estancia en la mesa?</span>
                </div>
            </Dialog>

            <Dialog visible={noOrderPaymentDialog} style={{ width: '90vw' }} header={`Cuenta Mesa ${table?.number}`} modal onHide={hideNoOrderPaymentDialog}
                className='footer-noPayment-container'>
                <div className="footer-payment-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>No hay pedidos para poder realizar el pago</span>
                </div>
            </Dialog>
        </>
    )
}
