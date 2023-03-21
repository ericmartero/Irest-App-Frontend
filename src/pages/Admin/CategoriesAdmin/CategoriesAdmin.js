import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { useCategory } from '../../../hooks';
import './CategoriesAdmin.scss';

export function CategoriesAdmin() {

  let emptyCategory = {
    title: '',
    image: '',
  };

  const toast = useRef(null);
  const dt = useRef(null);
  const { categories, getCategories } = useCategory();
  const [categoriesTable, setCategoriesTable] = useState(null);
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [deleteCategoryDialog, setDeleteCategoryDialog] = useState(false);
  const [deleteCategoriesDialog, setDeleteCategoriesDialog] = useState(false);
  const [category, setCategory] = useState(emptyCategory);
  const [selectedCategories, setSelectedCategories] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [actionName, setActionName] = useState('');

  const [uploadedImage, setUploadedImage] = useState(false);

  const [isEditUser, setIsEditUser] = useState(false)
  const [refreshTable, setRefreshTable] = useState(false);

  useEffect(() => {
    getCategories();
    setCategoriesTable(categories);
  }, [categories])

  const onRefresh = () => setRefreshTable((state) => !state);

  const openNew = () => {
    setIsEditUser(false);
    setCategory(emptyCategory);
    setSubmitted(false);
    setCategoryDialog(true);
    setActionName('Añadir Categoria');
  };

  const hideDialog = () => {
    setSubmitted(false);
    setCategoryDialog(false);
    setValidationErrors({});
    setUploadedImage(false);
  };

  const hideDeleteCategoryDialog = () => {
    setDeleteCategoryDialog(false);
  };

  const hideDeleteCategoriesDialog = () => {
    setDeleteCategoriesDialog(false);
  };

  const showError = (error) => {
    toast.current.show({ severity: 'error', summary: 'Operación Fallida', detail: error.message, life: 3000 });
  }

  const saveCategory = async () => {

    const isValid = validateFields();
    setSubmitted(true);

    if (isValid) {

      //EDITAR
      if (category.id) {

        const editUser = {
          ...(category.title && { title: category.title }),
          //IMAGEN
        };

        /*try {
          await updateUser(category.id, editUser);
          onRefresh();
          toast.current.show({ severity: 'success', summary: 'Operación Exitosa', detail: `Usuario ${category.firstName} actualizado correctamente`, life: 3000 });
        } catch (error) {
          showError(error);
        }*/

        //ENVIAR
      } else {

        const newUser = {
          email: category.email,
          firstName: category.firstName,
          password: category.password,
          isActive: category.isActive,
          ...(category.lastName && { lastName: category.lastName }),
        };

        /*try {
          await addUser(newUser);
          onRefresh();
          toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: `Usuario ${category.firstName} creado correctamente`, life: 3000 });
        } catch (error) {
          showError(error);
        }*/
      }

      setSubmitted(false);
      setUploadedImage(false);
      setValidationErrors({});
      setCategoryDialog(false);
      setCategory(emptyCategory);
    }
  };

  const editCategory = (categoryEdit) => {
    setSubmitted(false);
    setIsEditUser(true);
    setCategory({ ...categoryEdit });
    setCategoryDialog(true);
    setActionName('Editar Categoria');
  };

  const confirmDeleteCategory = (category) => {
    setCategory(category);
    setDeleteCategoryDialog(true);
  };

  const deleteSelectedCategory = async () => {
    /*try {
      await deleteUser(category.id);
      onRefresh();
    } catch (error) {
      console.log(error);
    }*/

    setDeleteCategoryDialog(false);
    setCategory(emptyCategory);
    toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Categoria borrada correctamente', life: 3000 });
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteCategoriesDialog(true);
  };

  const deleteSelectedCategories = async () => {
    /*try {
      await Promise.all(selectedCategories.map(async (category) => {
        await deleteUser(category.id);
      }));
      onRefresh();
    } catch (error) {
      console.log(error);
    }*/

    setDeleteCategoriesDialog(false);
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

    switch (name) {
      case "title":
        if (val.length < 2) {
          errors.title = "El título tiene que tener mínimo 2 letras";
        } else {
          delete errors.title;
        }
        break;
      default:
        break;
    }

    setCategory(prevCategory => ({ ...prevCategory, [name]: val }));
    setValidationErrors(errors);
  };

  const validateFields = () => {
    const errors = {};

    if (!category.title) {
      errors.title = "El título es requerido";
    } else if (category.title.length < 2) {
      errors.title = "El título tiene que tener mínimo 2 letras";
    }

    if (!category.image) {
      errors.image = "La imagen es requerida";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onDrop = useCallback((acceptedFile) => {
    const file = acceptedFile[0];
    setCategory({ ...category, image: URL.createObjectURL(file) });
    let errors = { ...validationErrors };
    delete errors.image;
    setValidationErrors(errors);
    setUploadedImage(true);
  }, [category, validationErrors]);

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
      <h3 className="m-0">PANEL DE CATEGORIAS</h3>
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

        <DataTable ref={dt} value={categoriesTable} selection={selectedCategories} onSelectionChange={(e) => setSelectedCategories(e.value)}
          dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} categorias" globalFilter={globalFilter} header={header}>
          <Column selectionMode="multiple" exportable={false}></Column>
          <Column field="title" header="Título" sortable style={{ minWidth: '22rem' }}></Column>
          <Column field="image" header="Imagen" body={imageBodyTemplate} style={{ minWidth: '16rem' }}></Column>
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
        </DataTable>
      </div>

      <Dialog visible={categoryDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={actionName} modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
        <div className="field">
          <label htmlFor="title" className="font-bold">
            Título
          </label>
          <InputText id="title" value={category.title} onChange={(e) => onInputChange(e, 'title')} required autoFocus
            className={classNames({ "p-invalid": submitted && (!category.title || validationErrors.title) })} />
          {submitted && !category.title
            ? (<small className="p-error">El título es requerido</small>)
            : submitted && validationErrors.title && (<small className="p-error">{validationErrors.title}</small>)
          }
        </div>
        <div className="field">
          <label htmlFor="image" className="font-bold" style={{ marginBottom: '0.8rem' }}>
            Imagen
          </label>
          <Button label="Subir Imagen" { ...getRootProps() }/>
          <input { ...getInputProps() } />
          {submitted && validationErrors.image && !uploadedImage && (<small className="p-error">{validationErrors.image}</small>)}
          <div className="imageContent">
            <Image src={category.image} alt="Image" width="100%"/>
          </div>
          
        </div>
      </Dialog>

      <Dialog visible={deleteCategoryDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal footer={deleteUserDialogFooter} onHide={hideDeleteCategoryDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {category && (
            <span>
              Seguro que quieres eliminar la categoria <b>{category.title}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog visible={deleteCategoriesDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal footer={deleteUsersDialogFooter} onHide={hideDeleteCategoriesDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {category && <span>Seguro que quieres eliminar las categorias seleccionadas?</span>}
        </div>
      </Dialog>
    </div>
  );
}
