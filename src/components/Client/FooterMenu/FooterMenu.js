import React, { useState, useEffect, useRef } from 'react';
import { getBookingKey } from '../../../utils/constants';
import { PAYMENT_TYPE } from '../../../utils/constants';
import { useOrder, useTable, usePayment, useTableBooking } from '../../../hooks';
import { useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { classNames } from 'primereact/utils';
import { Checkbox } from "primereact/checkbox";
import { forEach, size } from 'lodash';
import QRCode from 'react-qr-code';
import moment from 'moment';
import 'moment/locale/es';
import './FooterMenu.scss';

export function FooterMenu(props) {

    const { idTable } = props;

    const toast = useRef(null);
    const paramsURL = useParams();
    const { changeAlertClient } = useTableBooking();
    const { createClientPayment, getPaymentByIdClient } = usePayment();
    const { tables, getTableClient } = useTable();
    const { orders, getOrdersByTableClient, addPaymentToOrder } = useOrder();

    const [showTableBookingQRDialog, setShowTableBookingQRDialog] = useState(false);
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [showConfirmPaymentDialog, setShowConfirmPaymentDialog] = useState(false);
    const [finishPaymentDialog, setFinishPaymentDialog] = useState(false);
    const [noOrderPaymentDialog, setNoOrderPaymentDialog] = useState(false);
    const [warnWaiterDialog, setWarnWaiterDialog] = useState(false);
    const [showBillDialog, setShowBillDialog] = useState(false);
    const [showProductsToPayDialog, setShowProductsToPayDialog] = useState(false);
    const [table, setTable] = useState(null);
    const [ordersTable, setOrdersTable] = useState(null);
    const [paymentType, setPaymentType] = useState(null);
    const [paymentData, setPaymentData] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [refreshOrders, setRefreshOrders] = useState(false);
    const [checked, setChecked] = useState(false);

    const onRefresh = () => setRefreshOrders((state) => !state);

    useEffect(() => {
        getTableClient(paramsURL.idTable);
    }, [paramsURL.idTable, getTableClient]);

    useEffect(() => {
        if (tables) {
            setTable(tables);
        }
    }, [tables]);

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

    const showError = (error) => {
        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: error.message, life: 1500 });
    }

    const hideShowTableBookingQRDialog = () => {
        setShowTableBookingQRDialog(false);
    };

    const hideShowPaymentDialog = () => {
        setShowPaymentDialog(false);
        setShowProductsToPayDialog(true);
    };

    const hideShowConfirmPaymentDialog = () => {
        setShowConfirmPaymentDialog(false);
        setShowPaymentDialog(true);
    };

    const onPaymentDialog = async (paymentType) => {
        setShowPaymentDialog(false);
        setShowConfirmPaymentDialog(true);
        setPaymentType(paymentType);
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

    const hideBillDialog = () => {
        setShowBillDialog(false);
    };

    const hideFinishPaymentDialog = () => {
        setFinishPaymentDialog(false);
        setShowBillDialog(true);
    };

    const hideNoOrderPaymentDialog = () => {
        setNoOrderPaymentDialog(false);
    };

    const hideWarnWaiterDialog = () => {
        setWarnWaiterDialog(false);
    };

    const hideShowProductsToPayDialog = () => {
        setShowProductsToPayDialog(false);
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

    const priceOrderTemplate = (rowData) => {
        return formatCurrency(rowData.product.price);
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

    const onShowPaymentDialog = () => {
        if (size(orders) === 0) {
            setNoOrderPaymentDialog(true);
        }

        else {
            //setShowPaymentDialog(true);
            onRefresh();
            setShowProductsToPayDialog(true);
        }
    };

    const warnWaiter = async () => {
        try {
            await changeAlertClient(table.tableBooking.id, true);
            toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: `Se ha llamado al camarero correctamente`, life: 1500 });
        } catch (error) {
            showError(error);
        }

        setWarnWaiterDialog(false);
    };

    const imageBodyTemplate = (rowData) => {
        return <img src={rowData.product.image} alt={rowData.product.image} className="shadow-2 border-round" style={{ width: '50px' }} />;
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

    const onProductsToPay = () => {
        setShowPaymentDialog(true);
        setShowProductsToPayDialog(false);
    };

    const showConfirmPaymentDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideShowConfirmPaymentDialog} style={{ marginTop: "10px" }} />
            <Button label="Si" icon="pi pi-check" onClick={createPayment} />
        </React.Fragment>
    );

    const showBillDialogFooter = (
        <div className='footerBill'>
            <Button label="Realizar el pago" onClick={openDialogFinishPayment} className="bttnFoot" />
        </div>
    );

    const finishPaymentDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideFinishPaymentDialog} />
            <Button label="Si" icon="pi pi-check" onClick={finishPayment} />
        </React.Fragment>
    );

    const finishwarnWaiterDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className='mt-3' outlined onClick={hideWarnWaiterDialog} />
            <Button label="Si" icon="pi pi-check" onClick={warnWaiter} />
        </React.Fragment>
    );

    const finishShowProductsToPayDialogFooter = (
        <div className='footerBill'>
            <Button label="Realizar el pago" className='mt-4 bttnFoot' onClick={onProductsToPay} />
        </div>
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
            <Toast ref={toast} position="bottom-center" />
            <div>
                <div className='fixed-button-container'>
                    <Button icon="pi pi-qrcode" className='footer-qr-button' rounded onClick={() => setShowTableBookingQRDialog(true)} />
                </div>
                <div className="footer-container">
                    <i className="pi pi-bell" style={{ fontSize: '1.8rem' }} onClick={() => setWarnWaiterDialog(true)} />
                    <i className="pi pi-credit-card" style={{ fontSize: '1.8rem' }} onClick={onShowPaymentDialog} />
                </div>
            </div>

            <Dialog visible={showTableBookingQRDialog} style={{ width: '90vw' }} header="Código QR de invitación" modal onHide={hideShowTableBookingQRDialog}>
                <div className='header-qrDialog-container'>
                    {idTable && <QRCode value={`https://irest.netlify.app/client-invite/id_table=${idTable}&key=${getBookingKey()}`} />}
                </div>
            </Dialog>

            <Dialog visible={showPaymentDialog} style={{ width: '90vw' }} header="Método de pago" modal onHide={hideShowPaymentDialog}>
                <div className='paymentDialog-container'>
                    <Button icon="pi pi-credit-card" label='Tarjeta' className='mr-1 paymentDialog-button' onClick={() => onPaymentDialog(PAYMENT_TYPE.CARD)} />
                    <Button icon="pi pi-wallet" label='Efectivo' className='ml-1 paymentDialog-button' onClick={() => onPaymentDialog(PAYMENT_TYPE.CASH)} />
                </div>
            </Dialog>

            <Dialog visible={showConfirmPaymentDialog} style={{ width: '90vw' }} header="Confirmar pago" modal footer={showConfirmPaymentDialogFooter} onHide={hideShowConfirmPaymentDialog}
                className='dialog-payment-confirm-container'>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>¿Seguro que quieres realizar el pago de los pedidos seleccionados?</span>
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

            <Dialog visible={warnWaiterDialog} style={{ width: '90vw' }} modal header="Avisar al Camarero" onHide={hideWarnWaiterDialog} className='footer-warnWaiter-container'
                footer={finishwarnWaiterDialogFooter}>
                <div className="footer-payment-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>¿Seguro que quieres llamar a un camarero?</span>
                </div>
            </Dialog>

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
        </>
    )
}
