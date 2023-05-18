import React, { useState, useEffect } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { forEach } from 'lodash';
import moment from 'moment';
import 'moment/locale/es';
import './StripePayment.scss';

export function StripePayment(props) {

    const { table, payment, orders } = props;

    //const stripe = useStripe();
    //const elements = useElements();

    const [totalPayment, setTotalPayment] = useState(null);

    useEffect(() => {
        let totalPayment = 0;

        forEach(orders, (order) => {
            totalPayment += order.product.price;
        });

        setTotalPayment(Number(totalPayment.toFixed(2)));
    }, [orders]);

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

    const formatCurrency = (value) => {
        return value?.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.product.price * rowData.quantity);
    };

    return (
        <>

            <div className='product-add-order'>
                <div className='product-add-info'>
                    <span className="font-bold">{`MESA: ${table?.number}`}</span>
                </div>
                <div>
                    <span><strong>FECHA:</strong> {moment(payment?.createdAt).format('DD/MM/YYYY HH:mm:ss')}</span>
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
                <i className={"pi pi-credit-card"} style={{ fontSize: "1.5rem" }}></i>
                <span className="font-bold ml-3">TOTAL: {totalPayment?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</span>
            </div>

            <div className='mt-4'>
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
                <Button label='Realizar el pago' />
            </div>
        </>
    );
}
