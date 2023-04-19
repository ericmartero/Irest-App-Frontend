import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useProduct, useCategory, useAuth } from '../../../hooks';
import { AccessDenied } from '../../AccessDenied';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from "primereact/inputswitch";
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Image } from 'primereact/image';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useDropzone } from 'react-dropzone';
import { map } from 'lodash';
import '../../../scss/AlignComponent.scss';
import './ProductsAdmin.scss';

export function ProductsAdmin() {

  let emptyProduct = {
    title: '',
    imageFile: '',
    image: '',
    category: {},
    active: true,
    price: 0.00,
  };

  const toast = useRef(null);
  const dt = useRef(null);
  const { products, loading, loadingCrud, error, getProducts, addProduct, updateProduct, deleteProduct } = useProduct();
  const { categories, getCategories } = useCategory();
  const { auth } = useAuth();

  const [productsTable, setProductsTable] = useState(null);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [actionName, setActionName] = useState('');
  const [uploadedImage, setUploadedImage] = useState(false);
  const [isEditProduct, setIsEditProduct] = useState(false)
  const [refreshTable, setRefreshTable] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(null);
  const [categoriesDropdown, setCategoriesDropdown] = useState([])
  const [lastProductEdit, setlastProductEdit] = useState({});

  useEffect(() => {
    getProducts();
  }, [refreshTable, getProducts])

  useEffect(() => {
    if (products) {
      setProductsTable(products);
    }
  }, [products]);

  useEffect(() => {
    getCategories();
  }, [getCategories])

  useEffect(() => {
    setCategoriesDropdown(formatDropdownData(categories));
  }, [categories])

  const onRefresh = () => setRefreshTable((state) => !state);

  const openNew = () => {
    setIsEditProduct(false);
    setProduct(emptyProduct);
    setSelectedCategories(null);
    setSubmitted(false);
    setProductDialog(true);
    setActionName('Añadir Producto');
    document.body.classList.add('body-scroll-lock');
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
    setValidationErrors({});
    setUploadedImage(false);
    document.body.classList.remove('body-scroll-lock');
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };

  const showError = (error) => {
    toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: error.message, life: 3000 });
  }

  const saveProduct = async () => {

    const isValid = validateFields();
    setSubmitted(true);

    const selectedOption = categoriesDropdown.find((option) => option.value === selectedCategories);

    if (isValid) {

      if (product.id) {

        const editProduct = {
          ...(lastProductEdit.title !== product.title && { title: product.title }),
          ...(lastProductEdit.imageFile !== product.imageFile && { image: product.imageFile }),
          ...(lastProductEdit.price !== product.price && { price: Number(product.price) }),
          ...(lastProductEdit.category.id !== selectedOption.id && { categoryId: selectedOption.id }),
          ...(lastProductEdit.active !== product.active && { active: product.active }),
        };

        try {
          await updateProduct(product.id, editProduct);
          onRefresh();
          toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: `Producto ${product.title} actualizado correctamente`, life: 3000 });
        } catch (error) {
          showError(error);
        }

      } else {

        const newProduct = {
          title: product.title,
          image: product.imageFile,
          price: Number(product.price),
          categoryId: selectedOption.id,
          active: product.active,
        };

        try {
          await addProduct(newProduct);
          onRefresh();
          toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: `Producto ${product.title} creado correctamente`, life: 3000 });
        } catch (error) {
          showError(error);
        }
      }

      setSubmitted(false);
      setUploadedImage(false);
      setValidationErrors({});
      setProductDialog(false);
      setProduct(emptyProduct);
      document.body.classList.remove('body-scroll-lock');
    }
  };

  const editProduct = (productEdit) => {
    setlastProductEdit(productEdit);
    setSubmitted(false);
    setIsEditProduct(true);
    setProduct({ ...productEdit });
    setSelectedCategories(productEdit.category.title);
    setProductDialog(true);
    setActionName('Editar Producto');
  };

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  };

  const deleteSelectedProduct = async () => {
    try {
      await deleteProduct(product.id);
      onRefresh();
      toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Producto borrado correctamente', life: 3000 });
    } catch (error) {
      showError(error);
    }

    setDeleteProductDialog(false);
    setProduct(emptyProduct);
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  };

  const deleteSelectedProducts = async () => {
    let deleteFailed = false;

    try {
      await Promise.all(selectedProducts.map(async (product) => {
        await deleteProduct(product.id);
      }));
      onRefresh();
    } catch (error) {
      deleteFailed = true;
      toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: 'No se ha podido borrar el producto o los productos seleccionados debido a que está siendo utilizado en los pedidos.', life: 3000 });
    }

    if (!deleteFailed) {
      if (selectedProducts.length === 1) {
        toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Producto borrado correctamente', life: 3000 });
      } else {
        toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Productos borrados correctamente', life: 3000 });
      }
    }

    setDeleteProductsDialog(false);
    setSelectedProducts(null);
  };

  const formatCurrency = (value) => {
    return value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
  };

  const formatDropdownData = (data) => {
    return map(data, (item) => ({
      id: item.id,
      value: item.title
    }));
  }

  const onInputChange = (e, name) => {

    let errors = { ...validationErrors };
    let val;

    switch (name) {
      case "title":
        val = e.target.value || '';
        const filteredProduct = products.filter(product => product.title.toLowerCase() === val.toLowerCase());
        if (val.length < 2) {
          errors.title = "El nombre del producto tiene que tener mínimo 2 letras";
        } else if (val !== lastProductEdit.title && filteredProduct.length > 0) {
          errors.title = "El nombre del producto ya esta utilizado";
        } else {
          delete errors.title;
        }
        break;
      case "price":
        val = parseFloat(e.value).toFixed(2);
        break;
      case "active":
        val = e.target.value;
        break;
      default:
        break;
    }

    setProduct(prevProduct => ({ ...prevProduct, [name]: val }));
    setValidationErrors(errors);
  };

  const onDropdownChange = (value) => {

    let errors = { ...validationErrors };
    setSelectedCategories(value);

    if (value === null) {
      errors.category = "La categoría es requerida";
    } else {
      delete errors.category;
    }

    setValidationErrors(errors);
  };

  const validateFields = () => {
    const errors = {};
    const filteredProduct = products.filter(prod => prod.title.toLowerCase() === product.title.toLowerCase());

    if (!product.title) {
      errors.title = "El nombre del producto es requerido";
    } else if (product.title.length < 2) {
      errors.title = "El nombre del producto tiene que tener mínimo 2 letras";
    } else if (!isEditProduct && filteredProduct.length > 0) {
      errors.title = "El nombre de la categoría ya esta utilizada";
    } else if (isEditProduct && filteredProduct.length > 0 && lastProductEdit.title !== product.title) {
      errors.title = "El nombre de la categoría ya esta utilizada";
    }

    if (selectedCategories === null) {
      errors.category = "La categoría es requerida";
    }

    if (!product.image) {
      errors.image = "La imagen es requerida";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onDrop = useCallback((acceptedFile) => {
    const file = acceptedFile[0];
    setProduct({ ...product, imageFile: file, image: URL.createObjectURL(file) });
    let errors = { ...validationErrors };
    delete errors.image;
    setValidationErrors(errors);
    setUploadedImage(true);
  }, [product, validationErrors]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpeg'],
    },
    noKeyboard: true,
    multiple: false,
    onDrop
  })

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="Nuevo" icon="pi pi-plus" severity="success" onClick={openNew} />
        <Button label="Borrar" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
  };

  const imageBodyTemplate = (rowData) => {
    return <img src={rowData.image} alt={rowData.image} className="shadow-2 border-round" style={{ width: '100px' }} />;
  };

  const activeBodyTemplate = (rowData) => {
    return <i className={classNames('pi', (rowData.active ? 'text-green-500 pi-check-circle' : 'text-red-500 pi-times-circle'))}></i>;
  };

  const priceBodyTemplate = (rowData) => {
    return formatCurrency(rowData.price);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
        <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h3 className="m-0">PANEL DE PRODUCTOS</h3>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
      </span>
    </div>
  );
  const productDialogFooter = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} className="bttnFoot" />
      <Button label="Guardar" icon="pi pi-check" onClick={saveProduct} disabled={!submitted || Object.keys(validationErrors).length === 0 ? false : true} />
    </React.Fragment>
  );
  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
      <Button label="Si" icon="pi pi-check" severity="danger" onClick={deleteSelectedProduct} />
    </React.Fragment>
  );
  const deleteProductsDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductsDialog} />
      <Button label="Si" icon="pi pi-check" severity="danger" onClick={deleteSelectedProducts} />
    </React.Fragment>
  );

  return (
    <>
      {error ? <AccessDenied /> :
        <>
          <Toast ref={toast} />
          {loading ?
            <div className="align-container">
              <ProgressSpinner />
            </div>
            :
            <div>
              <div className="card" >
                {auth?.me.user.roles.includes('admin') &&
                  <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                }

                <DataTable ref={dt} value={productsTable} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                  dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} emptyMessage='No se han encontrado productos'
                  paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                  currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} productos" globalFilter={globalFilter} header={header}>
                  {auth?.me.user.roles.includes('admin') &&
                    <Column selectionMode="multiple" exportable={false}></Column>
                  }
                  <Column field="title" header="Producto" sortable style={{ minWidth: '14rem' }}></Column>
                  <Column field="image" header="Imagen" body={imageBodyTemplate} style={{ minWidth: '12rem' }}></Column>
                  <Column field="price" header="Precio" body={priceBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                  <Column field="category.title" header="Categoría" sortable style={{ minWidth: '12rem' }}></Column>
                  <Column field="active" header="Activo" sortable dataType="boolean" body={activeBodyTemplate} style={{ minWidth: '8rem' }}></Column>
                  {auth?.me.user.roles.includes('admin') &&
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                  }
                </DataTable>
              </div>

              <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={actionName} modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                {loadingCrud && <ProgressSpinner style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }} />}
                <div className="field">
                  <label htmlFor="title" className="font-bold">
                    Producto
                  </label>
                  <InputText id="title" value={product.title} onChange={(e) => onInputChange(e, 'title')} required autoFocus
                    className={classNames({ "p-invalid": submitted && (!product.title || validationErrors.title) })} />
                  {submitted && !product.title
                    ? (<small className="p-error">El nombre del producto es requerido</small>)
                    : submitted && validationErrors.title && (<small className="p-error">{validationErrors.title}</small>)
                  }
                </div>

                <div className="field">
                  <label htmlFor="price" className="font-bold">
                    Precio
                  </label>
                  <InputNumber inputId="price" value={product.price} onValueChange={(e) => onInputChange(e, 'price')} showButtons buttonLayout="horizontal" step={0.25}
                    decrementButtonClassName="p-button-primary" incrementButtonClassName="p-button-primary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                    mode="currency" currency="EUR" min={0.01} />
                </div>

                <div className="field">
                  <label htmlFor="categoria" className="font-bold">
                    Categoría
                  </label>
                  <Dropdown value={selectedCategories} onChange={(e) => onDropdownChange(e.value)} options={categoriesDropdown} optionLabel="value"
                    placeholder="Selecciona una categoría" appendTo="self" className={classNames({ "p-invalid": submitted && (validationErrors.category) })} />
                  {submitted && validationErrors.category && (<small className="p-error">{validationErrors.category}</small>)}
                </div>

                <div className="field" style={{ height: "2.5rem", display: "flex", alignItems: "center" }}>
                  <div className="p-field-checkbox switchActive">
                    <InputSwitch
                      id='active'
                      checked={product.active}
                      onChange={(e) => onInputChange(e, 'active')}
                    />
                    <label htmlFor="active" className="font-bold" style={{ marginLeft: "1rem", alignSelf: "center" }}>
                      Producto Activo
                    </label>
                  </div>
                </div>

                <div className="field imageField">
                  <label htmlFor="image" className="font-bold" style={{ marginBottom: '0.8rem' }}>
                    Imagen
                  </label>
                  <Button className='buttonImage' label={isEditProduct || uploadedImage ? "Cambiar Imagen" : "Subir Imagen"} {...getRootProps()} />
                  <input {...getInputProps()} />
                  {submitted && validationErrors.image && !uploadedImage && (<small className="p-error">{validationErrors.image}</small>)}
                  <div className="imageContent">
                    <Image src={product.image} alt="Image" width="100%" />
                  </div>

                </div>
              </Dialog>

              <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                  <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                  {product && (
                    <span>
                      Seguro que quieres eliminar el producto <b>{product.title}</b>?
                    </span>
                  )}
                </div>
              </Dialog>

              <Dialog visible={deleteProductsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                <div className="confirmation-content">
                  <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                  {product && selectedProducts?.length === 1
                    ? <span>Seguro que quieres eliminar el producto seleccionado?</span>
                    : <span>Seguro que quieres eliminar los productos seleccionados?</span>
                  }
                </div>
              </Dialog>
            </div>
          }
        </>
      }
    </>
  );
}
