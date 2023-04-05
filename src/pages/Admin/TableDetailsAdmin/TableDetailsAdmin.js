import React, { useState, useEffect, useRef } from 'react';
import { useOrder, useTable, useProduct } from '../../../hooks';
import { ORDER_STATUS } from '../../../utils/constants';
import { useParams } from 'react-router-dom';
import { classNames } from 'primereact/utils';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Toolbar } from 'primereact/toolbar';
import { Dropdown } from 'primereact/dropdown';
import { Divider } from 'primereact/divider';
import { Badge } from 'primereact/badge';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { map } from 'lodash';
import moment from 'moment';
import 'moment/locale/es';
import './TableDetailsAdmin.scss';


export function TableDetailsAdmin() {

  const toast = useRef(null);
  const tableURL = useParams();
  const { orders, getOrdersByTable, checkDeliveredOrder, addOrderToTable } = useOrder();
  const { tables, getTableById } = useTable();
  const { products, getProducts, getProductById } = useProduct();

  const [table, setTable] = useState(null);
  const [ordersBooking, setOrdersBooking] = useState([]);
  const [refreshOrders, setRefreshOrders] = useState(false);

  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [sortField, setSortField] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [productDialog, setProductDialog] = useState(false);

  const [validationErrors, setValidationErrors] = useState({});
  const [productsDropdown, setProductsDropdown] = useState([])

  const [productList, setProductList] = useState([]);
  const [productsData, setproductsData] = useState([]);

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

  useEffect(() => {
    const addProductList = async () => {
      try {
        const arrayTemp = [];
        for await (const product of productList) {
          const response = await getProductById(product.key);
          arrayTemp.push({ ...response, quantity: product.quantity });
        }

        setproductsData(arrayTemp);
      } catch (error) {
        console.log(error);
      }
    };

    addProductList();
  }, [productList, getProductById])


  const removeProductList = (index) => {
    const arrayTemp = [...productList];
    const product = arrayTemp[index];

    if (product.quantity === 1) {
      arrayTemp.splice(index, 1);
    } else {
      product.quantity -= 1;
    }

    setProductList(arrayTemp);
  };

  const addProductListButton = (index) => {
    const arrayTemp = [...productList];
    const product = arrayTemp[index];

    product.quantity += 1;

    setProductList(arrayTemp);
  };

  const validateFields = () => {
    const errors = {};

    if (productList.length === 0) {
      errors.product = "No se ha seleccionado ningún producto";
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
    setProductList([]);
    setproductsData([]);
    document.body.classList.add('body-scroll-lock');
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
    setValidationErrors({});
    document.body.classList.remove('body-scroll-lock');

    const arrayTemp = [...productList];
    for (const product of arrayTemp) {
      product.quantity = 1;
    }
    setProductList(arrayTemp);
  };

  const saveOrders = async () => {

    const isValid = validateFields();
    setSubmitted(true);

    if (isValid) {
      const arrayTemp = [...productList];

      await Promise.all(arrayTemp.map(async (product) => {
        for (let i = 0; i < product.quantity; i++) {
          await addOrderToTable(table.tableBooking.id, product.key);
        }
        product.quantity = 1;
      }));

      onRefreshOrders();
      setProductList(arrayTemp);
      toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Pedido creado correctamente', life: 3000 });

      setProductDialog(false);
      setSubmitted(false);
      setValidationErrors({});
    }
  }

  const onDropdownChange = (value) => {

    const arrayTemp = [...productList];

    const index = productList.findIndex(product => product.key === value.key);
    if (index === -1) {
      arrayTemp.push(value);
    }

    else {
      arrayTemp[index].quantity += 1;
    }

    setProductList(arrayTemp);

    let errors = { ...validationErrors };

    if (value.length === 0) {
      errors.product = "No se ha seleccionado ningún producto";
    } else {
      delete errors.product;
    }

    setValidationErrors(errors);
  };

  const formatDropdownData = (data) => {
    return map(data, (item) => ({
      key: item.id,
      text: item.title,
      quantity: 1
    }));
  };

  const userDialogFooter = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" className="bttnFoot" outlined onClick={hideDialog} />
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
      <Toolbar className='toolbarOrders' left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
    );
  };

  const itemTemplate = (order) => {

    const onCheckDeliveredOrder = async (status) => {
      await checkDeliveredOrder(order.id, status);
      onRefreshOrders();
    }

    return (
      <div className="col-12">
        <div className="flex flex-column xl:flex-row p-4 gap-4" style={order.status === 'PENDING' ? { backgroundColor: 'var(--yellow-100)' } : { backgroundColor: 'var(--green-100)' }}>
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
            <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3">
              {order.status === ORDER_STATUS.PENDING ? <Button label="Entregar pedido" icon="pi pi-check" onClick={() => onCheckDeliveredOrder(ORDER_STATUS.DELIVERED)} /> : <Button label="Revertir pedido" icon="pi pi-arrow-circle-right" onClick={() => onCheckDeliveredOrder(ORDER_STATUS.PENDING)} style={{width: '100%'}} />}
              <Button label="Cancelar pedido" icon="pi pi-times" severity='danger'/>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      <DataView value={ordersBooking} itemTemplate={itemTemplate} header={header()} sortField={sortField} sortOrder={sortOrder} />
      <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={'Añadir pedidos'} modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
        <div className="field">
          <label htmlFor="categoria" className="font-bold">
            Producto a pedir
          </label>
          <Dropdown value={null} onChange={(e) => onDropdownChange(e.value)} options={productsDropdown} filter optionLabel="text" placeholder="Selecciona una producto"
            style={{ marginBottom: "0.5rem" }} className={classNames({ "p-invalid": submitted && (validationErrors.product) })} />
          {submitted && validationErrors.product && (<small className="p-error">{validationErrors.product}</small>)}

          {map(productsData, (product, index) => (
            <div key={index}>
              <div className='product-add-order'>
                <div className='product-add-info'>
                  <img className="w-9 sm:w-13rem xl:w-7rem block xl:block mx-auto border-round" src={product.image} alt={product.title} />
                  <div style={{ marginLeft: '1.5rem' }}>
                    <span className="font-bold">{product.title}</span>
                    <div style={{ marginTop: '0.5rem' }}>
                      <span style={{ marginRight: '0.5rem' }}>Cantidad: </span>
                      <Badge value={product.quantity} />
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <Button icon="pi pi-minus" severity="danger" style={{ marginRight: "10px" }} onClick={() => removeProductList(index, product)} />
                  <Button icon="pi pi-plus" severity="success" onClick={() => addProductListButton(index)} />
                </div>
              </div>
              <Divider />
            </div>
          ))}

        </div>
      </Dialog>
    </div>
  )

}
