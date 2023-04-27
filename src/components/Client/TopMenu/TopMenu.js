import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks';
import { Button } from 'primereact/button';
import './TopMenu.scss';

export function TopMenu() {

  const { logoutClient } = useAuth();

  return (
    <div className="layout-topbar layout-mobile">
      <div className="layout-topbar-left">
        <Link to="/admin" className="layout-topbar-logo">
          <img src="https://res.cloudinary.com/djwjh0wpw/image/upload/v1679673058/icono-irest_gvyksj.png" alt="logo" className='layout-image' />
        </Link>
      </div>

      <div className="layout-topbar-center">
        <div className='layout-table'>
          <b>MESA 3</b>
        </div>
      </div>

      <div className="layout-topbar-right">
        <Button icon="pi pi-shopping-cart" className="layout-button p-button-secondary mr-1" />
        <Button icon="pi pi pi-bars" className="layout-button p-button-secondary mr-1" />
        <Button icon="pi pi-sign-out" className="layout-button p-button-secondary" onClick={logoutClient} />
      </div>
    </div>
  )
}
