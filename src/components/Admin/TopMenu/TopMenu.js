import React from 'react';
import { useAuth } from '../../../hooks';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import './TopMenu.scss';

export function TopMenu() {

  const { logout } = useAuth();

  return (
    <div className="layout-topbar">
      <div to="/" className="layout-topbar-logo">
        <img src="https://res.cloudinary.com/djwjh0wpw/image/upload/v1678621782/favicon_agaioz.png" alt="logo" />
        <span>PANEL DE CONTROL</span>
      </div>

      <button type="button" className="p-link  layout-menu-button layout-topbar-button" >
        <i className="pi pi-bars" />
      </button>

      <button type="button" className="p-link layout-topbar-menu-button layout-topbar-button" >
        <i className="pi pi-user" />
      </button>

      <ul className="layout-topbar-menu lg:flex origin-top">
        <li style={{ display: "flex", alignItems: "center" }}>
          <Chip label="Eric Mengual" icon="pi pi-user" className="mr-3" />
        </li>
        <li>
          <Button icon="pi pi-sign-out" className="p-button-rounded p-button-danger mr-2" onClick={logout} />
        </li>
      </ul>
    </div>
  )
}
