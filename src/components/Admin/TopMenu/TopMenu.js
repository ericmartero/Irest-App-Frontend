import React, { useRef } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useAuth } from '../../../hooks';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { TieredMenu } from 'primereact/tieredmenu';
import classNames from 'classnames';
import { Avatar } from 'primereact/avatar';
import './TopMenu.scss';


export function TopMenu(props) {

  const { logout, auth } = useAuth();
  const menu = useRef(null);
  const history = useHistory();

  const renderName = () => {
    if (auth.me?.user.firstName && auth.me?.user.lastName) {
      return `${auth.me.user.firstName} ${auth.me.user.lastName}`;
    }

    return auth.me?.user.email;
  };

  const initialsUser = (firstName, lastName) => {

    let initials;

    if (lastName === null) {
      initials = `${firstName.charAt(0)}`;
    }

    else {
      initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;
    }
    
    return initials;
  }

  const items = [
    {
      label: 'Cerrar sesión',
      icon: 'pi pi-fw pi-sign-out',
      command: () => {
        logout();
      }
    }
  ];

  const renderHome = () => {
    history.push("/admin");
  }

  return (
    <div className="layout-topbar">
      <Link onClick={renderHome} className="layout-topbar-logo">
        <img src="https://res.cloudinary.com/djwjh0wpw/image/upload/v1679673058/icono-irest_gvyksj.png" alt="logo" />
        <span>PANEL DE CONTROL</span>
      </Link>

      <button type="button" className="p-link  layout-menu-button layout-topbar-button" onClick={props.onToggleMenuClick} >
        <i className="pi pi-bars" />
      </button>

      <TieredMenu model={items} popup ref={menu} breakpoint="767px" />
      <Avatar label={initialsUser(auth.me?.user.firstName, auth.me?.user.lastName)} className="mr-2 layout-topbar-menu-button" size="large" shape="circle"  onClick={(event) => menu.current.toggle(event)}/>

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
