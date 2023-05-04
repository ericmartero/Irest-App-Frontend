import React, { useState, useEffect } from 'react';
import { getProductShoppingCart } from '../../../api/shoppingCart';
import { ShoppingCart } from '../ShoppingCart';
import { useProduct } from '../../../hooks';
import { Badge } from 'primereact/badge';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { size } from 'lodash';
import './Header.scss';

export function Header(props) {

    const { name, isMain, goBack } = props;

    const { getProductById } = useProduct();
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

    const onRefresh = () => setRefreshShoppingCart((state) => !state);

    const hideShoppingCartDialog = () => {
        setShoppingCartDialog(false);
    };

    const onShoppingCart = () => {
        setShoppingCartDialog(true);
        onRefresh();
    };

    return (
        <>
            {isMain ?
                <div className='header-main-container'>
                    <h2>{name}</h2>
                    <i className="pi pi-shopping-cart p-overlay-badge" style={{ fontSize: '1.8rem' }} onClick={onShoppingCart}>
                        <Badge value="2"></Badge>
                    </i>
                </div>
                :
                <div className='header-main-container'>
                    <div className='header-container'>
                        <i className="pi pi-arrow-left" style={{ fontSize: '1rem', marginRight: '1rem' }} onClick={goBack}></i>
                        <h2>{name}</h2>
                    </div>
                    <i className="pi pi-shopping-cart p-overlay-badge" style={{ fontSize: '1.8rem' }} onClick={onShoppingCart}>
                        <Badge value="2"></Badge>
                    </i>
                </div>
            }

            <Dialog visible={showShoppingCartDialog} style={{ width: '90vw' }} modal
                headerClassName='header_cart_color' header="Carrito" onHide={hideShoppingCartDialog}>
                <>
                    {!products ?
                        <div className="align-container-dialog">
                            <ProgressSpinner />
                        </div>
                        : size(products) === 0 ? (
                            <p style={{ textAlign: "center", marginTop: "2rem" }}>No tienes productos en el carrito</p>
                        ) : (
                            <ShoppingCart products={products} onRefresh={onRefresh} />
                        )
                    }
                </>
            </Dialog>
        </>
    )
}
