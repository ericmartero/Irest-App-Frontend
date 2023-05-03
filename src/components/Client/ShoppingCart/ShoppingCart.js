import React from 'react';
import { Badge } from 'primereact/badge';
import { map } from 'lodash';
import './ShoppingCart.scss';

export function ShoppingCart(props) {
    return (
        <div>
            {map(props.products, (product) => (
                <div key={product.id} className='product_cart_container'>
                    <div className='content_cart_product'>
                        <img className="w-4 sm:w-8rem xl:w-8rem block xl:block border-round" src={product.image} alt={product.name} />
                        <div className='content_cart_product_info'>
                            <span className="font-bold text-900">{product.title}</span>
                            <span>{product.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                        </div>
                        <div className='content_cart_product_quantity'>
                            <Badge value="2"></Badge>
                        </div>
                    </div>
                    <i className="pi pi-times"></i>
                </div>
            ))}
        </div>
    )
}
