import React, { useState, useEffect } from 'react';
import { usePayment } from '../../../hooks';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

export function PaymentsHistoryAdmin() {

    const { loading, payments, getPayments } = usePayment();
    const [paymentsHistory, setPaymentsHistory] = useState(null);
    const [expandedRows, setExpandedRows] = useState(null);

    useEffect(() => {
        getPayments();
    }, [])

    useEffect(() => {
        if (payments) {
            setPaymentsHistory(payments);
        }
    }, [payments]);

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

    const header = (
        <div className="table-header-container">
            <Button icon="pi pi-plus" label="Expand All" onClick={expandAll} className="mr-2 mb-2" />
            <Button icon="pi pi-minus" label="Collapse All" onClick={collapseAll} className="mb-2" />
        </div>
    );

    return (
        <div className="card">
            <DataTable value={paymentsHistory} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} responsiveLayout="scroll"
                rowExpansionTemplate={rowExpansionTemplate} dataKey="id" header={header}>
                <Column expander style={{ width: '3em' }} />
                <Column field="id" header="ID" />
                <Column field="tableBooking.table.number" header="Mesa" />
                <Column field="totalPayment" header="Total" sortable />
                <Column field="category" header="Método de pago" sortable />
                <Column field="createdAt" header="Fecha" sortable />
            </DataTable>
        </div>
    )
}
