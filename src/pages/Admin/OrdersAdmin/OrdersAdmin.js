import React, { useState, useEffect, useRef } from 'react';
import { ORDER_STATUS } from '../../../utils/constants';
import { useHistory } from 'react-router-dom';
import { size } from 'lodash';
import { useTable } from '../../../hooks';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Dropdown } from 'primereact/dropdown';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Tag } from 'primereact/tag';
import './OrdersAdmin.scss';

export function OrdersAdmin() {

  const toast = useRef(null);
  const history = useHistory();
  const { tables, getTables } = useTable();
  const [refreshTables, setRefreshTables] = useState(false);
  const [tablesCrud, setTablesCrud] = useState([]);
  const [layout, setLayout] = useState('grid');
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState(1);
  const [sortField, setSortField] = useState('tableBooking');

  const sortOptions = [
    { label: 'Vacías', value: '!tableBooking' },
    { label: 'Ocupadas', value: 'tableBooking' },
  ];

  const onRefresh = () => setRefreshTables((state) => !state);

  useEffect(() => {
    const autoRefreshTables = () => {
      onRefresh();
      setTimeout(() => {
        autoRefreshTables();
      }, 5000)
    }
    autoRefreshTables();
  }, [])

  useEffect(() => {
    getTables();
  }, [getTables, refreshTables])

  useEffect(() => {
    if (tables) {
      const filteredTables = tables.filter(table => table.active);
      setTablesCrud(filteredTables);
    }
  }, [tables]);

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

    const ordersPending = size(table.tableBooking?.orders.filter(order => order.status === ORDER_STATUS.PENDING));

    const renderDetails = () => {
      history.push(`/admin/table/${table.id}`);
    }

    return (
      <div className="col-12">
        <div className="flex flex-column xl:flex-row p-4 gap-4">
          <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src="https://res.cloudinary.com/djwjh0wpw/image/upload/v1679927284/mesa_h2bdwt.jpg" alt={table.number} />
          <div className="flex flex-column sm:flex-row justify-content-between align-items-center flex-1 gap-4">
            <div className="flex flex-column align-items-center sm:align-items-start gap-3">
              <div className="text-2xl font-bold text-900">Mesa {table.number}</div>
              <div className="flex align-items-center gap-3">
                {table.tableBooking === null ? null :
                  <span className="flex align-items-center gap-2">
                    <i>Pedidos pendientes: <Badge value={ordersPending > 0 ? ordersPending : 0} severity="warning"></Badge></i>
                  </span>
                }
                <Tag value={table.tableBooking === null ? 'VACÍA' : 'OCUPADA'} severity={getSeverity(table)}></Tag>
              </div>
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

    const renderDetails = () => {
      if (table.tableBooking === null) {
        toast.current.show({ severity: 'info', summary: 'Mesa vacía', detail: 'Los detalles de la mesa no están disponibles cuando esta vacía.', life: 3000 });
      }

      else {
        history.push(`/admin/table/${table.id}`);
      }
    }

    return (
      <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" onClick={renderDetails}>
        <div className="p-4 border-1 surface-border surface-card border-round">
          <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <div className="flex align-items-center gap-2">
              {table.tableBooking === null ? null :
                <i className="pi pi-shopping-cart mr-4 p-text-secondary p-overlay-badge" style={{ fontSize: '2rem' }}>
                  <Badge value={ordersPending > 0 ? ordersPending : 0} severity="warning"></Badge>
                </i>
              }
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
      <Toast ref={toast} />
      <DataView value={tablesCrud} itemTemplate={itemTemplate} layout={layout} header={header()} sortField={sortField} sortOrder={sortOrder} />
    </div>
  )
}

