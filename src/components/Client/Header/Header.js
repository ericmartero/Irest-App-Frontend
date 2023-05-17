import React, { useState, useEffect, useRef } from 'react';
import { useProduct, useOrder, useTable, usePayment } from '../../../hooks';
import { getProductShoppingCart, cleanProductShoppingCart } from '../../../api/shoppingCart';
import { PAYMENT_TYPE } from '../../../utils/constants';
import { ShoppingCart } from '../ShoppingCart';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { size, forEach } from 'lodash';
import moment from 'moment';
import 'moment/locale/es';
import './Header.scss';

export function Header(props) {

    const { name, isMain, goBack, refreshCartNumber, paramsURL } = props;

    const toast = useRef(null);
    const { getClientProductById } = useProduct();
    const { orders, getOrdersByTableClient, addClientOrderToTable } = useOrder();
    const { tables, getTableClient } = useTable();
    const { getPaymentByIdClient } = usePayment();

    const [totalPriceCart, setTotalPriceCart] = useState(0);
    const [showShoppingCartDialog, setShoppingCartDialog] = useState(false);
    const [refreshShoppingCart, setRefreshShoppingCart] = useState(false);
    const [showAddOrderDialog, setShowAddOrderDialog] = useState(false);
    const [products, setProducts] = useState(null);
    const [table, setTable] = useState(null);
    const [paymentData, setPaymentData] = useState(null);
    const [ordersTable, setOrdersTable] = useState(null);
    const [showBillDialog, setShowBillDialog] = useState(false);

    useEffect(() => {
        (async () => {
            const productsCart = getProductShoppingCart();

            const productsArray = [];
            for await (const idProduct of productsCart) {
                const response = await getClientProductById(idProduct);
                productsArray.push(response);
            }

            setProducts(productsArray);

        })();
    }, [refreshShoppingCart, getClientProductById]);

    useEffect(() => {
        let totalPriceCart = 0;

        forEach(products, (product) => {
            totalPriceCart += product.price;
        })

        setTotalPriceCart(totalPriceCart.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }));
    }, [products]);

    useEffect(() => {
        getTableClient(paramsURL.idTable);
    }, [paramsURL.idTable, getTableClient]);

    useEffect(() => {
        if (tables) {
            setTable(tables);
        }
    }, [tables])

    useEffect(() => {
        (async () => {
            if (table) {
                getOrdersByTableClient(table.tableBooking?.id);
            }
        })();
    }, [table, getOrdersByTableClient]);

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
    }, [orders, getPaymentByIdClient]);

    useEffect(() => {
        onRefresh();
    }, [refreshCartNumber]);

    const onRefresh = () => setRefreshShoppingCart((state) => !state);

    const showError = (error) => {
        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: error.message, life: 1500 });
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

    const addOrder = async () => {
        try {
            for await (const product of products) {
                await addClientOrderToTable(table.tableBooking.id, product.id);
            }
            cleanProductShoppingCart();
            onRefresh();
            toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: `Se ha realizado el pedido correctamente`, life: 1500 });
        } catch (error) {
            showError(error);
        }

        setShowAddOrderDialog(false);
    };

    const showBillDialogFooter = (
        <div className='footerBill'>
            <Button label="Finalizar estancia en la mesa" className="bttnFoot" />
        </div>
    );

    const hideShoppingCartDialog = () => {
        setShoppingCartDialog(false);
    };

    const onShoppingCart = () => {
        setShoppingCartDialog(true);
        onRefresh();
    };

    const hideShowAddOrderDialog = () => {
        setShowAddOrderDialog(false);
        setShoppingCartDialog(true);
    };

    const hideBillDialog = () => {
        setShowBillDialog(false);
    };

    const showAddOrder = () => {
        setShowAddOrderDialog(true);
        setShoppingCartDialog(false);
    };

    const showAddOrderDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideShowAddOrderDialog} style={{ marginTop: "10px" }} />
            <Button label="Si" icon="pi pi-check" onClick={addOrder} />
        </React.Fragment>
    );

    const showShoppingCartDialogFooter = (
        <div className='footerBill'>
            <Button label={`Realizar pedido (${totalPriceCart})`} className="bttnFoot" onClick={showAddOrder} />
        </div>
    );

    return (
        <>
            <Toast ref={toast} position="bottom-center" />
            {isMain ?
                <div className='header-main-container'>
                    <h2>{name}</h2>
                    {!paymentData ?
                        <>
                            {products ?
                                <i className="pi pi-shopping-cart p-overlay-badge shoppingCart-icon" onClick={onShoppingCart}>
                                    <Badge value={size(products)}></Badge>
                                </i>
                                :
                                <i className="pi pi-shopping-cart p-overlay-badge shoppingCart-icon" onClick={onShoppingCart} />
                            }
                        </>
                        :
                        <Button label='Cuenta' className="p-button-secondary button-payment" onClick={() => setShowBillDialog(true)} />
                    }
                </div>
                :
                <div className='header-main-container'>
                    <div className='header-container'>
                        <i className="pi pi-arrow-left" style={{ fontSize: '1rem', marginRight: '1rem' }} onClick={goBack}></i>
                        <h2>{name}</h2>
                    </div>
                    {!paymentData ?
                        <>
                            {products ?
                                <i className="pi pi-shopping-cart p-overlay-badge shoppingCart-icon" onClick={onShoppingCart}>
                                    <Badge value={size(products)}></Badge>
                                </i>
                                :
                                <i className="pi pi-shopping-cart p-overlay-badge shoppingCart-icon" onClick={onShoppingCart} />
                            }
                        </>
                        :
                        <Button label='Cuenta' className="p-button-secondary button-payment" onClick={() => setShowBillDialog(true)} />
                    }
                </div>
            }

            <Dialog visible={showShoppingCartDialog} style={{ width: '90vw' }} modal footer={size(products) !== 0 && showShoppingCartDialogFooter}
                headerClassName='header_cart_color' header="Carrito de pedidos" className='dialog-header-container' onHide={hideShoppingCartDialog}>
                <>
                    {size(products) === 0
                        ? <p style={{ textAlign: "center" }}>No tienes productos en el carrito</p>
                        :
                        <>
                            <ShoppingCart products={products} onRefresh={onRefresh} />
                        </>
                    }
                </>
            </Dialog>

            <Dialog visible={showAddOrderDialog} style={{ width: '90vw' }} header="Confirmar pedido" modal
                className='dialog-header-confirm-container' footer={showAddOrderDialogFooter} onHide={hideShowAddOrderDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>Seguro que quieres realizar el pedido?</span>
                </div>
            </Dialog>

            <Dialog visible={showBillDialog} style={{ width: '90vw' }} header={`Cuenta Mesa ${table?.number}`} modal className='bill-dialog-container'
                footer={showBillDialogFooter} onHide={hideBillDialog}>
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
        </>
    )
}
