import React, { useState, useEffect } from 'react';
import { useOrder, useTable } from '../../../hooks';
import { useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Dropdown } from 'primereact/dropdown';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';

export function TableDetailsAdmin() {

  const tableURL = useParams();
  const { orders, getOrdersByTable } = useOrder();
  const { tables, getTableById } = useTable();

  const [table, setTable] = useState(null);
  const [ordersBooking, setOrdersBooking] = useState([]);

  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [sortField, setSortField] = useState('');
  const sortOptions = [
    { label: 'Price High to Low', value: '!price' },
    { label: 'Price Low to High', value: 'price' }
  ];

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
  }, [table]);

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
    return <Dropdown options={sortOptions} value={sortKey} optionLabel="label" placeholder="Sort By Price" onChange={onSortChange} className="w-full sm:w-14rem" />;
  };

  const itemTemplate = (order) => {
    return (
      <div className="col-12">
        <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
          <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={order.product.image} alt={order.product.title} />
          <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
            <div className="flex flex-column align-items-center sm:align-items-start gap-3">
              <div className="text-2xl font-bold text-900">{order.product.title}</div>
              <span className="font-semibold">{order.createdAt}</span>
              <div className="flex align-items-center gap-3">
                <div>
                  <span>Estado: </span>
                  <Tag value={order.status === 'PENDING' ? 'PENDIENTE' : 'ENTREGADO'} severity={getSeverity(order)}></Tag>
                </div>
              </div>
            </div>
            <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
              <span className="text-2xl font-semibold">${order.price}</span>
              <Button icon="pi pi-shopping-cart" className="p-button-rounded"></Button>
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
