import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTable } from '../../../hooks';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

export function TablesAdmin() {

  const { tables, getTables } = useTable();

  let emptyTable = {
    number: null,
    active: true,
  };

  const toast = useRef(null);
  const dt = useRef(null);

  const [tablesCrud, setTablesCrud] = useState(null);
  const [tableDialog, setTableDialog] = useState(false);
  const [deleteTableDialog, setDeleteTableDialog] = useState(false);
  const [deleteTablesDialog, setDeleteTablesDialog] = useState(false);
  const [table, setTable] = useState(emptyTable);
  const [selectedTables, setSelectedTables] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [actionName, setActionName] = useState('');

  const [isEditTable, setIsEditTable] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);
  const [titleTableEdit, setTitleTableEdit] = useState('');
  const [lastTableEdit, setlastTableEdit] = useState({});

  useEffect(() => {
    getTables();
  }, [refreshTable, getTables])

  useEffect(() => {
    if (tables) {
      setTablesCrud(tables);
    }
  }, [tables]);

  const onRefresh = () => setRefreshTable((state) => !state);

  const openNew = () => {
    setIsEditTable(false);
    setTable(emptyTable);
    setSubmitted(false);
    setTableDialog(true);
    setActionName('Añadir Mesa');
  };

  const hideDialog = () => {
    setSubmitted(false);
    setTableDialog(false);
    setValidationErrors({});
  };

  const hideDeleteTableDialog = () => {
    setDeleteTableDialog(false);
  };

  const hideDeleteTablesDialog = () => {
    setDeleteTablesDialog(false);
  };

  const saveTable= async () => {

    const isValid = validateFields();
    setSubmitted(true);

    if (isValid) {
      //EDIT
      if (table.id) {

        const editTable = {
          ...(lastTableEdit.title !== table.title && { title: table.title }),
          ...(lastTableEdit.imageFile !== table.imageFile && { image: table.imageFile }),
        };

        /*try {
          await updateCategory(category.id, editCategory);
          onRefresh();
          toast.current.show({ severity: 'success', summary: 'Operación Exitosa', detail: `Categoría ${category.title} actualizada correctamente`, life: 3000 });
        } catch (error) {
          console.log(error);
        }*/

        //SAVE
      } else {

        const newTable = {
          title: table.title,
          image: table.imageFile,
        };

        /*try {
          await addCategory(newCategory);
          onRefresh();
          toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: `Categoría ${category.title} creada correctamente`, life: 3000 });
        } catch (error) {
          console.log(error);
        }*/
      }

      setSubmitted(false);
      setValidationErrors({});
      setTableDialog(false);
      setTable(emptyTable);
    }
  };

  const editTable = (tableEdit) => {
    setTitleTableEdit(tableEdit.number);
    setlastTableEdit(tableEdit);
    setSubmitted(false);
    setIsEditTable(true);
    setTable({ ...tableEdit });
    setTableDialog(true);
    setActionName('Editar Categoría');
  };

  const confirmDeleteTable = (table) => {
    setTable(table);
    setDeleteTableDialog(true);
  };

  const deleteSelectedTable = async () => {
    /*try {
      await deleteCategory(category.id);
      onRefresh();
    } catch (error) {
      console.log(error);
    }*/

    setDeleteTableDialog(false);
    setTable(emptyTable);
    toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Mesa borrada correctamente', life: 3000 });
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteTablesDialog(true);
  };

  const deleteSelectedTables = async () => {
    /*try {
      await Promise.all(selectedCategories.map(async (category) => {
        await deleteCategory(category.id);
      }));
      onRefresh();
    } catch (error) {
      console.log(error);
    }*/

    setDeleteTablesDialog(false);
    setSelectedTables(null);

    if (selectedTables.length === 1) {
      toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Mesa borrada correctamente', life: 3000 });
    }

    else {
      toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Mesas borradas correctamente', life: 3000 });
    }
  };

  const onInputChange = (e, name) => {
    const val = e.target.value || '';

    let errors = { ...validationErrors };

    const filteredTable = tables.filter(table => table.title.toLowerCase() === val.toLowerCase());

    if (val.length < 2) {
      errors.title = "El nombre de la mesa tiene que tener mínimo 2 letras";
    } else {
      delete errors.title;
    }

    if (!isEditTable && filteredTable.length > 0) {
      errors.title = "El nombre de la mesa ya esta utilizada";
    }

    setTable(prevTable => ({ ...prevTable, [name]: val }));
    setValidationErrors(errors);
  };

  const validateFields = () => {
    const errors = {};
    const filteredTable = tables.filter(cat => cat.title.toLowerCase() === table.title.toLowerCase());

    if (!table.title) {
      errors.title = "El nombre de la categoría es requerida";
    } else if (table.title.length < 2) {
      errors.title = "El nombre de la categoría tiene que tener mínimo 2 letras";
    } else if (!isEditTable && filteredTable.length > 0) {
      errors.title = "El nombre de la categoría ya esta utilizada";
    } else if (isEditTable && filteredTable.length > 0 && titleTableEdit !== table.title) {
      errors.title = "El nombre de la categoría ya esta utilizada";
    }

    if (!table.image) {
      errors.image = "La imagen es requerida";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="Nuevo" icon="pi pi-plus" severity="success" onClick={openNew} />
        <Button label="Borrar" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedTables || !selectedTables.length} />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
  };

  const activeBodyTemplate = (rowData) => {
    return <i className={classNames('pi', (rowData.active ? 'text-green-500 pi-check-circle' : 'text-red-500 pi-times-circle'))}></i>;
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editTable(rowData)} />
        <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteTable(rowData)} />
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h3 className="m-0">PANEL DE MESAS</h3>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
      </span>
    </div>
  );
  const tableDialogFooter = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Guardar" icon="pi pi-check" onClick={saveTable} disabled={!submitted || Object.keys(validationErrors).length === 0 ? false : true} />
    </React.Fragment>
  );
  const deleteTableDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteTableDialog} />
      <Button label="Si" icon="pi pi-check" severity="danger" onClick={deleteSelectedTable} />
    </React.Fragment>
  );
  const deleteTablesDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteTablesDialog} />
      <Button label="Si" icon="pi pi-check" severity="danger" onClick={deleteSelectedTables} />
    </React.Fragment>
  );

  return (
    <div>
      <Toast ref={toast} />
      <div className="card" >
        <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

        <DataTable ref={dt} value={tablesCrud} selection={selectedTables} onSelectionChange={(e) => setSelectedTables(e.value)}
          dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} mesas" globalFilter={globalFilter} header={header}>
          <Column selectionMode="multiple" exportable={false}></Column>
          <Column field="number" header="Número de mesa" sortable style={{ minWidth: '22rem' }}></Column>
          <Column field="active" header="Activa" sortable dataType="boolean" body={activeBodyTemplate} style={{ minWidth: '8rem' }}></Column>
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
        </DataTable>
      </div>

      <Dialog visible={tableDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={actionName} modal className="p-fluid" footer={tableDialogFooter} onHide={hideDialog}>
        <div className="field">
          <label htmlFor="title" className="font-bold">
            Número
          </label>
          <InputText id="title" value={table.title} onChange={(e) => onInputChange(e, 'title')} required autoFocus
            className={classNames({ "p-invalid": submitted && (!table.title || validationErrors.title) })} />
          {submitted && !table.title
            ? (<small className="p-error">El nombre de la mesa es requerida</small>)
            : submitted && validationErrors.title && (<small className="p-error">{validationErrors.title}</small>)
          }
        </div>
      </Dialog>

      <Dialog visible={deleteTableDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal footer={deleteTableDialogFooter} onHide={hideDeleteTableDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {table && (
            <span>
              Seguro que quieres eliminar la mesa <b>{table.title}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog visible={deleteTablesDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal footer={deleteTablesDialogFooter} onHide={hideDeleteTablesDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {table && <span>Seguro que quieres eliminar las mesas seleccionadas?</span>}
        </div>
      </Dialog>
    </div>
  );
}
