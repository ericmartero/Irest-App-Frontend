import React from 'react';
import { removeProductShoppingCart } from '../../../api/shoppingCart';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { map } from 'lodash';
import './ShoppingCart.scss';

export function ShoppingCart(props) {

    const { products, onRefresh } = props;

    const uniqueProducts = products.reduce((acc, product) => {
        if (acc[product.id]) {
            acc[product.id].quantity += 1;
        } else {
            acc[product.id] = { ...product, quantity: 1 };
        }
        return acc;
    }, {});

    const productsCartList = Object.values(uniqueProducts);

    const removeProductCart = (productId) => {
        removeProductShoppingCart(productId);
        onRefresh();
    };

    return (
        <div>
            {map(productsCartList, (product) => (
                <div key={product.id} className='product_cart_container'>
                    <div className='content_cart_product'>
                        <img className="w-4 sm:w-8rem xl:w-8rem block xl:block border-round" src={product.image} alt={product.name} />
                        <div className='content_cart_product_info'>
                            <span className="font-bold text-900">{product.title}</span>
                            <span>{product.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                        </div>
                        <div className='content_cart_product_quantity'>
                            <Badge value={product.quantity}></Badge>
                        </div>
                    </div>
                    <Button
                        icon="pi pi-minus" className="layout-button-cart p-button-secondary"
                        style={{ flexShrink: 0 }}
                        onClick={() => removeProductCart(product.id)} />
                </div>
            ))}
        </div>
    )
}
