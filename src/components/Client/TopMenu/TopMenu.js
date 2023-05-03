import React, { useState, useEffect } from 'react';
import { getProductShoppingCart } from '../../../api/shoppingCart';
import { Link } from 'react-router-dom';
import { useAuth, useProduct } from '../../../hooks';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { size, map } from 'lodash';
import './TopMenu.scss';

export function TopMenu(props) {

  const { logoutClient } = useAuth();
  const { getProductById } = useProduct();
  const [showShoppingCartDialog, setShoppingCartDialog] = useState(false);
  const [refreshShoppingCart, setRefreshShoppingCart] = useState(false);
  const [products, setProducts] = useState(null);

  const onRefresh = () => setRefreshShoppingCart((state) => !state);

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
  }, [refreshShoppingCart, getProductById])


  const hideShoppingCartDialog = () => {
    setShoppingCartDialog(false);
  };

  const onShoppingCart = () => {
    setShoppingCartDialog(true);
    onRefresh();
  };

  return (
    <>
      <div className="layout-topbar layout-mobile">
        <div className="layout-topbar-left">
          <Link to="/admin" className="layout-topbar-logo">
            <img src="https://res.cloudinary.com/djwjh0wpw/image/upload/v1679673058/icono-irest_gvyksj.png" alt="logo" className='layout-image' />
          </Link>
        </div>

        <div className="layout-topbar-center">
          <div className='layout-table'>
            <b>MESA {props.table?.number}</b>
          </div>
        </div>

        <div className="layout-topbar-right">
          <Button icon="pi pi-shopping-cart" className="layout-button p-button-secondary mr-1" onClick={onShoppingCart} />
          <Button icon="pi pi pi-bars" className="layout-button p-button-secondary mr-1" />
          <Button icon="pi pi-sign-out" className="layout-button p-button-secondary" onClick={logoutClient} />
        </div>


      </div>
      <Dialog visible={showShoppingCartDialog} style={{ width: '90vw' }} modal header="Carrito" onHide={hideShoppingCartDialog}>
        <>
          {!products ?
            <div className="align-container-dialog">
              <ProgressSpinner />
            </div>
            : size(products) === 0 ? (
              <p>No tienes productos en el carrito</p>
            ) : (
              <div>
                {map(products, (product) => (
                  <div key={product.id} className='product_container'>
                    <div className='content_product'>
                      <img className="w-4 sm:w-8rem xl:w-8rem block xl:block border-round" src={product.image} alt={product.name} />
                      <div className='content_product_info'>
                        <span className="font-bold text-900">{product.title}</span>
                        <span>{product.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                      </div>
                    </div>
                    <Button
                      icon="pi pi-plus" className="layout-button p-button-secondary mr-1"
                      style={{ flexShrink: 0 }}
                    />
                  </div>
                ))}
              </div>
            )
          }
        </>
      </Dialog>
    </>
  )
}
