import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCategory } from '../../../hooks';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Image } from 'primereact/image';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputSwitch } from "primereact/inputswitch";
import { useDropzone } from 'react-dropzone';
import '../../../scss/AlignComponent.scss';
import './CategoriesAdmin.scss';

export function CategoriesAdmin() {

  let emptyCategory = {
    title: '',
    chefVisible: false,
    imageFile: '',
    image: '',
  };

  const toast = useRef(null);
  const dt = useRef(null);
  const { categories, loading, loadingCrud, getCategories, addCategory, updateCategory, deleteCategory } = useCategory();

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
  const [isEditCategory, setIsEditCategory] = useState(false)
  const [refreshTable, setRefreshTable] = useState(false);
  const [lastCategoryEdit, setlastCategoryEdit] = useState({});

  useEffect(() => {
    getCategories();
  }, [refreshTable, getCategories])

  useEffect(() => {
    if (categories) {
      setCategoriesTable(categories);
    }
  }, [categories]);

  const onRefresh = () => setRefreshTable((state) => !state);

  const openNew = () => {
    setIsEditCategory(false);
    setCategory(emptyCategory);
    setSubmitted(false);
    setCategoryDialog(true);
    setActionName('Añadir Categoría');
    document.body.classList.add('body-scroll-lock');
  };

  const hideDialog = () => {
    setSubmitted(false);
    setCategoryDialog(false);
    setValidationErrors({});
    setUploadedImage(false);
    document.body.classList.remove('body-scroll-lock');
  };

  const hideDeleteCategoryDialog = () => {
    setDeleteCategoryDialog(false);
  };

  const hideDeleteCategoriesDialog = () => {
    setDeleteCategoriesDialog(false);
  };

  const saveCategory = async () => {

    const isValid = validateFields();
    setSubmitted(true);

    if (isValid) {

      if (category.id) {

        const editCategory = {
          ...(lastCategoryEdit.title !== category.title && { title: category.title }),
          ...(lastCategoryEdit.chefVisible !== category.chefVisible && { chefVisible: category.chefVisible }),
          ...(lastCategoryEdit.imageFile !== category.imageFile && { image: category.imageFile }),
        };

        try {
          await updateCategory(category.id, editCategory);
          onRefresh();
          toast.current.show({ severity: 'success', summary: 'Operación Exitosa', detail: `Categoría ${category.title} actualizada correctamente`, life: 3000 });
        } catch (error) {
          console.log(error);
        }

      } else {

        const newCategory = {
          title: category.title,
          chefVisible: category.chefVisible,
          image: category.imageFile,
        };

        try {
          await addCategory(newCategory);
          onRefresh();
          toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: `Categoría ${category.title} creada correctamente`, life: 3000 });
        } catch (error) {
          console.log(error);
        }
      }

      setSubmitted(false);
      setUploadedImage(false);
      setValidationErrors({});
      setCategoryDialog(false);
      setCategory(emptyCategory);
      document.body.classList.remove('body-scroll-lock');
    }
  };

  const editCategory = (categoryEdit) => {
    setlastCategoryEdit(categoryEdit);
    setSubmitted(false);
    setIsEditCategory(true);
    setCategory({ ...categoryEdit });
    setCategoryDialog(true);
    setActionName('Editar Categoría');
  };

  const confirmDeleteCategory = (category) => {
    setCategory(category);
    setDeleteCategoryDialog(true);
  };

  const deleteSelectedCategory = async () => {
    try {
      await deleteCategory(category.id);
      onRefresh();
    } catch (error) {
      console.log(error);
    }

    setDeleteCategoryDialog(false);
    setCategory(emptyCategory);
    toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Categoría borrada correctamente', life: 3000 });
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteCategoriesDialog(true);
  };

  const deleteSelectedCategories = async () => {
    try {
      await Promise.all(selectedCategories.map(async (category) => {
        await deleteCategory(category.id);
      }));
      onRefresh();
    } catch (error) {
      console.log(error);
    }

    setDeleteCategoriesDialog(false);
    setSelectedCategories(null);

    if (selectedCategories.length === 1) {
      toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Categoría borrada correctamente', life: 3000 });
    }

    else {
      toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Categorías borradas correctamente', life: 3000 });
    }
  };

  const onInputChange = (e, name) => {
    const val = e.target.value;

    let errors = { ...validationErrors };

    if (name === 'title') {
      const filteredCategory = categories.filter(category => category.title.toLowerCase() === val.toLowerCase());

      if (val.length < 2) {
        errors.title = "El nombre de la categoría tiene que tener mínimo 2 letras";
      } else {
        delete errors.title;
      }
  
      if (val !== lastCategoryEdit.title && filteredCategory.length > 0) {
        errors.title = "El nombre de la categoría ya esta utilizada";
      }
    }

    setCategory(prevCategory => ({ ...prevCategory, [name]: val }));
    setValidationErrors(errors);
  };

  const validateFields = () => {
    const errors = {};
    const filteredCategory = categories.filter(cat => cat.title.toLowerCase() === category.title.toLowerCase());

    if (!category.title) {
      errors.title = "El nombre de la categoría es requerida";
    } else if (category.title.length < 2) {
      errors.title = "El nombre de la categoría tiene que tener mínimo 2 letras";
    } else if (!isEditCategory && filteredCategory.length > 0) {
      errors.title = "El nombre de la categoría ya esta utilizada";
    } else if (isEditCategory && filteredCategory.length > 0 && lastCategoryEdit.title !== category.title) {
      errors.title = "El nombre de la categoría ya esta utilizada";
    }

    if (!category.image) {
      errors.image = "La imagen es requerida";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onDrop = useCallback((acceptedFile) => {
    const file = acceptedFile[0];
    setCategory({ ...category, imageFile: file, image: URL.createObjectURL(file) });
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

  const activeBodyTemplate = (rowData) => {
    return <i className={classNames('pi', (rowData.chefVisible ? 'text-green-500 pi-check-circle' : 'text-red-500 pi-times-circle'))}></i>;
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
      <h3 className="m-0">PANEL DE CATEGORÍAS</h3>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
      </span>
    </div>
  );
  const categoryDialogFooter = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Guardar" icon="pi pi-check" onClick={saveCategory} disabled={!submitted || Object.keys(validationErrors).length === 0 ? false : true} />
    </React.Fragment>
  );
  const deleteCategoryDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteCategoryDialog} />
      <Button label="Si" icon="pi pi-check" severity="danger" onClick={deleteSelectedCategory} />
    </React.Fragment>
  );
  const deleteCategoriesDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteCategoriesDialog} />
      <Button label="Si" icon="pi pi-check" severity="danger" onClick={deleteSelectedCategories} />
    </React.Fragment>
  );

  return (
    <>
      <Toast ref={toast} />
      {loading ?
        <div className="align-container">
          <ProgressSpinner />
        </div>
        :
        <div>
          <div className="card" >
            <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

            <DataTable ref={dt} value={categoriesTable} selection={selectedCategories} onSelectionChange={(e) => setSelectedCategories(e.value)}
              dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} emptyMessage='No se han encontrado categorías'
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} categorías" globalFilter={globalFilter} header={header}>
              <Column selectionMode="multiple" exportable={false}></Column>
              <Column field="title" header="Categoría" sortable style={{ minWidth: '22rem' }}></Column>
              <Column field="image" header="Imagen" body={imageBodyTemplate} style={{ minWidth: '16rem' }}></Column>
              <Column field="chefVisible" header="ChefVisible" sortable dataType="boolean" body={activeBodyTemplate} style={{ minWidth: '8rem' }}></Column>
              <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
            </DataTable>
          </div>

          <Dialog visible={categoryDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={actionName} modal className="p-fluid" footer={categoryDialogFooter} onHide={hideDialog}>
            {loadingCrud && <ProgressSpinner style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }} />}
            <div className="field">
              <label htmlFor="title" className="font-bold">
                Categoría
              </label>
              <InputText id="title" value={category.title} onChange={(e) => onInputChange(e, 'title')} required autoFocus
                className={classNames({ "p-invalid": submitted && (!category.title || validationErrors.title) })} />
              {submitted && !category.title
                ? (<small className="p-error">El nombre de la categoría es requerida</small>)
                : submitted && validationErrors.title && (<small className="p-error">{validationErrors.title}</small>)
              }
            </div>
            <div className="field" style={{ height: "2.5rem", display: "flex", alignItems: "center" }}>
              <div className="p-field-checkbox" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <InputSwitch
                  id='chefVisible'
                  checked={category.chefVisible}
                  onChange={(e) => onInputChange(e, 'chefVisible')}
                />
                <label htmlFor="active" className="font-bold" style={{ marginLeft: "1rem", alignSelf: "center" }}>
                  Chef Visible
                </label>
              </div>
            </div>
            <div className="field">
              <label htmlFor="image" className="font-bold" style={{ marginBottom: '0.8rem' }}>
                Imagen
              </label>
              <Button label={isEditCategory || uploadedImage ? "Cambiar Imagen" : "Subir Imagen"} {...getRootProps()} />
              <input {...getInputProps()} />
              {submitted && validationErrors.image && !uploadedImage && (<small className="p-error">{validationErrors.image}</small>)}
              <div className="imageContent">
                <Image src={category.image} alt="Image" width="100%" />
              </div>

            </div>
          </Dialog>

          <Dialog visible={deleteCategoryDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal footer={deleteCategoryDialogFooter} onHide={hideDeleteCategoryDialog}>
            <div className="confirmation-content">
              <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
              {category && (
                <span>
                  Seguro que quieres eliminar la categoría <b>{category.title}</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog visible={deleteCategoriesDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal footer={deleteCategoriesDialogFooter} onHide={hideDeleteCategoriesDialog}>
            <div className="confirmation-content">
              <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
              {category && <span>Seguro que quieres eliminar las categorías seleccionadas?</span>}
            </div>
          </Dialog>
        </div>
      }
    </>
  );
}
