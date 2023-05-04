import React, { useState, useEffect, useRef } from 'react';
import { useProduct, useOrder, useTable } from '../../../hooks';
import { getProductShoppingCart, cleanProductShoppingCart } from '../../../api/shoppingCart';
import { ShoppingCart } from '../ShoppingCart';
import { Toast } from 'primereact/toast';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { size, forEach } from 'lodash';
import './Header.scss';

export function Header(props) {

    const { name, isMain, goBack, refreshCartNumber, paramsURL } = props;

    const toast = useRef(null);
    const { getClientProductById } = useProduct();
    const { addClientOrderToTable } = useOrder();
    const { tables, getTableClient } = useTable();

    const [totalPriceCart, setTotalPriceCart] = useState(0);
    const [showShoppingCartDialog, setShoppingCartDialog] = useState(false);
    const [refreshShoppingCart, setRefreshShoppingCart] = useState(false);
    const [showAddOrderDialog, setShowAddOrderDialog] = useState(false);
    const [products, setProducts] = useState(null);
    const [table, setTable] = useState(null);

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
        onRefresh();
    }, [refreshCartNumber]);

    const onRefresh = () => setRefreshShoppingCart((state) => !state);

    const showError = (error) => {
        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: error.message, life: 1500 });
    }

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

                    {products ?
                        <i className="pi pi-shopping-cart p-overlay-badge shoppingCart-icon" onClick={onShoppingCart}>
                            <Badge value={size(products)}></Badge>
                        </i>
                        :
                        <i className="pi pi-shopping-cart p-overlay-badge shoppingCart-icon" onClick={onShoppingCart} />
                    }
                </div>
                :
                <div className='header-main-container'>
                    <div className='header-container'>
                        <i className="pi pi-arrow-left" style={{ fontSize: '1rem', marginRight: '1rem' }} onClick={goBack}></i>
                        <h2>{name}</h2>
                    </div>

                    {products ?
                        <i className="pi pi-shopping-cart p-overlay-badge shoppingCart-icon" onClick={onShoppingCart}>
                            <Badge value={size(products)}></Badge>
                        </i>
                        :
                        <i className="pi pi-shopping-cart p-overlay-badge shoppingCart-icon" onClick={onShoppingCart} />
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
        </>
    )
}
