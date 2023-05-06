import React, { useState } from 'react';
import { getBookingKey } from '../../../utils/constants';
import { Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import './TopMenu.scss';

export function TopMenu(props) {

  const { table, idTable } = props;

  const [showKeyDialog, setShowKeyDialog] = useState(false);

  const hideShowKeyDialog = () => {
    setShowKeyDialog(false);
  };

  return (
    <div className="layout-topbar layout-mobile">
      <div className="layout-topbar-left">
        <Link to={`/client/id_table=${idTable}`} className="layout-topbar-logo">
          <img src="https://res.cloudinary.com/djwjh0wpw/image/upload/v1679673058/icono-irest_gvyksj.png" alt="logo" className='layout-image' />
        </Link>
      </div>

      <div className="layout-topbar-center">
        <div className='layout-table'>
          <b>MESA </b>
          {table && <b>{table.number}</b>}
        </div>
      </div>

      <div className="layout-topbar-right">
        <Button icon="pi pi-key" className="layout-button p-button-secondary mr-1" onClick={() => setShowKeyDialog(true)} />
        <Button icon="pi pi pi-bars" className="layout-button p-button-secondary" />
      </div>

      <Dialog visible={showKeyDialog} style={{ width: '90vw' }} header="Contraseña de la mesa" modal
        className='dialog-key-confirm-container' onHide={hideShowKeyDialog}>
        <div className="showkey-container">
          <div className='key-container'>
            <span style={{ fontSize: '1.5rem' }}><b>{getBookingKey()}</b></span>
            <i className="pi pi-copy ml-2" style={{ fontSize: '1.5rem' }} />
          </div>
        </div>
      </Dialog>
    </div>
  )
}
