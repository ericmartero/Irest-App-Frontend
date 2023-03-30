import React, { useState, useEffect } from 'react';
import { useOrder, useTable } from '../../../hooks';
import { useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import moment from 'moment';
import 'moment/locale/es';

export function TableDetailsAdmin() {

  const tableURL = useParams();
  const { orders, getOrdersByTable, checkDeliveredOrder } = useOrder();
  const { tables, getTableById } = useTable();

  const [table, setTable] = useState(null);
  const [ordersBooking, setOrdersBooking] = useState([]);
  const [refreshOrders, setRefreshOrders] = useState(false);

  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [sortField, setSortField] = useState('');



  const sortOptions = [
    { label: 'Price High to Low', value: '!price' },
    { label: 'Price Low to High', value: 'price' }
  ];

  const onRefreshOrders = () => setRefreshOrders((prev) => !prev);

  useEffect(() => {
    getTableById(tableURL.id);
  }, [tableURL.id, getTableById])

  useEffect(() => {
    if (tables) {
      setTable(tables);
    }
  }, [tables]);

  useEffect(() => {
    if (table && table.tableBooking !== null) {
      getOrdersByTable(table.tableBooking.id);
    }
  }, [table, refreshOrders, getOrdersByTable]);

  useEffect(() => {
    if (orders) {
      setOrdersBooking(orders);
    }
  }, [orders]);

  const getSeverity = (order) => {
    switch (order.status) {
      case 'DELIVERED':
        return 'success';

      case 'PENDING':
        return 'danger';

      default:
        return null;
    }
  };

  const onSortChange = (event) => {
    const value = event.value;

    if (value.indexOf('!') === 0) {
      setSortOrder(-1);
      setSortField(value.substring(1, value.length));
      setSortKey(value);
    } else {
      setSortOrder(1);
      setSortField(value);
      setSortKey(value);
    }
  };

  const header = () => {
    return (
      <div className="grid grid-nogutter">
        <div className="col-6" style={{ textAlign: 'left', display: 'flex', alignItems: 'center'  }}>
          <h3 className="m-0">PEDIDOS MESA NÚMERO {table?.number}</h3>
        </div>
        <div className="col-6" style={{ textAlign: 'right' }}>
          <Dropdown options={sortOptions} value={sortKey} optionLabel="label" placeholder="Sort By Price" onChange={onSortChange} />
        </div>
      </div>
    );
  };

  const itemTemplate = (order) => {

    const onCheckDeliveredOrder = async () => {
      await checkDeliveredOrder(order.id);
      onRefreshOrders();
    }

    return (
      <div className="col-12">
        <div className="flex flex-column xl:flex-row p-4 gap-4">
          <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={order.product.image} alt={order.product.title} />
          <div className="flex flex-column sm:flex-row justify-content-between align-items-center flex-1 gap-4">
            <div className="flex flex-column align-items-center sm:align-items-start gap-3">
              <div className="text-2xl font-bold text-900">{order.product.title}</div>
              <span className="font-semibold">
                {moment(order.createdAt).format('HH:mm')} - {moment(order.createdAt).startOf('seconds').fromNow()}
              </span>
              <div className="flex align-items-center gap-3">
                <div>
                  <span>Estado: </span>
                  <Tag value={order.status === 'PENDING' ? 'PENDIENTE' : 'ENTREGADO'} severity={getSeverity(order)}></Tag>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              { order.status === 'PENDING' ? <Button label="Entregar pedido" onClick={onCheckDeliveredOrder} /> : <span>ENTREGADO</span>}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="card">
      <DataView value={ordersBooking} itemTemplate={itemTemplate} header={header()} sortField={sortField} sortOrder={sortOrder} />
    </div>
  )
}
