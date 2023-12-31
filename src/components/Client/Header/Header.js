import React, { useState, useEffect, useRef } from 'react';
import { useProduct, useOrder, useTable } from '../../../hooks';
import { getProductShoppingCart, cleanProductShoppingCart } from '../../../api/shoppingCart';
import { PAYMENT_TYPE, ORDER_STATUS, PAYMENT_STATUS } from '../../../utils/constants';
import { ShoppingCart } from '../ShoppingCart';
import { useHistory } from 'react-router-dom';
import { classNames } from 'primereact/utils';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { size, forEach } from 'lodash';
import jsPDF from 'jspdf';
import moment from 'moment';
import 'moment/locale/es';
import './Header.scss';
import '../../../scss/Dialogs.scss';

export function Header(props) {

    const {
        name,
        isMain,
        isOrderTracking,
        goBack,
        refreshCartNumber,
        orders,
        table,
        onRefreshOrders,
        payment,
        setAutoRefreshEnabled
    } = props;

    const toast = useRef(null);
    const history = useHistory();
    const { getClientProductById } = useProduct();
    const { addClientOrderToTable } = useOrder();
    const { updateTableClient } = useTable();

    const [totalPriceCart, setTotalPriceCart] = useState(0);
    const [showShoppingCartDialog, setShoppingCartDialog] = useState(false);
    const [refreshShoppingCart, setRefreshShoppingCart] = useState(false);
    const [showAddOrderDialog, setShowAddOrderDialog] = useState(false);
    const [products, setProducts] = useState(null);
    const [showBillDialog, setShowBillDialog] = useState(false);
    const [finishPaymentDialog, setFinishPaymentDialog] = useState(false);
    const [showDownloadButtons, setShowDownloadButtons] = useState(true);
    const [loadingPDF, setLoadingPDF] = useState(false);
    const [allOrdersDelivered, setAllOrdersDelivered] = useState(false);

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
        onRefresh();
    }, [refreshCartNumber]);

    useEffect(() => {
        let ordersDelivered = 0;
        forEach(orders, (order) => {
            if (order.status === ORDER_STATUS.DELIVERED) {
                ordersDelivered += 1;
            }
        })

        if (size(orders) === ordersDelivered) {
            setAllOrdersDelivered(true);
        }

        else {
            setAllOrdersDelivered(false);
        }
    }, [orders])

    const downloadAccountPDF = () => {
        setShowDownloadButtons(false);
        setLoadingPDF(true);

        setTimeout(() => {
            const dialogElement = document.querySelector('.bill-dialog-container');
            const dialogWidth = dialogElement.offsetWidth;
            const dialogHeight = dialogElement.offsetHeight;

            const pdf = new jsPDF('p', 'pt', 'a4');

            const scaleFactor = pdf.internal.pageSize.getWidth() / dialogWidth;

            const pageCount = Math.ceil(dialogHeight / pdf.internal.pageSize.getHeight());

            for (let i = 0; i < pageCount; i++) {
                if (i > 0) {
                    pdf.addPage();
                }
                pdf.setPage(i + 1);
                pdf.html(dialogElement, {
                    x: 0,
                    y: -i * pdf.internal.pageSize.getHeight(),
                    width: pdf.internal.pageSize.getWidth(),
                    height: dialogHeight,
                    html2canvas: {
                        scale: scaleFactor,
                    },
                    callback: () => {
                        if (i === pageCount - 1) {
                            pdf.save(`Cuenta-Mesa${table?.number}-${moment(payment?.createdAt).format('DD/MM/YYYY')}${moment(payment?.createdAt).format('HH:mm:ss')}.pdf`);
                            setShowDownloadButtons(true);
                            setLoadingPDF(false);
                        }
                    },
                });
            }
        }, 100);
    };

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
            onRefreshOrders();
            toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: `Se ha realizado el pedido correctamente`, life: 1500 });
        } catch (error) {
            showError(error);
        }

        setShowAddOrderDialog(false);
    };

    const finishPayment = async () => {
        try {
            await updateTableClient(table.id, { tableBooking: null });

            history.push('/');
            localStorage.clear();
        } catch (error) {
            showError(error);
        }

        setFinishPaymentDialog(false);
    };

    const hideShoppingCartDialog = () => {
        setShoppingCartDialog(false);
    };

    const onShoppingCart = () => {
        setShoppingCartDialog(true);
        onRefresh();
    };

    const onShowBillDialog = () => {
        setShowBillDialog(true);
        if (typeof setAutoRefreshEnabled !== 'undefined') {
            setAutoRefreshEnabled(false);
        }
    };

    const hideShowAddOrderDialog = () => {
        setShowAddOrderDialog(false);
        setShoppingCartDialog(true);
    };

    const hideBillDialog = () => {
        setShowBillDialog(false);
        if (typeof setAutoRefreshEnabled !== 'undefined') {
            setAutoRefreshEnabled(true);
        }
    };

    const hideFinishPaymentDialog = () => {
        setFinishPaymentDialog(false);
        setShowBillDialog(true);
    };

    const showAddOrder = () => {
        setShowAddOrderDialog(true);
        setShoppingCartDialog(false);
    };

    const onFinishPayment = () => {
        if (!allOrdersDelivered) {
            toast.current.show({ severity: 'info', summary: 'Finalizar mesa', detail: `No se puede finalizar la mesa si hay pedidos pendientes`, life: 3000 });
        }

        else {
            setFinishPaymentDialog(true);
            setShowBillDialog(false);
        }
    };

    const showBillDialogSripePaymentFooter = (
        <div className='footerPayment-client'>
            <div>
                {showDownloadButtons && <Button label="Imprimir cuenta" className="bttnFoot" style={{ margin: 0, width: "80%" }} onClick={downloadAccountPDF} />}
            </div>
            <div>
                {showDownloadButtons && <Button label="Finalizar mesa" className="bttnFoot" severity="success" style={{ margin: 0, width: "80%" }} onClick={onFinishPayment} />}
            </div>
        </div>
    );

    const showBillDialogPaymentFooter = (
        <div className='footerBill'>
            {showDownloadButtons && <Button label="Imprimir cuenta" style={{ margin: 0 }} onClick={downloadAccountPDF} />}
        </div>
    );

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

    const finishPaymentDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className='mt-3' outlined onClick={hideFinishPaymentDialog} />
            <Button label="Si" icon="pi pi-check" onClick={finishPayment} />
        </React.Fragment>
    );

    return (
        <>
            <Toast ref={toast} position="bottom-center" />
            {isMain ?
                <div className='header-main-container'>
                    <div className='header-top-main-container'>
                        <h2>{name}</h2>
                        {!payment ?
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
                            <Button label='Cuenta' className="p-button-secondary button-payment" onClick={onShowBillDialog} />
                        }
                    </div>
                </div>
                :
                <div className='header-main-container'>
                    <div className='header-top-main-container'>
                        <div className='header-container'>
                            <i className="pi pi-arrow-left" style={{ fontSize: '1rem', marginRight: '1rem' }} onClick={goBack}></i>
                            <h2>{name}</h2>
                        </div>
                        {!payment ?
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
                            <Button label='Cuenta' className="p-button-secondary button-payment" onClick={onShowBillDialog} />
                        }
                    </div>
                    {isOrderTracking &&
                        <>
                            {payment?.statusPayment === PAYMENT_STATUS.PAID ?
                                <div className='header-bot-main-container'>
                                    <Tag icon="pi pi-euro" severity="success" value="PAGADO" />
                                </div>
                                : payment?.statusPayment === PAYMENT_STATUS.PENDING ?
                                    <div className='header-bot-main-container'>
                                        <Tag icon="pi pi-euro" severity="warning" value="PAGO PENDIENTE" />
                                    </div>
                                    : null
                            }
                        </>
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

            <Dialog visible={showBillDialog} style={{ width: '90vw' }} header={`Cuenta Mesa ${table?.number}`} modal onHide={hideBillDialog}
                footer={payment?.paymentType === PAYMENT_TYPE.CARD || payment?.paymentType === PAYMENT_TYPE.CASH ? showBillDialogPaymentFooter : showBillDialogSripePaymentFooter}
                className={classNames({
                    "bill-dialog-container hide-client-iconClose-onDonwload": !showDownloadButtons,
                    "bill-dialog-container show-client-iconClose-onDonwload": showDownloadButtons
                })}>
                {loadingPDF && <ProgressSpinner style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }} />}
                <div className='orders-account-info'>
                    <div className='product-add-info'>
                        <span className="font-bold mr-4">Mesa:</span>
                        <span className="font-bold">{`${table?.number}`}</span>
                    </div>
                    <div>
                        <div>
                            <span><strong>Fecha:</strong> {moment(payment?.createdAt).format('DD/MM/YYYY')}</span>
                        </div>
                        <div style={{ marginTop: "0.5rem" }}>
                            <span><strong>Hora:</strong> {moment(payment?.createdAt).format('HH:mm:ss')}</span>
                        </div>

                    </div>
                </div>

                <div className='table-orders-payment' style={{ marginTop: '0.5rem' }}>
                    <DataTable value={orders && groupOrdersStatus(orders)} >
                        <Column field="quantity" header="UNIDADES" bodyStyle={{ textAlign: 'center' }}></Column>
                        <Column field="product.title" header="PRODUCTO" bodyStyle={{ textAlign: 'center' }}></Column>
                        <Column field="product.price" header="IMPORTE" body={priceBodyTemplate} bodyStyle={{ textAlign: 'center' }}></Column>
                    </DataTable>
                </div>

                <div className='mt-3' style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="font-bold">Método de pago:</span>
                    {!showDownloadButtons ?
                        <>
                            {payment?.paymentType === PAYMENT_TYPE.CARD || payment?.paymentType === PAYMENT_TYPE.APP ?
                                <span className="font-bold ml-5">Tarjeta</span>
                                : <span className="font-bold ml-5"> Efectivo</span>
                            }
                        </>
                        :
                        <i className={classNames({
                            "pi pi-credit-card ml-5": payment?.paymentType === PAYMENT_TYPE.CARD || payment?.paymentType === PAYMENT_TYPE.APP,
                            "pi pi-wallet ml-5": payment?.paymentType === PAYMENT_TYPE.CASH
                        })} style={{ fontSize: '1.5rem' }}></i>
                    }
                </div>
                <div className={classNames({
                    "mt-2 mb-2": payment?.paymentType === PAYMENT_TYPE.CARD || payment?.paymentType === PAYMENT_TYPE.CASH,
                    "mt-2": payment?.paymentType === PAYMENT_TYPE.APP
                })}>
                    <span className="font-bold">TOTAL: </span>
                    <span className="font-bold" style={{ marginLeft: "6.5rem" }}>{payment?.totalPayment.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</span>
                </div>
            </Dialog>

            <Dialog visible={finishPaymentDialog} style={{ width: '90vw' }} header="Finalizar estancia" modal footer={finishPaymentDialogFooter} onHide={hideFinishPaymentDialog}
                className='dialog-payment-confirm-container'>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>¿Seguro que deseas finalizar la estancia en la mesa? <br /> Esta acción hará que se cierre el servicio de la mesa.</span>
                </div>
            </Dialog>
        </>
    )
}
