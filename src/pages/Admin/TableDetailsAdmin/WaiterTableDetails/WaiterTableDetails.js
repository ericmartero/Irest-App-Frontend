import React, { useState, useEffect, useRef } from 'react';
import { useOrder, useTable, useProduct, usePayment } from '../../../../hooks';
import { ORDER_STATUS, PAYMENT_TYPE } from '../../../../utils/constants';
import { AccessDenied } from '../../../AccessdDenied';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { classNames } from 'primereact/utils';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Toolbar } from 'primereact/toolbar';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { ProgressSpinner } from 'primereact/progressspinner';
import { RadioButton } from "primereact/radiobutton";
import { Divider } from 'primereact/divider';
import { Badge } from 'primereact/badge';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import jsPDF from 'jspdf';
import { map, forEach, size } from 'lodash';
import moment from 'moment';
import 'moment/locale/es';
import '../TableDetailsAdmin.scss';
import '../../../../scss/Dialogs.scss'

export function WaiterTableDetails() {

  const toast = useRef(null);
  const intervalRef = useRef();
  const tableURL = useParams();
  const history = useHistory();
  const { orders, loading, error, getOrdersByTable, checkDeliveredOrder, addOrderToTable, deleteOrder, addPaymentToOrder, closeOrder } = useOrder();
  const { tables, getTableById, updateTable } = useTable();
  const { products, getProducts, getProductById } = useProduct();
  const { createPayment, getPaymentByTable, closePayment } = usePayment();

  const [table, setTable] = useState(null);
  const [ordersBooking, setOrdersBooking] = useState([]);
  const [refreshOrders, setRefreshOrders] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [productDialog, setProductDialog] = useState(false);
  const [confirmTypePaymentDialog, setConfirmTypePaymentDialog] = useState(false);
  const [deleteOrderDialog, setDeleteOrderDialog] = useState(false);
  const [orderDelete, setOrderDelete] = useState(null);

  const [validationErrors, setValidationErrors] = useState({});
  const [productsDropdown, setProductsDropdown] = useState([])

  const [productList, setProductList] = useState([]);
  const [productsData, setproductsData] = useState([]);

  const [paymentType, setPaymentType] = useState(PAYMENT_TYPE.CARD);
  const [paymentData, setPaymentData] = useState(null);
  const [showBillDialog, setShowBillDialog] = useState(false);
  const [closeTableDialog, setCloseTableDialog] = useState(false);

  const [onPaymentChange, setOnPaymentChange] = useState(false);
  const [enablePayment, setEnablePayment] = useState(false);
  const [closeTable, setCloseTable] = useState(false);
  const [finishPaymentDialog, setFinishPaymentDialog] = useState(false);
  const [confirmCreateAccountDialog, setConfirmCreateAccountDialog] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);

  const [showDownloadButtons, setShowDownloadButtons] = useState(true);

  const onRefreshOrders = () => setRefreshOrders((prev) => !prev);
  const onRefreshPayment = () => setOnPaymentChange((prev) => !prev);

  useEffect(() => {
    getTableById(tableURL.id);
  }, [tableURL.id, getTableById]);

  useEffect(() => {
    if (tables) {
      setTable(tables);
    }
  }, [tables]);

  useEffect(() => {
    if (table && table.tableBooking !== null) {
      getOrdersByTable(table?.tableBooking?.id);
    }
  }, [table, refreshOrders, getOrdersByTable]);

  useEffect(() => {
    if (orders) {
      const pendingOrders = orders.filter((order) => order.status === ORDER_STATUS.PENDING);
      const deliveredOrders = orders.filter((order) => order.status === ORDER_STATUS.DELIVERED);
      const preparedOrders = orders.filter((order) => order.status === ORDER_STATUS.PREPARED);
      setOrdersBooking(groupOrdersStatus(pendingOrders).concat(groupOrdersStatus(deliveredOrders)).concat(groupOrdersStatus(preparedOrders)));
    }
  }, [orders]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  useEffect(() => {
    if (products) {
      const filteredProducts = products.filter(product => product.active);
      setProductsDropdown(formatDropdownData(filteredProducts));
    }
  }, [products]);

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
        showError(error);
      }
    };

    addProductList();
  }, [productList, getProductById]);

  useEffect(() => {
    if (table) {
      (async () => {
        const response = await getPaymentByTable(table?.tableBooking?.id);
        if (size(response) > 0) setPaymentData(response[0]);
      })();
    }
  }, [table, refreshOrders, getPaymentByTable]);

  useEffect(() => {
    if (orders) {
      if (size(orders) === 0) {
        setEnablePayment(true);
        setCloseTable(false);
      }

      else {
        setEnablePayment(false);
        setCloseTable(true);
      }
    }
  }, [onPaymentChange, orders])

  useEffect(() => {
    const autoRefreshTables = () => {
      onRefreshOrders();
    }

    if (autoRefreshEnabled) {
      intervalRef.current = setInterval(autoRefreshTables, 10000);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [autoRefreshEnabled]);

  const downloadAccountPDF = () => {
    setShowDownloadButtons(false);

    setTimeout(() => {
      const dialogElement = document.querySelector('.dialog-account-container');
      const dialogWidth = dialogElement.offsetWidth;
      const dialogHeight = dialogElement.offsetHeight;

      const pdf = new jsPDF('p', 'pt', 'a4');

      const scaleFactor = pdf.internal.pageSize.getWidth() / dialogWidth;

      const pageCount = Math.ceil(dialogHeight / pdf.internal.pageSize.getHeight());

      for (let i = 0; i < pageCount; i++) {
        if (i > 0) {
          pdf.addPage();
        }
        pdf.setPage(i + 1);
        pdf.html(dialogElement, {
          x: 0,
          y: -i * pdf.internal.pageSize.getHeight(),
          width: pdf.internal.pageSize.getWidth(),
          height: dialogHeight,
          html2canvas: {
            scale: scaleFactor,
          },
          callback: () => {
            if (i === pageCount - 1) {
              pdf.save(`Cuenta-Mesa${table?.number}-${moment(paymentData?.createdAt).format('DD/MM/YYYY')}${moment(paymentData?.createdAt).format('HH:mm:ss')}.pdf`);
              setShowDownloadButtons(true);
            }
          },
        });
      }
    }, 100);
  };

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

  const showError = (error) => {
    toast.current.show({ severity: 'error', summary: 'Operación Fallida', detail: error.message, life: 3000 });
  }

  const openNew = () => {
    setSubmitted(false);
    setProductDialog(true);
    setProductList([]);
    setproductsData([]);
    setAutoRefreshEnabled(false);
    document.body.classList.add('body-scroll-lock');
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
    setValidationErrors({});
    setAutoRefreshEnabled(true);
    document.body.classList.remove('body-scroll-lock');

    const arrayTemp = [...productList];
    for (const product of arrayTemp) {
      product.quantity = 1;
    }
    setProductList(arrayTemp);
  };

  const hideDeleteOrderDialog = () => {
    setDeleteOrderDialog(false);
    setAutoRefreshEnabled(true);
  };

  const hideFinishPaymentDialog = () => {
    setFinishPaymentDialog(false);
    setShowBillDialog(true);
  };

  const hideConfirmCreateAccountDialog = () => {
    setConfirmCreateAccountDialog(false);
    setConfirmTypePaymentDialog(true);
  };

  const hideCloseTableDialog = () => {
    setCloseTableDialog(false);
  };

  const hideConfirmTypePaymentDialog = () => {
    setConfirmTypePaymentDialog(false);
    setPaymentType(PAYMENT_TYPE.CARD);
    setAutoRefreshEnabled(true);
  };

  const openDialogFinishPayment = () => {
    setFinishPaymentDialog(true);
    setShowBillDialog(false);
  };

  const hideBillDialog = () => {
    setShowBillDialog(false);
    setAutoRefreshEnabled(true);
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
      setAutoRefreshEnabled(true);
      document.body.classList.remove('body-scroll-lock');
    }
  };

  const deleteSelectedOrder = async () => {
    try {
      await deleteOrder(orderDelete);
      onRefreshOrders();
      onRefreshPayment();
      toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Pedido cancelado correctamente', life: 3000 });
    } catch (error) {
      showError(error);
    }

    setDeleteOrderDialog(false);
    setAutoRefreshEnabled(true);
  };

  const finishPayment = async () => {
    try {
      await closePayment(paymentData.id);

      for await (const order of orders) {
        await closeOrder(order.id);
      }

      await updateTable(table.id, { tableBooking: null });

      toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Pago finalizado correctamente', life: 3000 });
      history.push("/admin");
    } catch (error) {
      showError(error);
    }
    onRefreshOrders();
    setFinishPaymentDialog(false);
  };

  const onPayment = async () => {
    let totalPayment = 0;
    forEach(orders, (order) => {
      totalPayment += order.product.price;
    })

    const paymentData = {
      table: table.tableBooking.id,
      totalPayment: Number(totalPayment.toFixed(2)),
      paymentType
    }

    const payment = await createPayment(paymentData);

    for await (const order of orders) {
      await addPaymentToOrder(order.id, payment.id);
    }

    onRefreshOrders();
    toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Se ha creado la cuenta correctamente', life: 3000 });
    setPaymentType(PAYMENT_TYPE.CARD);
    setConfirmCreateAccountDialog(false);
    setAutoRefreshEnabled(true);
  };

  const onCloseTable = async () => {
    await updateTable(table.id, { tableBooking: null });
    history.push("/admin");
  };

  const onConfirmCreateAccount = () => {
    setConfirmCreateAccountDialog(true);
    setConfirmTypePaymentDialog(false);
  };

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

  const orderDialogFooter = (
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

  const deleteOrderDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteOrderDialog} />
      <Button label="Si" icon="pi pi-check" severity="danger" onClick={deleteSelectedOrder} />
    </React.Fragment>
  );

  const confirmTypePaymentDialogFooter = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideConfirmTypePaymentDialog} />
      <Button label="Generar Cuenta" icon="pi pi-check" severity="primary" onClick={onConfirmCreateAccount} />
    </React.Fragment>
  );

  const showBillDialogFooter = (
    <div className='footerBill'>
      {showDownloadButtons &&
        <>
          <Button label='Descargar Cuenta' onClick={downloadAccountPDF} style={{ width: "13rem" }} />
          <Button label="Marcar como pagado" onClick={openDialogFinishPayment} severity="success" style={{ margin: 0, marginLeft: "1rem", width: "13rem" }} />
        </>
      }
    </div>
  );

  const finishPaymentDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideFinishPaymentDialog} />
      <Button label="Si" icon="pi pi-check" onClick={finishPayment} />
    </React.Fragment>
  );

  const confirmCreateAccountDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideConfirmCreateAccountDialog} />
      <Button label="Si" icon="pi pi-check" onClick={onPayment} />
    </React.Fragment>
  );

  const closeTableDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideCloseTableDialog} />
      <Button label="Si" icon="pi pi-check" onClick={onCloseTable} />
    </React.Fragment>
  );

  const formatCurrency = (value) => {
    return value?.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
  };

  const priceBodyTemplate = (rowData) => {
    return formatCurrency(rowData.product.price * rowData.quantity);
  };


  const confirmDeleteOrder = (order) => {
    setDeleteOrderDialog(true);
    setOrderDelete(order.id);
    setAutoRefreshEnabled(false);
  };

  const onConfirmPayment = () => {
    setConfirmTypePaymentDialog(true);
    setAutoRefreshEnabled(false);
  };

  const onShowBill = () => {
    setShowBillDialog(true);
    setAutoRefreshEnabled(false);
  };

  const totalPaymentFooter = (
    <ColumnGroup>
      <Row>
        <Column />
        <Column footer="TOTAL:" align={"right"} />
        <Column footer={`${paymentData?.totalPayment.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`} />
      </Row>
    </ColumnGroup>
  );

  const rightToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        {!paymentData ? <Button label="Añadir pedido" severity="success" className='ml-5' onClick={openNew} />
          : <Button label="Ver Cuenta" severity="secondary" className='ml-5' style={{ width: "10rem" }} onClick={onShowBill} />}
        {!paymentData ? <Button label="Generar Cuenta" severity="secondary" className='ml-2' disabled={enablePayment} onClick={onConfirmPayment} />
          : null
        }
        <Button label="Cerrar mesa" severity="danger" className='ml-2' style={{ width: "10rem" }} disabled={closeTable} onClick={() => setCloseTableDialog(true)} />
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
      onRefreshPayment();
    }

    return (
      <div className="col-12">
        <div className="flex flex-column xl:flex-row p-4 gap-4"
          style={
            order.status === ORDER_STATUS.PENDING ? { backgroundColor: 'var(--yellow-100)' }
              : order.status === ORDER_STATUS.DELIVERED ? { backgroundColor: 'var(--green-100)' }
                : { backgroundColor: 'var(--primary-100)' }
          }>
          <img className="w-9 sm:w-16rem xl:w-11rem shadow-2 block xl:block mx-auto border-round image-fill" src={order.product.image} alt={order.product.title} />
          <div className="flex flex-column sm:flex-row justify-content-between align-items-center flex-1 gap-4">
            <div className="product-info flex flex-column align-items-center sm:align-items-start gap-3">
              <div className="text-2xl font-bold text-900">{order.product.title}</div>
              <span className="font-semibold">
                {moment(order.createdAt).format('HH:mm')} - {moment(order.createdAt).startOf('seconds').fromNow()}
              </span>
              <div className="flex align-items-center gap-3">
                <div>
                  <Tag value={
                    order.product.category.chefVisible && order.status === ORDER_STATUS.PENDING ? 'PENDIENTE DE COCINA' :
                      order.status === ORDER_STATUS.PENDING ? 'PENDIENTE'
                        : order.status === ORDER_STATUS.DELIVERED ? 'ENTREGADO'
                          : 'PREPARADO EN COCINA'}
                    severity={getSeverity(order)}></Tag>
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
              {!paymentData ?
                <>
                  {
                    order.product.category.chefVisible && order.status === ORDER_STATUS.PENDING ? < Button label="Cancelar pedido" icon="pi pi-times" severity='danger' onClick={() => confirmDeleteOrder(order)} />
                      :
                      <>
                        {
                          order.status === ORDER_STATUS.PENDING ?
                            <Button label="Entregar pedido" icon="pi pi-check" onClick={() => onCheckDeliveredOrder(ORDER_STATUS.DELIVERED)} /> :
                            order.status === ORDER_STATUS.PREPARED ?
                              <>
                                <Button label='Entregar pedido' icon="pi pi-check" onClick={() => onCheckDeliveredOrder(ORDER_STATUS.DELIVERED)} />
                                <Button label='Revertir pedido' icon="pi pi-arrow-circle-right" onClick={() => onCheckDeliveredOrder(ORDER_STATUS.PENDING)} style={{ width: '100%' }} />
                              </>
                              :
                              <>
                                <Button label="Revertir pedido" icon="pi pi-arrow-circle-right" onClick={() => onCheckDeliveredOrder(ORDER_STATUS.PENDING)} style={{ width: '100%' }} />
                              </>
                        }
                        <Button label="Cancelar pedido" icon="pi pi-times" severity='danger' onClick={() => confirmDeleteOrder(order)} style={{ width: '100%' }} />
                      </>
                  }
                </>
                :
                <>
                  {
                    <>
                      {
                        !order.product.category.chefVisible && order.status === ORDER_STATUS.PENDING ?
                          <Button label="Entregar pedido" icon="pi pi-check" onClick={() => onCheckDeliveredOrder(ORDER_STATUS.DELIVERED)} /> :
                          order.status === ORDER_STATUS.PREPARED &&
                          <>
                            <Button label='Entregar pedido' icon="pi pi-check" onClick={() => onCheckDeliveredOrder(ORDER_STATUS.DELIVERED)} />
                          </>
                      }
                    </>
                  }
                </>
              }
            </div>
          </div>
        </div>
      </div >
    );
  };

  return (
    <>
      {error ? <AccessDenied /> :
        <div className="card">
          <Toast ref={toast} />
          {loading ?
            <div className="align-container">
              <ProgressSpinner />
            </div>
            :
            <>
              <DataView value={ordersBooking} itemTemplate={itemTemplate} header={header()} emptyMessage='No hay pedidos en la mesa' />
              <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={'Añadir pedidos'} modal className="p-fluid" footer={orderDialogFooter} onHide={hideDialog}>
                <div className="field">
                  <label htmlFor="categoria" className="font-bold">
                    Producto a pedir
                  </label>
                  <Dropdown value={null} onChange={(e) => onDropdownChange(e.value)} options={productsDropdown} filter optionLabel="text" placeholder="Selecciona una producto"
                    style={{ marginBottom: "0.5rem" }} className={classNames({ "p-invalid": submitted && (validationErrors.product) })} emptyFilterMessage="No se encuentra este nombre del producto" />
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

              <Dialog visible={deleteOrderDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal footer={deleteOrderDialogFooter} onHide={hideDeleteOrderDialog}>
                <div className="confirmation-content">
                  <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                  <span>Seguro que quieres cancelar el pedido?</span>
                </div>
              </Dialog>

              <Dialog visible={confirmTypePaymentDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Generar Cuenta" modal footer={confirmTypePaymentDialogFooter} onHide={hideConfirmTypePaymentDialog}>
                <div className="confirmation-typePayment">
                  <span className="font-semibold">Método de pago:</span>
                  <div className="card flex justify-content-center">
                    <div className="flex flex-wrap gap-3">
                      <div className="flex align-items-center">
                        <RadioButton inputId="card" name="payment" value="CARD" onChange={(e) => setPaymentType(e.value)} checked={paymentType === PAYMENT_TYPE.CARD} />
                        <label htmlFor="card" className="ml-2">Targeta</label>
                      </div>
                      <div className="flex align-items-center">
                        <RadioButton inputId="cash" name="payment" value="CASH" onChange={(e) => setPaymentType(e.value)} checked={paymentType === PAYMENT_TYPE.CASH} />
                        <label htmlFor="card" className="ml-2">Efectivo</label>
                      </div>
                    </div>
                  </div>

                </div>
              </Dialog>

              <Dialog visible={showBillDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={`Cuenta Mesa ${table.number}`} modal footer={showBillDialogFooter} onHide={hideBillDialog}
                className={classNames({
                  "dialog-account-container hide-iconClose-onDonwload": !showDownloadButtons,
                  "dialog-account-container show-iconClose-onDonwload": showDownloadButtons
                })}>
                <div className='product-add-order'>
                  <div className='account-info'>
                    <div>
                      <span className="font-bold mr-5">Mesa:</span>
                      <span className='font-bold'>{`${table.number}`}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: "0.5rem" }}>
                      <span className="font-bold mr-5">Método de pago:</span>
                      {!showDownloadButtons ?
                        <>
                          {paymentData?.paymentType === PAYMENT_TYPE.CARD || paymentData?.paymentType === PAYMENT_TYPE.APP ?
                            <span className="font-bold mr-5">Tarjeta</span>
                            : <span className="font-bold mr-5">Efectivo</span>
                          }
                        </>
                        :
                        <i className={classNames({
                          "pi pi-credit-card": paymentData?.paymentType === PAYMENT_TYPE.CARD || paymentData?.paymentType === PAYMENT_TYPE.APP,
                          "pi pi-wallet": paymentData?.paymentType === PAYMENT_TYPE.CASH
                        })} style={{ fontSize: '1.5rem' }}></i>
                      }
                    </div>
                  </div>
                  <div>
                    <div>
                      <span><strong>Fecha:</strong> {moment(paymentData?.createdAt).format('DD/MM/YYYY')}</span>
                    </div>
                    <div style={{ marginTop: "0.5rem" }}>
                      <span><strong>Hora:</strong> {moment(paymentData?.createdAt).format('HH:mm:ss')}</span>
                    </div>
                  </div>
                </div>
                <div className='product-add-order' style={{ marginTop: '1.5rem' }}>
                  <DataTable value={groupOrdersStatus(orders)} style={{ width: '100%' }} footerColumnGroup={totalPaymentFooter}>
                    <Column field="quantity" header="UNIDADES"></Column>
                    <Column field="product.title" header="PRODUCTO" style={{ minWidth: '10rem' }}></Column>
                    <Column field="product.price" header="IMPORTE" body={priceBodyTemplate}></Column>
                  </DataTable>
                </div>
              </Dialog>

              <Dialog visible={finishPaymentDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Cuenta pagada" modal footer={finishPaymentDialogFooter} onHide={hideFinishPaymentDialog}>
                <div className="confirmation-content">
                  <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                  <span>Seguro de que quieres marcar la cuenta como pagada?</span>
                </div>
              </Dialog>

              <Dialog visible={confirmCreateAccountDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Crear cuenta" modal footer={confirmCreateAccountDialogFooter} onHide={hideConfirmCreateAccountDialog}>
                <div className="confirmation-content">
                  <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                  {table && <span>Estas seguro que quieres generar la cuenta de la mesa {table.number}?</span>}
                </div>
              </Dialog>
              <Dialog visible={closeTableDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Finalizar mesa" modal footer={closeTableDialogFooter} onHide={hideCloseTableDialog}>
                <div className="confirmation-content">
                  <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                  {table && <span>Estas seguro que quieres cerrar la mesa {table.number}?</span>}
                </div>
              </Dialog>
            </>
          }
        </div>
      }
    </>
  )
}
