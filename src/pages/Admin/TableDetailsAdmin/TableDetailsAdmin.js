import React, { useState, useEffect } from 'react';
import { useOrder, useTable, useProduct } from '../../../hooks';
import { ORDER_STATUS } from '../../../utils/constants';
import { useParams } from 'react-router-dom';
import { classNames } from 'primereact/utils';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Toolbar } from 'primereact/toolbar';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { map } from 'lodash';
import moment from 'moment';
import 'moment/locale/es';
import './TableDetailsAdmin.scss';


export function TableDetailsAdmin() {

  const tableURL = useParams();
  const { orders, getOrdersByTable, checkDeliveredOrder } = useOrder();
  const { tables, getTableById } = useTable();
  const { products, getProducts } = useProduct();

  const [table, setTable] = useState(null);
  const [ordersBooking, setOrdersBooking] = useState([]);
  const [refreshOrders, setRefreshOrders] = useState(false);

  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [sortField, setSortField] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [productDialog, setProductDialog] = useState(false);

  const [validationErrors, setValidationErrors] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productsDropdown, setProductsDropdown] = useState([])

  const sortOptions = [
    { label: 'Entregados', value: 'status' },
    { label: 'Pendientes', value: '!status' }
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

  useEffect(() => {
    getProducts();
  }, [getProducts])

  useEffect(() => {
    setProductsDropdown(formatDropdownData(products));
  }, [products])

  const validateFields = () => {
    const errors = {};

    if (selectedProduct === null) {
      errors.product = "El producto es requerido";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getSeverity = (order) => {
    switch (order.status) {
      case ORDER_STATUS.DELIVERED:
        return 'success';

      case ORDER_STATUS.PENDING:
        return 'warning';

      default:
        return null;
    }
  };

  const onSortChange = (event) => {
    const value = event.value;

    if (value.indexOf('!') === ORDER_STATUS.DELIVERED) {
      setSortOrder(-1);
      setSortField(value.substring(1, value.length));
      setSortKey(value);
    } else {
      setSortOrder(1);
      setSortField(value);
      setSortKey(value);
    }
  };

  const openNew = () => {
    setSubmitted(false);
    setProductDialog(true);
    setSelectedProduct(null);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
    setValidationErrors({});
  };

  const saveOrders = () => {

    const isValid = validateFields();
    setSubmitted(true);

    if (isValid) {
      const selectedOption = productsDropdown.find((option) => option.value === selectedProduct);
      console.log(selectedOption);

      setProductDialog(false);
      setSubmitted(false);
      setValidationErrors({});
    }
  }

  const addProductList = () => {
    const arrayTemp = [];
    console.log('hola');
  }

  const onDropdownChange = (value) => {

    let errors = { ...validationErrors };
    setSelectedProduct(value);

    if (value === null) {
      errors.product = "El producto es requerido";
    } else {
      delete errors.product;
    }

    setValidationErrors(errors);
  };

  const formatDropdownData = (data) => {
    return map(data, (item) => ({
      id: item.id,
      value: item.title
    }));
  }

  const userDialogFooter = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Guardar" icon="pi pi-check" onClick={saveOrders} disabled={!submitted || Object.keys(validationErrors).length === 0 ? false : true} />
    </React.Fragment>
  );

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <h3 className="m-0">PEDIDOS MESA NÚMERO {table?.number}</h3>
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Dropdown options={sortOptions} value={sortKey} optionLabel="label" placeholder="Ordenar por estado" onChange={onSortChange} />
        <Button label="Añadir pedido" icon="pi pi-plus" severity="success" className='ml-5' onClick={openNew} />
      </div>
    );
  };

  const header = () => {
    return (
      <Toolbar left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
    );
  };

  const itemTemplate = (order) => {

    const onCheckDeliveredOrder = async () => {
      await checkDeliveredOrder(order.id, ORDER_STATUS.DELIVERED);
      onRefreshOrders();
    }

    return (
      <>
        <div className="col-12">
          <div className="flex flex-column xl:flex-row p-4 gap-4" style={ order.status === 'PENDING' ? {backgroundColor: 'var(--yellow-100)'} : {backgroundColor: 'var(--green-100)'}}>
            <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={order.product.image} alt={order.product.title} />
            <div className="flex flex-column sm:flex-row justify-content-between align-items-center flex-1 gap-4">
              <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                <div className="text-2xl font-bold text-900">{order.product.title}</div>
                <span className="font-semibold">
                  {moment(order.createdAt).format('HH:mm')} - {moment(order.createdAt).startOf('seconds').fromNow()}
                </span>
                <div className="flex align-items-center gap-3">
                  <div>
                    <Tag value={order.status === ORDER_STATUS.PENDING ? 'PENDIENTE' : 'ENTREGADO'} severity={getSeverity(order)}></Tag>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {order.status === ORDER_STATUS.PENDING ? <Button label="Entregar pedido" onClick={onCheckDeliveredOrder} /> : <span>ENTREGADO</span>}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="card">
      <DataView value={ordersBooking} itemTemplate={itemTemplate} header={header()} sortField={sortField} sortOrder={sortOrder} />
      <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={'Añadir pedidos'} modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
        <div className="field">
          <label htmlFor="categoria" className="font-bold">
            Producto a pedir
          </label>
          <Dropdown value={selectedProduct} onChange={(e) => onDropdownChange(e.value)} options={productsDropdown} optionLabel="value"
            placeholder="Selecciona una producto" className={classNames({ "p-invalid": submitted && (validationErrors.product) })} />
            {submitted && validationErrors.product && (<small className="p-error">{validationErrors.product}</small>)}
        </div>
      </Dialog>
    </div>
  )
}
