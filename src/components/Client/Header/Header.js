import React, { useState, useEffect } from 'react';
import { getProductShoppingCart } from '../../../api/shoppingCart';
import { ShoppingCart } from '../ShoppingCart';
import { useProduct } from '../../../hooks';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { size, forEach } from 'lodash';
import './Header.scss';

export function Header(props) {

    const { name, isMain, goBack, refreshCartNumber } = props;

    const { getProductById } = useProduct();
    const [totalPriceCart, setTotalPriceCart] = useState(0);
    const [showShoppingCartDialog, setShoppingCartDialog] = useState(false);
    const [refreshShoppingCart, setRefreshShoppingCart] = useState(false);
    const [products, setProducts] = useState(null);

    useEffect(() => {
        (async () => {
            const productsCart = getProductShoppingCart();

            const productsArray = [];
            for await (const idProduct of productsCart) {
                const response = await getProductById(idProduct);
                productsArray.push(response);
            }

            setProducts(productsArray);

        })();
    }, [refreshShoppingCart, getProductById]);

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

    const onRefresh = () => setRefreshShoppingCart((state) => !state);

    const hideShoppingCartDialog = () => {
        setShoppingCartDialog(false);
    };

    const onShoppingCart = () => {
        setShoppingCartDialog(true);
        onRefresh();
    };

    const showShoppingCartDialogFooter = (
        <div className='footerBill'>
            <Button 
                label={`Realizar pedido (${totalPriceCart})`} 
                className="bttnFoot" />
        </div>
    );

    return (
        <>
            {!products ?
                <div className="align-content-mobile">
                    <ProgressSpinner />
                </div>
                :
                <>
                    {isMain ?
                        <div className='header-main-container'>
                            <h2>{name}</h2>
                            <i className="pi pi-shopping-cart p-overlay-badge" style={{ fontSize: '1.8rem' }} onClick={onShoppingCart}>
                                <Badge value={size(products)}></Badge>
                            </i>
                        </div>
                        :
                        <div className='header-main-container'>
                            <div className='header-container'>
                                <i className="pi pi-arrow-left" style={{ fontSize: '1rem', marginRight: '1rem' }} onClick={goBack}></i>
                                <h2>{name}</h2>
                            </div>
                            <i className="pi pi-shopping-cart p-overlay-badge" style={{ fontSize: '1.8rem' }} onClick={onShoppingCart}>
                                <Badge value={size(products)}></Badge>
                            </i>
                        </div>
                    }

                    <Dialog visible={showShoppingCartDialog} style={{ width: '90vw' }} modal footer={size(products) !== 0 && showShoppingCartDialogFooter}
                        headerClassName='header_cart_color' header="Carrito" className='dialog-header-container' onHide={hideShoppingCartDialog}>
                        <>
                            {size(products) === 0
                                ? <p style={{ textAlign: "center", marginTop: "2rem" }}>No tienes productos en el carrito</p>
                                :
                                <>
                                    <ShoppingCart products={products} onRefresh={onRefresh} />
                                </>
                            }
                        </>
                    </Dialog>
                </>
            }
        </>
    )
}
