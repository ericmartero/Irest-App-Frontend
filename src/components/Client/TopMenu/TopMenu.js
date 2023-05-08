import React, { useState, useRef } from 'react';
import { getBookingKey } from '../../../utils/constants';
import { Link, useHistory } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import './TopMenu.scss';

export function TopMenu(props) {

  const { table, idTable } = props;
  
  const toast = useRef(null);
  const history = useHistory();
  const [showKeyDialog, setShowKeyDialog] = useState(false);

  const showError = (error) => {
    toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: error.message, life: 3000 });
  }

  const handleCopyKeyToClipboard = (text) => {
    const textToCopy = text;
    navigator.clipboard.writeText(textToCopy).then(() => {
      toast.current.show({ severity: 'success', summary: 'Operación Exitosa', detail: `Se ha copiado la contraseña en el portapapeles`, life: 1500 });
    }, (error) => {
      showError(error);
    });
  };

  const hideShowKeyDialog = () => {
    setShowKeyDialog(false);
  };

  const goOrdersTracking = () => {
    history.push(`/client/${idTable}/orders`);
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
        <Button icon="pi pi pi-book" className="layout-button p-button-secondary" onClick={goOrdersTracking} />
      </div>

      <Dialog visible={showKeyDialog} style={{ width: '90vw' }} header="Clave de la mesa" modal className='dialog-key-confirm-container' onHide={hideShowKeyDialog}>
        <Toast ref={toast} position="bottom-center" />
        <div className="showkey-container">
          <div className='key-container' onClick={() => handleCopyKeyToClipboard(getBookingKey())}>
            <span style={{ fontSize: '1.5rem' }}><b>{getBookingKey()}</b></span>
            <i className="pi pi-copy ml-2" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }} />
          </div>
        </div>
      </Dialog>
    </div>
  )
}
