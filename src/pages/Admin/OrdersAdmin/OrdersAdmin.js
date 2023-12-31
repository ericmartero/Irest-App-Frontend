import React, { useState, useEffect, useRef } from 'react';
import { ORDER_STATUS, PAYMENT_STATUS, PAYMENT_TYPE } from '../../../utils/constants';
import { useHistory } from 'react-router-dom';
import { size } from 'lodash';
import { useTable, useTableBooking } from '../../../hooks';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Tag } from 'primereact/tag';
import QRCode from 'react-qr-code';
import './OrdersAdmin.scss';
import '../../../scss/Dialogs.scss';

export function OrdersAdmin() {

  const toast = useRef(null);
  const intervalRef = useRef();
  const history = useHistory();
  const { loading, tables, getTables } = useTable();
  const { resetKey, reserveTable, changeAlert } = useTableBooking();

  const [refreshTables, setRefreshTables] = useState(false);
  const [tablesCrud, setTablesCrud] = useState([]);
  const [layout, setLayout] = useState('grid');
  const [resetkeyDialog, setResetKeyDialog] = useState(false);
  const [reserveTableDialog, setReserveTableDialog] = useState(false);
  const [tableSelected, setTableSelected] = useState(null);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [showTableBookingQRDialog, setShowTableBookingQRDialog] = useState(false);
  const [newKey, setNewKey] = useState(null);

  const [showIcon, setShowIcon] = useState(true);


  const onRefresh = () => setRefreshTables((state) => !state);

  useEffect(() => {
    const autoRefreshTables = () => {
      onRefresh();
    }

    if (autoRefreshEnabled) {
      intervalRef.current = setInterval(autoRefreshTables, 10000);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [autoRefreshEnabled]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowIcon((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getTables();
  }, [getTables, refreshTables])

  useEffect(() => {
    if (tables) {
      const filteredTables = tables.filter(table => table.active);
      filteredTables.sort((a, b) => {
        if (a.tableBooking != null && b.tableBooking == null) {
          return -1;
        } else if (a.tableBooking == null && b.tableBooking != null) {
          return 1;
        } else {
          return 0;
        }
      });
      setTablesCrud(filteredTables);
    }
  }, [tables]);

  const showError = (error) => {
    toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: error.message, life: 3000 });
  }

  const hideResetKeyDialog = () => {
    setResetKeyDialog(false);
    setAutoRefreshEnabled(true);
  };

  const hideReserveTableDialog = () => {
    setReserveTableDialog(false);
    setAutoRefreshEnabled(true);
  };

  const getSeverity = (table) => {

    if (table.tableBooking === null) {
      return 'success';
    }

    return 'danger';
  };

  const onResetKey = (table) => {
    setResetKeyDialog(true);
    setAutoRefreshEnabled(false);
    setTableSelected(table);
  }

  const onReserveTable = (table) => {
    setReserveTableDialog(true);
    setAutoRefreshEnabled(false);
    setTableSelected(table);
  }

  const resetKeyTable = async () => {
    try {
      const response = await resetKey(tableSelected.tableBooking.id);
      toast.current.show({ severity: 'success', summary: 'Operación Exitosa', detail: `Se ha restablecido la clave de la mesa número ${tableSelected.number} correctamente`, life: 3000 });
      setNewKey(response.key);
    } catch (error) {
      showError(error);
    }

    setResetKeyDialog(false);
    setShowTableBookingQRDialog(true);
  }

  const hideShowTableBookingQRDialog = () => {
    setShowTableBookingQRDialog(false);
    setAutoRefreshEnabled(true);
  };


  const reserveEmptyTable = async () => {

    try {
      const response = await reserveTable(tableSelected.id);
      toast.current.show({ severity: 'success', summary: 'Operación Exitosa', detail: `Se ha reservado la mesa número ${tableSelected.number} correctamente`, life: 3000 });
      setNewKey(response.key);
      onRefresh();
    } catch (error) {
      showError(error);
    }

    setReserveTableDialog(false);
    setShowTableBookingQRDialog(true);
  }

  const resetKeyDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideResetKeyDialog} />
      <Button label="Si" icon="pi pi-check" onClick={resetKeyTable} />
    </React.Fragment>
  );

  const reserveTableDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideReserveTableDialog} />
      <Button label="Si" icon="pi pi-check" onClick={reserveEmptyTable} />
    </React.Fragment>
  );

  const listItem = (table) => {

    const ordersPending = size(table.tableBooking?.orders.filter(order => order.status === ORDER_STATUS.PENDING));
    const ordersPrepared = size(table.tableBooking?.orders.filter(order => order.status === ORDER_STATUS.PREPARED));

    const renderDetails = () => {
      history.push(`/admin/table/${table.id}`);
    }

    return (
      <div className="col-12">
        <div className="flex flex-column xl:flex-row p-4 gap-4">
          <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src="https://res.cloudinary.com/djwjh0wpw/image/upload/v1679927284/mesa_h2bdwt.jpg" alt={table.number} />
          <div className="flex flex-column sm:flex-row justify-content-between align-items-center flex-1 gap-4">
            <div className="flex flex-column align-items-center sm:align-items-start gap-3 list-info-tables-container">
              <div className="text-2xl font-bold text-900">Mesa {table.number}</div>
              <div className="flex align-items-center gap-3">
                {table.tableBooking === null ? null :
                  <>
                    {size(table.tableBooking.payments) > 0 ?
                      <>
                        {table.tableBooking.payments[0].statusPayment === PAYMENT_STATUS.PAID ?
                          <i>Cuenta pagada: <Badge value={<i className="pi pi-euro mt-1"></i>} severity={'success'}></Badge></i>
                          :
                          <i>Cuenta pedida: <Badge value={table.tableBooking.payments[0].paymentType === PAYMENT_TYPE.CARD || table.tableBooking.payments[0].paymentType === PAYMENT_TYPE.APP ?
                            <i className="pi pi-credit-card mt-1"></i> :
                            <i className="pi pi-wallet mt-1"></i>
                          } style={{ background: '#A855F7' }}></Badge>
                          </i>
                        }
                        {(ordersPending > 0 || ordersPrepared > 0) &&
                          <Badge value={ordersPending + ordersPrepared} severity="warning"></Badge>
                        }

                      </>
                      :
                      <i>Pedidos pendientes: <Badge value={ordersPending + ordersPrepared} severity="warning"></Badge></i>
                    }
                  </>
                }
              </div>
            </div>
            <div className='flex flex-column align-items-center gap-3'>
              <Tag value={table.tableBooking === null ? 'VACÍA' : 'OCUPADA'} severity={getSeverity(table)}></Tag>
            </div>
            <div className="flex flex-column align-items-center gap-3">
              {table.tableBooking ?
                <div className="flex align-items-center gap-2">
                  <Button icon="pi pi-refresh"
                    onClick={(event) => { event.stopPropagation(); onResetKey(table); }}
                    label='Regenerar clave'
                    rounded />
                </div>
                :
                <div className="flex align-items-center gap-2">
                  <Button icon="pi pi-user-plus"
                    label='Reservar mesa'
                    onClick={(event) => { event.stopPropagation(); onReserveTable(table); }}
                    rounded />
                </div>
              }
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button icon="pi pi-shopping-cart" label="Ver Pedidos" onClick={renderDetails} disabled={table.tableBooking === null} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const gridItem = (table) => {

    const ordersPending = size(table.tableBooking?.orders.filter(order => order.status === ORDER_STATUS.PENDING));
    const ordersPrepared = size(table.tableBooking?.orders.filter(order => order.status === ORDER_STATUS.PREPARED));

    const renderDetails = () => {
      if (table.tableBooking === null) {
        toast.current.show({ severity: 'info', summary: 'Mesa vacía', detail: 'Los detalles de la mesa no están disponibles cuando esta vacía.', life: 3000 });
      }

      else {
        history.push(`/admin/table/${table.id}`);
      }
    }

    const quitWarningWaiter = async () => {
      try {
        await changeAlert(table.tableBooking?.id, false);
        onRefresh();
        toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: `Se ha quitado la llamada correctamente`, life: 3000 });
      } catch (error) {
        showError(error);
      }
    }

    const redIconStyle = { fontSize: '2rem', color: "#178DE4" };
    const grayIconStyle = { fontSize: '2rem', color: 'black' };

    return (
      <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" onClick={renderDetails}>
        <div className="p-4 border-1 surface-border surface-card border-round">
          <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <div className="flex align-items-center gap-2">
              {table.tableBooking === null ? null :
                <>
                  {size(table.tableBooking.payments) > 0 ?
                    <>
                      {table.tableBooking.payments[0].statusPayment === PAYMENT_STATUS.PAID ?
                        <i className="pi pi-shopping-cart mr-4 p-text-secondary p-overlay-badge" style={{ fontSize: '2rem' }}>
                          <Badge value={<i className="pi pi-euro mt-1"></i>} severity={'success'}></Badge>
                        </i>
                        :
                        <i className="pi pi-shopping-cart mr-4 p-text-secondary p-overlay-badge" style={{ fontSize: '2rem' }}>
                          <Badge value={table.tableBooking.payments[0].paymentType === PAYMENT_TYPE.CARD || table.tableBooking.payments[0].paymentType === PAYMENT_TYPE.APP ?
                            <i className="pi pi-credit-card mt-1"></i> :
                            <i className="pi pi-wallet mt-1"></i>
                          } style={{ background: '#A855F7' }}></Badge>
                        </i>
                      }

                      {(ordersPending > 0 || ordersPrepared > 0) &&
                        <i className="pi mr-4 mb-5 p-text-secondary p-overlay-badge" style={{ fontSize: '2rem' }}>
                          <Badge value={ordersPending + ordersPrepared} severity="warning"></Badge>
                        </i>
                      }
                    </>
                    :
                    <i className="pi pi-shopping-cart mr-4 p-text-secondary p-overlay-badge" style={{ fontSize: '2rem' }}>
                      <Badge value={ordersPending + ordersPrepared} severity="warning"></Badge>
                    </i>
                  }
                </>
              }
            </div>

            {table.tableBooking?.alert &&
              <div className='pl-4 pr-4' onClick={(event) => { event.stopPropagation(); quitWarningWaiter(); }}>
                <i className="pi pi-bell p-text-secondary p-overlay-badge" style={showIcon ? redIconStyle : grayIconStyle}>
                  <Badge value={'!'} severity="danger"></Badge>
                </i>
              </div>
            }

            <Tag value={table.tableBooking === null ? 'VACÍA' : 'OCUPADA'} severity={getSeverity(table)}></Tag>
          </div>
          <div className="flex flex-column align-items-center gap-3 py-5">
            <img className="w-9 shadow-2 border-round" src="https://res.cloudinary.com/djwjh0wpw/image/upload/v1679927284/mesa_h2bdwt.jpg" alt={table.number} />
            <div className="text-2xl font-bold">Mesa {table.number}</div>
          </div>

          <div className="flex flex-column align-items-center gap-3">
            {table.tableBooking ?
              <div className="flex align-items-center gap-2">
                <Button icon="pi pi-refresh"
                  onClick={(event) => { event.stopPropagation(); onResetKey(table); }}
                  label='Regenerar clave'
                  rounded />
              </div>
              :
              <div className="flex align-items-center gap-2">
                <Button icon="pi pi-user-plus"
                  label='Reservar mesa'
                  onClick={(event) => { event.stopPropagation(); onReserveTable(table); }}
                  rounded />
              </div>
            }
          </div>

        </div>
      </div>
    );
  };

  const itemTemplate = (table, layout) => {
    if (!table) {
      return;
    }

    if (layout === 'list') return listItem(table);
    else if (layout === 'grid') return gridItem(table);
  };

  const header = () => {
    return (
      <div className="grid grid-nogutter">
        <div className="col-6 textHeader">
          <h3 className="m-0">PANEL DE PEDIDOS MESAS</h3>
        </div>
        <div className="col-6" style={{ textAlign: 'right' }}>
          <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
        </div>
      </div>
    );
  };

  return (
    <div className="card">
      <Toast ref={toast} className="custom-toast" />
      {loading ?
        <div className="align-container">
          <ProgressSpinner />
        </div>
        :
        <>
          <DataView value={tablesCrud} itemTemplate={itemTemplate} layout={layout} header={header()} emptyMessage='No se ha encontrado ninguna mesa' />

          <Dialog visible={resetkeyDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal footer={resetKeyDialogFooter} onHide={hideResetKeyDialog}>
            <div className="confirmation-content">
              <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
              {tableSelected &&
                <span>Seguro que quieres regenerar la contraseña de la mesa <b>{tableSelected.number}</b>?</span>
              }
            </div>
          </Dialog>

          <Dialog visible={reserveTableDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal footer={reserveTableDialogFooter} onHide={hideReserveTableDialog}>
            <div className="confirmation-content">
              <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
              {tableSelected &&
                <span>Seguro que quieres reservar la mesa <b>{tableSelected.number}</b>?</span>
              }
            </div>
          </Dialog>

          <Dialog visible={showTableBookingQRDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={`Código QR de invitación mesa ${tableSelected?.number}`} modal onHide={hideShowTableBookingQRDialog} >
            <div className='qrDialog-container'>
              {(newKey && tableSelected) && <QRCode value={`https://irest.netlify.app/client-invite/table=${tableSelected.id}&key=${newKey}`} />}
            </div>
          </Dialog>
        </>
      }
    </div>
  )
}