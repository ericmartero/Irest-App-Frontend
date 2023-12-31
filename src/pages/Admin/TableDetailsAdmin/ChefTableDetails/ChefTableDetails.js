import React, { useState, useEffect, useRef } from 'react';
import { useOrder, useAuth } from '../../../../hooks';
import { ORDER_STATUS } from '../../../../utils/constants';
import { AccessDenied } from '../../../AccessdDenied';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Toolbar } from 'primereact/toolbar';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Badge } from 'primereact/badge';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { size } from 'lodash';
import moment from 'moment';
import 'moment/locale/es';
import '../TableDetailsAdmin.scss';

export function ChefTableDetails() {

  const toast = useRef(null);
  const intervalRef = useRef();
  const { auth } = useAuth();
  const { error, orders, loading, getOrdersByTable, checkDeliveredOrder } = useOrder();
  const [ordersBooking, setOrdersBooking] = useState([]);
  const [refreshOrders, setRefreshOrders] = useState(false);

  const onRefreshOrders = () => setRefreshOrders((prev) => !prev);

  useEffect(() => {
    getOrdersByTable(null, true);
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

    intervalRef.current = setInterval(autoRefreshTables, 15000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  const groupOrdersStatus = (data) => {
    return data.reduce((acc, order) => {
      const existingOrder = acc.find(
        (o) =>
          o.product.id === order.product.id &&
          o.tableBooking.table.number === order.tableBooking.table.number
      );
      if (existingOrder) {
        existingOrder.quantity += 1;
      } else {
        acc.push({
          id: order.id,
          product: order.product,
          status: order.status,
          tableBooking: order.tableBooking,
          quantity: 1,
          createdAt: order.createdAt
        });
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

  const showError = (error) => {
    toast.current.show({ severity: 'error', summary: 'Operación Fallida', detail: error.message, life: 3000 });
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <h3 className="m-0">PANEL DE PEDIDOS COCINA</h3>
      </div>
    );
  };

  const header = () => {
    return (
      <Toolbar className='toolbarOrders' left={leftToolbarTemplate}></Toolbar>
    );
  };

  const itemTemplate = (order) => {

    const onCheckDeliveredOrder = async (status) => {
      try {
        order.quantity--;
        await checkDeliveredOrder(order.id, status);
        onRefreshOrders();
        if (status === ORDER_STATUS.PREPARED) {
          toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Pedido entregado correctamente', life: 3000 });
        }

        else {
          toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'El pedido ha vuelto al estado pendiente correctamente', life: 3000 });
        }
      } catch (error) {
        showError(error);
      }
    }

    return (
      <div className="col-12">
        <div className="flex flex-column xl:flex-row p-4 gap-4" style={order.status === 'PENDING' ? { backgroundColor: 'var(--yellow-100)' } : { backgroundColor: 'var(--primary-100)' }}>
          <img className="w-9 sm:w-16rem xl:w-11rem shadow-2 block xl:block mx-auto border-round image-fill" src={order.product.image} alt={order.product.title} />
          <div className="flex flex-column sm:flex-row justify-content-between align-items-center flex-1 gap-4">
            <div className="product-info flex flex-column align-items-center sm:align-items-start gap-3">
              <div className="text-2xl font-bold text-900">{order.product.title}</div>
              <span className="font-bold">Mesa {order.tableBooking.table.number}</span>
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
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {error || (size(auth?.me.user.roles) === 1 && auth?.me.user.roles.includes('waiter')) ? <AccessDenied /> :
        <div className="card">
          <Toast ref={toast} />
          {loading ?
            <div className="align-container">
              <ProgressSpinner />
            </div>
            :
            <DataView value={ordersBooking} itemTemplate={itemTemplate} header={header()} emptyMessage='No hay pedidos en la mesa' />
          }
        </div>
      }
    </>
  )
}
