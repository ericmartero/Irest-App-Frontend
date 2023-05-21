import React, { useState, useEffect, useRef } from 'react';
import { AccessDenied } from '../../AccessdDenied';
import { PAYMENT_TYPE } from '../../../utils/constants';
import { usePayment, useOrder } from '../../../hooks';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { ProgressSpinner } from 'primereact/progressspinner';
import moment from 'moment';
import 'moment/locale/es';

export function PaymentsHistoryAdmin() {

    const dt = useRef(null);
    const { loading, error, payments, getPayments } = usePayment();
    const { getOrdersByPayment } = useOrder();
    const [paymentsHistory, setPaymentsHistory] = useState(null);
    const [expandedRows, setExpandedRows] = useState(null);
    const [loadingUpdatePayments, setLoadingUpdatePayments] = useState(true);

    useEffect(() => {
        getPayments();
    }, [getPayments]);

    useEffect(() => {
        if (payments) {
            const updatePaymentsHistory = async () => {
                const updatedPaymentsHistory = await Promise.all(
                    payments.map(async (payment) => {
                        const orders = await getOrdersByPayment(payment.id);

                        const productsObject = {};
                        orders.forEach(order => {

                            if (order.product.id in productsObject) {
                                productsObject[order.product.id].quantity += 1;
                            } else {
                                productsObject[order.product.id] = {
                                    ...order.product,
                                    quantity: 1
                                };
                            }
                        });
                        const productsList = Object.values(productsObject);

                        return { ...payment, ordersProduct: productsList };
                    })
                );
                setPaymentsHistory(updatedPaymentsHistory);
                setLoadingUpdatePayments(false);
            };
            updatePaymentsHistory();
        }
    }, [payments, getOrdersByPayment]);

    const rowExpansionTemplate = (data) => {
        return (
            <>
                {loading && loadingUpdatePayments ? null
                    :
                    <div className="orders-subtable">
                        <div style={{ marginLeft: '4rem', marginRight: '4rem', marginBottom: '3rem' }}>
                            <h4>Pedidos del pago: {data.id}</h4>
                            <DataTable value={data.ordersProduct} responsiveLayout="scroll" showGridlines style={{ backgroundColor: 'blue-200' }}>
                                <Column field="quantity" header="Unidades" sortable></Column>
                                <Column field="title" header="Producto" sortable></Column>
                                <Column field="price" header="Importe" sortable body={priceBodyTemplate}></Column>
                            </DataTable>
                        </div>
                    </div>
                }
            </>
        );
    };

    const expandAll = () => {
        let _expandedRows = {};
        paymentsHistory.forEach(p => _expandedRows[`${p.id}`] = true);

        setExpandedRows(_expandedRows);
    };

    const collapseAll = () => {
        setExpandedRows(null);
    };

    const formatCurrency = (value) => {
        return value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
    };

    const priceTotalBodyTemplate = (rowData) => {
        return formatCurrency(rowData.totalPayment);
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.price * rowData.quantity);
    };

    const paidMethodBodyTemplate = (rowData) => {
        if (rowData.paymentType === PAYMENT_TYPE.CARD || rowData.paymentType === PAYMENT_TYPE.APP) {
            return <i className={"pi pi-credit-card"} style={{ fontSize: '1.5rem' }}></i>;
        }

        else {
            return <i className={"pi pi-wallet"} style={{ fontSize: '1.5rem' }}></i>;
        }
    };

    const dateBodyTemplate = (rowData) => {
        return moment(rowData.createdAt).format('DD/MM/YYYY HH:mm:ss');
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h3 className="m-0">PANEL DE HISTORIAL DE PAGOS</h3>
        </div>
    );

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button icon="pi pi-plus" label="Expandir todo" onClick={expandAll} className="mr-2 mb-2" />
                <Button icon="pi pi-minus" label="Contraer Todo" onClick={collapseAll} className="mb-2" />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    return (
        <div className="card">
            <>
                {error ? <AccessDenied /> :
                    <>
                        {loading && loadingUpdatePayments ?
                            <div className="align-container">
                                <ProgressSpinner />
                            </div>
                            :
                            <>
                                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                                <DataTable ref={dt} value={paymentsHistory} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} responsiveLayout="scroll"
                                    rowExpansionTemplate={rowExpansionTemplate} dataKey="id" header={header} emptyMessage="No se han encontrado pagos">
                                    <Column expander style={{ width: '3em' }} />
                                    <Column field="id" header="ID Pago" />
                                    <Column field="tableBooking.table.number" header="Mesa" sortable />
                                    <Column field="paymentType" header="Método de pago" body={paidMethodBodyTemplate} sortable />
                                    <Column field="totalPayment" header="Total" body={priceTotalBodyTemplate} sortable />
                                    <Column field="createdAt" header="Fecha" body={dateBodyTemplate} sortable />
                                </DataTable>
                            </>
                        }
                    </>
                }
            </>
        </div>
    )
}
