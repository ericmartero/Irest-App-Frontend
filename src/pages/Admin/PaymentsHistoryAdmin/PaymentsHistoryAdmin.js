import React, { useState, useEffect } from 'react';
import { PAYMENT_TYPE } from '../../../utils/constants';
import { usePayment, useOrder } from '../../../hooks';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import moment from 'moment';
import 'moment/locale/es';

export function PaymentsHistoryAdmin() {

    const { loading, payments, getPayments } = usePayment();
    const { getOrdersByPayment } = useOrder();
    const [paymentsHistory, setPaymentsHistory] = useState(null);
    const [expandedRows, setExpandedRows] = useState(null);

    useEffect(() => {
        getPayments();
    }, [getPayments])

    useEffect(() => {
        if (payments) {
            const updatePaymentsHistory = async () => {
                const updatedPaymentsHistory = await Promise.all(
                    payments.map(async (payment) => {
                        const orders = await getOrdersByPayment(payment.id);
                        return { ...payment, ordersProduct: orders };
                    })
                );
                setPaymentsHistory(updatedPaymentsHistory);
            };
            updatePaymentsHistory();
        }
    }, [payments, getOrdersByPayment]);

    const rowExpansionTemplate = (data) => {
        return (
            <div className="orders-subtable">
                <h4>Pedidos</h4>
                <DataTable value={data.orders} responsiveLayout="scroll">
                    <Column field="id" header="Id" sortable></Column>
                    <Column field="customer" header="Customer" sortable></Column>
                    <Column field="date" header="Date" sortable></Column>
                </DataTable>
            </div>
        );
    }

    const expandAll = () => {
        let _expandedRows = {};
        paymentsHistory.forEach(p => _expandedRows[`${p.id}`] = true);

        setExpandedRows(_expandedRows);
    }

    const collapseAll = () => {
        setExpandedRows(null);
    }

    const formatCurrency = (value) => {
        return value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.totalPayment);
    };

    const paidMethodBodyTemplate = (rowData) => {
        if (rowData.paymentType === PAYMENT_TYPE.CARD) {
            return <i className={"pi pi-credit-card"} style={{ fontSize: '1.5rem' }}></i>;
        }

        else {
            return <i className={"pi pi-wallet"} style={{ fontSize: '1.5rem' }}></i>;
        }
    };

    const dateBodyTemplate = (rowData) => {
        return moment(rowData.createdAt).format('DD/MM/YYYY HH:mm:ss');
    };

    const header = (
        <div className="table-header-container">
            <Button icon="pi pi-plus" label="Expandir todo" onClick={expandAll} className="mr-2 mb-2" />
            <Button icon="pi pi-minus" label="Contraer Todo" onClick={collapseAll} className="mb-2" />
        </div>
    );

    return (
        <div className="card">
            {loading ?
                <div className="align-container">
                    <ProgressSpinner />
                </div>
                :
                <DataTable value={paymentsHistory} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} responsiveLayout="scroll"
                    rowExpansionTemplate={rowExpansionTemplate} dataKey="id" header={header}>
                    <Column expander style={{ width: '3em' }} />
                    <Column field="id" header="ID Pago" />
                    <Column field="tableBooking.table.number" header="Mesa" sortable />
                    <Column field="paymentType" header="Método de pago" body={paidMethodBodyTemplate} sortable />
                    <Column field="totalPayment" header="Total" body={priceBodyTemplate} sortable />
                    <Column field="createdAt" header="Fecha" body={dateBodyTemplate} sortable />
                </DataTable>
            }
        </div>
    )
}
