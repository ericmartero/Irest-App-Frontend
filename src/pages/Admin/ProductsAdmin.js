import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useProduct } from '../../hooks';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Image } from 'primereact/image';
import { useDropzone } from 'react-dropzone';

export function ProductsAdmin() {
  let emptyProduct = {
    title: '',
    imageFile: '',
    image: '',
  };

  const toast = useRef(null);
  const dt = useRef(null);

  const { products, getProducts } = useProduct();

  const [productsTable, setProductsTable] = useState(null);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);

  const [product, setProduct] = useState(emptyProduct);

  const [selectedCategories, setSelectedCategories] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [actionName, setActionName] = useState('');

  const [uploadedImage, setUploadedImage] = useState(false);

  const [isEditUser, setIsEditUser] = useState(false)
  const [refreshTable, setRefreshTable] = useState(false);

  useEffect(() => {
    //getCategories();
    getProducts();
  }, [refreshTable])

  useEffect(() => {
    if (products) {
      setProductsTable(products);
    }
  }, [products]);

  const onRefresh = () => setRefreshTable((state) => !state);

  const openNew = () => {
    setIsEditUser(false);
    setProduct(emptyProduct);
    setSubmitted(false);
    setProductDialog(true);
    setActionName('Añadir Producto');
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
    setValidationErrors({});
    setUploadedImage(false);
  };

  const hideDeleteCategoryDialog = () => {
    setDeleteProductDialog(false);
  };

  const hideDeleteCategoriesDialog = () => {
    setDeleteProductsDialog(false);
  };

  const showError = (error) => {
    toast.current.show({ severity: 'error', summary: 'Operación Fallida', detail: error.message, life: 3000 });
  }

  const saveCategory = async () => {

    const isValid = validateFields();
    setSubmitted(true);

    if (isValid) {

      //EDITAR
      if (product.id) {

        const editUser = {
          ...(product.title && { title: product.title }),
          ...(product.imageFile && { image: product.imageFile }),
        };

        /*try {
          await updateCategory(category.id, editUser);
          onRefresh();
          toast.current.show({ severity: 'success', summary: 'Operación Exitosa', detail: `Categoria ${category.title} actualizada correctamente`, life: 3000 });
        } catch (error) {
          console.log(error);
        }*/

        //ENVIAR
      } else {

        const newCategory = {
          title: product.title,
          image: product.imageFile,
        };

        /*try {
          await addCategory(newCategory);
          onRefresh();
          toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: `Categoria ${category.title} creada correctamente`, life: 3000 });
        } catch (error) {
          console.log(error);
        }*/
      }

      setSubmitted(false);
      setUploadedImage(false);
      setValidationErrors({});
      setProductDialog(false);
      setProduct(emptyProduct);
    }
  };

  const editCategory = (categoryEdit) => {
    setSubmitted(false);
    setIsEditUser(true);
    setProduct({ ...categoryEdit });
    setProductDialog(true);
    setActionName('Editar Producto');
  };

  const confirmDeleteCategory = (category) => {
    setProduct(category);
    setDeleteProductDialog(true);
  };

  const deleteSelectedCategory = async () => {
    /*try {
      await deleteCategory(category.id);
      onRefresh();
    } catch (error) {
      console.log(error);
    }*/

    setDeleteProductDialog(false);
    setProduct(emptyProduct);
    toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Categoria borrada correctamente', life: 3000 });
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  };

  const deleteSelectedCategories = async () => {
    /*try {
      await Promise.all(selectedCategories.map(async (category) => {
        await deleteCategory(category.id);
      }));
      onRefresh();
    } catch (error) {
      console.log(error);
    }*/

    setDeleteProductsDialog(false);
    setSelectedCategories(null);

    if (selectedCategories.length === 1) {
      toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Categoria borrada correctamente', life: 3000 });
    }

    else {
      toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Categorias borradas correctamente', life: 3000 });
    }
  };

  const onInputChange = (e, name) => {
    const val = e.target.value || '';

    let errors = { ...validationErrors };

    if (val.length < 2) {
      errors.title = "El título tiene que tener mínimo 2 letras";
    } else {
      delete errors.title;
    }

    setProduct(prevProduct => ({ ...prevProduct, [name]: val }));
    setValidationErrors(errors);
  };

  const validateFields = () => {
    const errors = {};

    if (!product.title) {
      errors.title = "El título es requerido";
    } else if (product.title.length < 2) {
      errors.title = "El título tiene que tener mínimo 2 letras";
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
        <Button label="Borrar" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedCategories || !selectedCategories.length} />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
  };

  const imageBodyTemplate = (rowData) => {
    return <img src={rowData.image} alt={rowData.image} className="shadow-2 border-round" style={{ width: '100px' }} />;
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editCategory(rowData)} />
        <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteCategory(rowData)} />
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
  const userDialogFooter = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Guardar" icon="pi pi-check" onClick={saveCategory} disabled={!submitted || Object.keys(validationErrors).length === 0 ? false : true} />
    </React.Fragment>
  );
  const deleteUserDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteCategoryDialog} />
      <Button label="Si" icon="pi pi-check" severity="danger" onClick={deleteSelectedCategory} />
    </React.Fragment>
  );
  const deleteUsersDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteCategoriesDialog} />
      <Button label="Si" icon="pi pi-check" severity="danger" onClick={deleteSelectedCategories} />
    </React.Fragment>
  );

  return (
    <div>
      <Toast ref={toast} />
      <div className="card" >
        <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

        <DataTable ref={dt} value={productsTable} selection={selectedCategories} onSelectionChange={(e) => setSelectedCategories(e.value)}
          dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} productos" globalFilter={globalFilter} header={header}>
          <Column selectionMode="multiple" exportable={false}></Column>
          <Column field="title" header="Título" sortable style={{ minWidth: '22rem' }}></Column>
          <Column field="image" header="Imagen" body={imageBodyTemplate} style={{ minWidth: '16rem' }}></Column>
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
        </DataTable>
      </div>

      <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={actionName} modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
        <div className="field">
          <label htmlFor="title" className="font-bold">
            Título
          </label>
          <InputText id="title" value={product.title} onChange={(e) => onInputChange(e, 'title')} required autoFocus
            className={classNames({ "p-invalid": submitted && (!product.title || validationErrors.title) })} />
          {submitted && !product.title
            ? (<small className="p-error">El título es requerido</small>)
            : submitted && validationErrors.title && (<small className="p-error">{validationErrors.title}</small>)
          }
        </div>
        <div className="field">
          <label htmlFor="image" className="font-bold" style={{ marginBottom: '0.8rem' }}>
            Imagen
          </label>
          <Button label={isEditUser ? "Cambiar Imagen" : "Subir Imagen"} {...getRootProps()} />
          <input {...getInputProps()} />
          {submitted && validationErrors.image && !uploadedImage && (<small className="p-error">{validationErrors.image}</small>)}
          <div className="imageContent">
            <Image src={product.image} alt="Image" width="100%" />
          </div>

        </div>
      </Dialog>

      <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal footer={deleteUserDialogFooter} onHide={hideDeleteCategoryDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {product && (
            <span>
              Seguro que quieres eliminar el producto <b>{product.title}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog visible={deleteProductsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal footer={deleteUsersDialogFooter} onHide={hideDeleteCategoriesDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {product && <span>Seguro que quieres eliminar los productos seleccionados?</span>}
        </div>
      </Dialog>
    </div>
  );
}
