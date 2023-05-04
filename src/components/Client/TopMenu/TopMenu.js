import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks';
import { Button } from 'primereact/button';
import './TopMenu.scss';

export function TopMenu(props) {

  const { table, idTable } = props;

  const { logoutClient } = useAuth();

  return (
    <div className="layout-topbar layout-mobile">
      <div className="layout-topbar-left">
        <Link to={`/client/id_table=${idTable}`} className="layout-topbar-logo">
          <img src="https://res.cloudinary.com/djwjh0wpw/image/upload/v1679673058/icono-irest_gvyksj.png" alt="logo" className='layout-image' />
        </Link>
      </div>

      <div className="layout-topbar-center">
        <div className='layout-table'>
          {table && <b>MESA {table.number}</b>}
        </div>
      </div>

      <div className="layout-topbar-right">
        <Button icon="pi pi pi-bars" className="layout-button p-button-secondary mr-1" />
        <Button icon="pi pi-sign-out" className="layout-button p-button-secondary" onClick={logoutClient} />
      </div>
    </div>
  )
}
