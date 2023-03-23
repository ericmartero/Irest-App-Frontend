import React, { useRef } from 'react';
import { useAuth } from '../../../hooks';
import { SlideMenu } from 'primereact/slidemenu';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { TieredMenu } from 'primereact/tieredmenu';
import classNames from 'classnames';
import './TopMenu.scss';


export function TopMenu(props) {

  const { logout, auth } = useAuth();
  const menu = useRef(null);

  const items = [
    {
      label: 'Cerrar sesión',
      icon: 'pi pi-fw pi-sign-out'
    }
  ];

  const renderName = () => {
    if (auth.me?.user.firstName && auth.me?.user.lastName) {
      return `${auth.me.user.firstName} ${auth.me.user.lastName}`;
    }

    return auth.me?.user.email;
  };

  return (
    <div className="layout-topbar">
      <div to="/" className="layout-topbar-logo">
        <img src="https://res.cloudinary.com/djwjh0wpw/image/upload/v1678621782/favicon_agaioz.png" alt="logo" />
        <span>PANEL DE CONTROL</span>
      </div>

      <button type="button" className="p-link  layout-menu-button layout-topbar-button" onClick={props.onToggleMenuClick} >
        <i className="pi pi-bars" />
      </button>

      <TieredMenu model={items} popup ref={menu} breakpoint="767px" />
      <button type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={(event) => menu.current.toggle(event)} >
        <i className="pi pi-user" />
      </button>

      <ul className={classNames("layout-topbar-menu lg:flex origin-top", { 'layout-topbar-menu-mobile-active': props.mobileTopbarMenuActive })}>
        <li style={{ display: "flex", alignItems: "center" }}>
          <Chip label={renderName()} icon="pi pi-user" className="mr-3" />
        </li>
        <li>
          <Button icon="pi pi-sign-out" className="p-button-rounded p-button-secondary mr-2" onClick={logout} />
        </li>
      </ul>
    </div>
  )
}
