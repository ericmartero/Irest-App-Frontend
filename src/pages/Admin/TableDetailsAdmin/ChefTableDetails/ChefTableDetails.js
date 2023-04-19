import React, { useState, useEffect, useRef } from 'react';
import { useOrder } from '../../../../hooks';
import { ORDER_STATUS } from '../../../../utils/constants';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Toolbar } from 'primereact/toolbar';
import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Badge } from 'primereact/badge';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import moment from 'moment';
import 'moment/locale/es';
import '../TableDetailsAdmin.scss';

export function ChefTableDetails() {

  const toast = useRef(null);
  const intervalRef = useRef();
  const { orders, loading, getOrdersByTable, checkDeliveredOrder, deleteOrder } = useOrder();
  const [ordersBooking, setOrdersBooking] = useState([]);
  const [refreshOrders, setRefreshOrders] = useState(false);
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [sortField, setSortField] = useState('');
  const [deleteOrderDialog, setDeleteOrderDialog] = useState(false);
  const [orderDelete, setOrderDelete] = useState(null);

  const sortOptions = [
    { label: 'Entregados', value: 'status' },
    { label: 'Pendientes', value: '!status' }
  ];

  const onRefreshOrders = () => setRefreshOrders((prev) => !prev);

  useEffect(() => {
    getOrdersByTable(null,true);
  }, [refreshOrders, getOrdersByTable]);

  useEffect(() => {
    if (orders) {
      const pendingOrders = orders.filter((order) => order.status === ORDER_STATUS.PENDING);
      const preparedOrders = orders.filter((order) => order.status === ORDER_STATUS.PREPARED).reverse();
      setOrdersBooking(groupOrdersStatus(pendingOrders).concat(groupOrdersStatus(preparedOrders)));
    }
  }, [orders]);

  useEffect(() => {
    const autoRefreshTables = () => {
      onRefreshOrders();
    }

    intervalRef.current = setInterval(autoRefreshTables, 10000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  const groupOrdersStatus = (data) => {
    return data.reduce((acc, order) => {
      const existingOrder = acc.find((o) => o.product.id === order.product.id);
      if (existingOrder) {
        existingOrder.quantity += 1;
      } else {
        acc.push({ id: order.id, product: order.product, status: order.status, tableBooking: order.tableBooking, quantity: 1, createdAt: order.createdAt });
      }
      return acc;
    }, []);
  };

  const getSeverity = (order) => {
    switch (order.status) {
      case ORDER_STATUS.PENDING:
        return 'warning';

      default:
        return null;
    }
  };

  const onSortChange = (event) => {
    const value = event.value;

    if (value.indexOf('!') === ORDER_STATUS.PENDING) {
      setSortOrder(-1);
      setSortField(value.substring(1, value.length));
      setSortKey(value);
    } else {
      setSortOrder(1);
      setSortField(value);
      setSortKey(value);
    }
  };

  const showError = (error) => {
    toast.current.show({ severity: 'error', summary: 'Operación Fallida', detail: error.message, life: 3000 });
  };

  const hideDeleteOrderDialog = () => {
    setDeleteOrderDialog(false);
  };

  const deleteSelectedOrder = async () => {
    try {
      await deleteOrder(orderDelete);
      onRefreshOrders();
      toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Pedido cancelado correctamente', life: 3000 });
    } catch (error) {
      showError(error);
    }

    setDeleteOrderDialog(false);
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <h3 className="m-0">PANEL DE PEDIDOS COCINA</h3>
      </div>
    );
  };

  const deleteOrderDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteOrderDialog} />
      <Button label="Si" icon="pi pi-check" severity="danger" onClick={deleteSelectedOrder} />
    </React.Fragment>
  );

  const confirmDeleteOrder = (order) => {
    setDeleteOrderDialog(true);
    setOrderDelete(order.id);
  };

  const rightToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Dropdown options={sortOptions} value={sortKey} optionLabel="label" placeholder="Ordenar por estado" onChange={onSortChange} />
      </div>
    );
  };

  const header = () => {
    return (
      <Toolbar className='toolbarOrders' left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
    );
  };

  const itemTemplate = (order) => {

    const onCheckDeliveredOrder = async (status) => {
      order.quantity--;
      await checkDeliveredOrder(order.id, status);
      onRefreshOrders();
      if (status === ORDER_STATUS.PREPARED) {
        toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Pedido entregado correctamente', life: 3000 });
      }

      else {
        toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'El pedido ha vuelto al estado pendiente correctamente', life: 3000 });
      }
      
    }

    return (
      <div className="col-12">
        <div className="flex flex-column xl:flex-row p-4 gap-4" style={order.status === 'PENDING' ? { backgroundColor: 'var(--yellow-100)' } : { backgroundColor: 'var(--primary-100)' }}>
          <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={order.product.image} alt={order.product.title} />
          <div className="flex flex-column sm:flex-row justify-content-between align-items-center flex-1 gap-4">
            <div className="product-info flex flex-column align-items-center sm:align-items-start gap-3">
              <div className="text-2xl font-bold text-900">{order.product.title}</div>
              <span className="font-semibold">
                {moment(order.createdAt).format('HH:mm')} - {moment(order.createdAt).startOf('seconds').fromNow()}
              </span>
              <div className="flex align-items-center gap-3">
                <div>
                  <Tag value={order.status === ORDER_STATUS.PENDING ? 'PENDIENTE' : 'PREPARADO'} severity={getSeverity(order)}></Tag>
                </div>
              </div>
            </div>

            <div className="flex flex-column align-items-center justify-content-center">
              <span className="font-semibold">
                Cantidad:
                <Badge value={order.quantity} size="large" style={{ marginLeft: '1rem' }} />
              </span>
            </div>

            <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3">
              {order.status === ORDER_STATUS.PENDING ? <Button label="Preparar pedido" icon="pi pi-check" onClick={() => onCheckDeliveredOrder(ORDER_STATUS.PREPARED)} /> : <Button label="Revertir pedido" icon="pi pi-arrow-circle-right" onClick={() => onCheckDeliveredOrder(ORDER_STATUS.PENDING)} style={{ width: '100%' }} />}
              <Button label="Cancelar pedido" icon="pi pi-times" severity='danger' onClick={() => confirmDeleteOrder(order)} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      {loading ?
        <div className="align-container">
          <ProgressSpinner />
        </div>
        :
        <>
          <DataView value={ordersBooking} itemTemplate={itemTemplate} header={header()} sortField={sortField} sortOrder={sortOrder} emptyMessage='No hay pedidos en la mesa' />

          <Dialog visible={deleteOrderDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal footer={deleteOrderDialogFooter} onHide={hideDeleteOrderDialog}>
            <div className="confirmation-content">
              <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
              <span>Seguro que quieres cancelar el pedido?</span>
            </div>
          </Dialog>
        </>
      }
    </div>
  )
}
