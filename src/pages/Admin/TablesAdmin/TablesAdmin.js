import React, { useState, useEffect, useRef } from 'react';
import { useTable } from '../../../hooks';
import { AccessDenied } from '../../AccessdDenied';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputSwitch } from "primereact/inputswitch";
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { ProgressSpinner } from 'primereact/progressspinner';
import QRCode from 'react-qr-code';
import '../../../scss/AlignComponent.scss';

export function TablesAdmin() {

  let emptyTable = {
    number: 0,
    active: true,
  };

  const toast = useRef(null);
  const dt = useRef(null);
  const qrRef = useRef(null);
  const { tables, loading, loadingCrud, error, getTables, addTable, updateTable, deleteTable } = useTable();

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
  const [lastTableEdit, setlastTableEdit] = useState({});

  const [showTableQRDialog, setShowTableQRDialog] = useState(false);
  const [tableNumberDialog, setTableNumberDialog] = useState(null);
  const [tableIdDialog, setTableIdDialog] = useState(null);

  useEffect(() => {
    getTables();
  }, [refreshTable, getTables])

  useEffect(() => {
    if (tables) {
      const tablesUpdate = [];

      tables.forEach(table => {

        if (table.tableBooking) {
          tablesUpdate.push({ ...table, busy: true });
        }

        else {
          tablesUpdate.push({ ...table, busy: false });
        }
      });

      setTablesCrud(tablesUpdate);
    }
  }, [tables]);

  const onRefresh = () => setRefreshTable((state) => !state);

  const openNew = () => {
    setIsEditTable(false);
    setTable(emptyTable);
    setSubmitted(false);
    setTableDialog(true);
    setActionName('Añadir Mesa');
    document.body.classList.add('body-scroll-lock');
  };

  const hideDialog = () => {
    setSubmitted(false);
    setTableDialog(false);
    setValidationErrors({});
    document.body.classList.remove('body-scroll-lock');
  };

  const hideDeleteTableDialog = () => {
    setDeleteTableDialog(false);
  };

  const hideDeleteTablesDialog = () => {
    setDeleteTablesDialog(false);
  };

  const hideShowTableQRDialog = () => {
    setShowTableQRDialog(false);
  };

  const showError = (error) => {
    toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: error.message, life: 3000 });
  }

  const saveTable = async () => {

    const isValid = validateFields();
    setSubmitted(true);

    if (isValid) {

      if (table.id) {

        if (table.tableBooking) {
          toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: 'No se puede actualizar una mesa ocupada actualmente.', life: 3000 });
        }

        else {
          const editTable = {
            ...(lastTableEdit.number !== table.number && { number: table.number }),
            ...(lastTableEdit.active !== table.active && { active: table.active }),
          };

          try {
            await updateTable(table.id, editTable);
            onRefresh();
            toast.current.show({ severity: 'success', summary: 'Operación Exitosa', detail: `Mesa número ${table.number} actualizada correctamente`, life: 3000 });
          } catch (error) {
            showError(error);
          }
        }

      } else {

        const newTable = {
          number: table.number,
          active: table.active,
        };

        try {
          await addTable(newTable);
          onRefresh();
          toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: `Mesa número ${table.number} creada correctamente`, life: 3000 });
        } catch (error) {
          showError(error);
        }
      }

      setSubmitted(false);
      setValidationErrors({});
      setTableDialog(false);
      setTable(emptyTable);
      document.body.classList.remove('body-scroll-lock');
    }
  };

  const editTable = (tableEdit) => {
    setlastTableEdit(tableEdit);
    setSubmitted(false);
    setIsEditTable(true);
    setTable({ ...tableEdit });
    setTableDialog(true);
    setActionName('Editar Mesa');
  };

  const confirmDeleteTable = (table) => {
    setTable(table);
    setDeleteTableDialog(true);
  };

  const deleteSelectedTable = async () => {

    if (table.tableBooking) {
      toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: 'No se puede borrar una mesa ocupada actualmente.', life: 3000 });
    }

    else {
      try {
        await deleteTable(table.id);
        onRefresh();
        toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Mesa borrada correctamente.', life: 3000 });
      } catch (error) {
        showError(error);
      }
    }

    setDeleteTableDialog(false);
    setTable(emptyTable);
  };

  const showQRTable = (table) => {
    setShowTableQRDialog(true);
    setTableNumberDialog(table.number);
    setTableIdDialog(table.id);
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const handlePrint = () => {
    const content = qrRef.current;
    const print = window.open("", "newwin");
    print.document.write(content.innerHTML);
    print.print();
    print.close();
  };

  const confirmDeleteSelected = () => {
    setDeleteTablesDialog(true);
  };

  const deleteSelectedTables = async () => {

    try {
      let hasTableWithBooking = false;
      selectedTables.forEach(table => {
        if (table.tableBooking) {
          hasTableWithBooking = true;
        }
      });

      if (hasTableWithBooking && selectedTables.length === 1) {
        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: 'No se puede borrar una mesa ocupada actualmente.', life: 3000 });
      }

      else if (hasTableWithBooking && selectedTables.length > 1) {
        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: 'No se pueden borrar las mesas seleccionadas porque una o más están ocupadas actualmente.', life: 3000 });
      }

      else {
        await Promise.all(selectedTables.map(async (table) => {
          await deleteTable(table.id);
        }));
        onRefresh();

        if (selectedTables.length === 1) {
          toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Mesa borrada correctamente', life: 3000 });
        }

        else {
          toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Mesas borradas correctamente', life: 3000 });
        }
      }
    } catch (error) {
      showError(error);
    }

    setDeleteTablesDialog(false);
    setSelectedTables(null);
  };

  const onInputChange = (e, name) => {
    let val = e.target.value;
    let errors = { ...validationErrors };

    switch (name) {
      case "number":
        const filteredTable = tables.filter(table => table.number === val);
        if (val !== lastTableEdit.number && filteredTable.length > 0) {
          errors.number = "El número de mesa ya esta utilizado";
        } else {
          delete errors.number;
        }
        break;
      default:
        break;
    }

    setTable(prevTable => ({ ...prevTable, [name]: val }));
    setValidationErrors(errors);
  };

  const validateFields = () => {
    const errors = {};
    const filteredTable = tables.filter(tab => tab.number === table.number);

    if (!isEditTable && filteredTable.length > 0) {
      errors.number = "El número de mesa ya esta utilizado";
    } else if (isEditTable && filteredTable.length > 0 && lastTableEdit.number !== table.number) {
      errors.number = "El número de mesa ya esta utilizado";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const statusBodyTemplate = (table) => {
    return <Tag value={table.busy ? 'OCUPADA' : 'VACÍA'} severity={table.busy ? 'danger' : 'success'}></Tag>;
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
        <Button icon="pi pi-qrcode" rounded outlined severity='warning' className="mr-2" onClick={() => showQRTable(rowData)} />
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

  const showTableQRDialogFooter = (
    <div className='footerBill'>
      <Button label="Imprimir QR" className="bttnFoot" onClick={handlePrint} />
    </div>
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
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={tablesCrud} selection={selectedTables} onSelectionChange={(e) => setSelectedTables(e.value)}
                  dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} emptyMessage='No se han encontrado mesas'
                  paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                  currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} mesas" globalFilter={globalFilter} header={header}>
                  <Column selectionMode="multiple" exportable={false}></Column>
                  <Column field="number" header="Número de mesa" sortable style={{ minWidth: '8rem' }} ></Column>
                  <Column field="busy" header="Estado" sortable dataType="boolean" body={statusBodyTemplate} style={{ minWidth: '10rem' }}></Column>
                  <Column field="active" header="Activa" sortable dataType="boolean" body={activeBodyTemplate}></Column>
                  <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
              </div>

              <Dialog visible={tableDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={actionName} modal className="p-fluid" footer={tableDialogFooter} onHide={hideDialog}>
                {loadingCrud && <ProgressSpinner style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }} />}
                <div className="field">
                  <label htmlFor="number" className="font-bold">
                    Número
                  </label>
                  <InputNumber inputId="number" value={table.number} onValueChange={(e) => onInputChange(e, 'number')} mode="decimal"
                    showButtons min={1} className={classNames({ "p-invalid": submitted && (!table.number || validationErrors.number) })} />
                  {submitted && validationErrors.number && (<small className="p-error">{validationErrors.number}</small>)}
                </div>

                <div className="field" style={{ height: "2.5rem", display: "flex", alignItems: "center" }}>
                  <div className="p-field-checkbox" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <InputSwitch
                      id='active'
                      checked={table.active}
                      onChange={(e) => onInputChange(e, 'active')}
                    />
                    <label htmlFor="active" className="font-bold" style={{ marginLeft: "1rem", alignSelf: "center" }}>
                      Mesa Activa
                    </label>
                  </div>
                </div>
              </Dialog>

              <Dialog visible={deleteTableDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal footer={deleteTableDialogFooter} onHide={hideDeleteTableDialog}>
                <div className="confirmation-content">
                  <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                  {table && (
                    <span>
                      Seguro que quieres eliminar la mesa número <b>{table.number}</b>?
                    </span>
                  )}
                </div>
              </Dialog>

              <Dialog visible={deleteTablesDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal footer={deleteTablesDialogFooter} onHide={hideDeleteTablesDialog}>
                <div className="confirmation-content">
                  <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                  {table && selectedTables?.length === 1
                    ? <span>Seguro que quieres eliminar la mesa seleccionada?</span>
                    : <span>Seguro que quieres eliminar las mesas seleccionadas?</span>
                  }
                </div>
              </Dialog>

              <Dialog visible={showTableQRDialog} style={{ width: '32rem' }} header={`Código QR Mesa ${tableNumberDialog}`} modal footer={showTableQRDialogFooter} onHide={hideShowTableQRDialog}>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }} ref={qrRef} >
                  {tableIdDialog && <QRCode value={`https://irest.netlify.app/${tableIdDialog}`} />}
                </div>
              </Dialog>
            </div>
          }
        </>
      }
    </>
  );
}
