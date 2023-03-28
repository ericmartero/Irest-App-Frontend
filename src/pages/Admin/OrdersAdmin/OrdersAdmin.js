import React, { useState, useEffect } from 'react';
import { useTable } from '../../../hooks';
import { getOrdersByTableApi } from '../../../api/order';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Dropdown } from 'primereact/dropdown';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Tag } from 'primereact/tag';
import './OrdersAdmin.scss';

export function OrdersAdmin() {

  const { tables, getTables } = useTable();
  const [tablesCrud, setTablesCrud] = useState([]);
  const [layout, setLayout] = useState('grid');

  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [sortField, setSortField] = useState('');

  const sortOptions = [
    { label: 'Vacías', value: '!tableBooking' },
    { label: 'Ocupadas', value: 'tableBooking' }
  ];

  useEffect(() => {
    getTables();
  }, [getTables])

  useEffect(() => {
    if (tables) {
      const filteredTables = tables.filter(table => table.active);
      setTablesCrud(filteredTables);
    }
  }, [tables]);

  /*useEffect(() => {
    (async () => {
      const response = await getOrdersByTableApi()
    })()
  }, [])*/

  const getSeverity = (table) => {

    if (table.tableBooking === null) {
      return 'success';
    }

    return 'danger';
  };

  const onSortChange = (event) => {
    const value = event.value;

    if (value.indexOf('!') === null) {
      setSortOrder(-1);
      setSortField(value.substring(1, value.length));
      setSortKey(value);
    } else {
      setSortOrder(1);
      setSortField(value);
      setSortKey(value);
    }
  };

  const listItem = (table) => {
    return (
      <div className="col-12">
        <div className="flex flex-column xl:flex-row p-4 gap-4">
          <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src="https://res.cloudinary.com/djwjh0wpw/image/upload/v1679927284/mesa_h2bdwt.jpg" alt={table.number} />
          <div className="flex flex-column sm:flex-row justify-content-between align-items-center flex-1 gap-4">
            <div className="flex flex-column align-items-center sm:align-items-start gap-3">
              <div className="text-2xl font-bold text-900">Mesa {table.number}</div>
              <div className="flex align-items-center gap-3">
                <span className="flex align-items-center gap-2">
                  <i>Pedidos: <Badge value="12" severity="warning"></Badge></i>
                </span>
                <Tag value={table.tableBooking === null ? 'VACÍA' : 'OCUPADA'} severity={getSeverity(table)}></Tag>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button icon="pi pi-shopping-cart" label="Ver Pedidos" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const gridItem = (table) => {

    /*if (table.tableBooking !== null) {
      const response = await getOrdersByTableApi(table.tableBooking.id, 'PENDING');
      console.log(response);
    }*/

    const hola = () => {
      console.log('holaaa');
    }

    return (
      <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" onClick={hola}>
        <div className="p-4 border-1 surface-border surface-card border-round">
          <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <div className="flex align-items-center gap-2">
              <i className="pi pi-shopping-cart mr-4 p-text-secondary p-overlay-badge" style={{ fontSize: '2rem' }}><Badge value="12" severity="warning"></Badge></i>
            </div>
            <Tag value={table.tableBooking === null ? 'VACÍA' : 'OCUPADA'} severity={getSeverity(table)}></Tag>
          </div>
          <div className="flex flex-column align-items-center gap-3 py-5">
            <img className="w-9 shadow-2 border-round" src="https://res.cloudinary.com/djwjh0wpw/image/upload/v1679927284/mesa_h2bdwt.jpg" alt={table.number} />
            <div className="text-2xl font-bold">Mesa {table.number}</div>
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
        <div className="col-6" style={{ textAlign: 'left' }}>
          <Dropdown value={sortKey} options={sortOptions} optionLabel="label" placeholder="Ordenar por estado" onChange={onSortChange} />
        </div>
        <div className="col-6" style={{ textAlign: 'right' }}>
          <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
        </div>
      </div>
    );
  };

  return (
    <div className="card">
      <DataView value={tablesCrud} itemTemplate={itemTemplate} layout={layout} header={header()} sortField={sortField} sortOrder={sortOrder} />
    </div>
  )
}

