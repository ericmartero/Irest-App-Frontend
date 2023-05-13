import React, { useState, useEffect, useRef } from 'react';
import { useEstablishment } from '../../../hooks';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from "primereact/inputswitch";
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import '../../../scss/AlignComponent.scss';

export function EstablishmentsAdmin() {

  let emptyEstablishment = {
    name: '',
    active: true,
  };

  const toast = useRef(null);
  const dt = useRef(null);
  const { loading, loadingCrud, establishments, getEstablishments, addEstablishment, updateEstablishment } = useEstablishment();

  const [establishmentsCrud, setEstablishmentsCrud] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [actionName, setActionName] = useState('');
  const [refreshTable, setRefreshTable] = useState(false);
  const [selectedEstablishments, setSelectedEstablishments] = useState(null);
  const [establishment, setEstablishment] = useState(emptyEstablishment);
  const [lastEstablishmentEdit, setlastEstablishmentEdit] = useState({});
  const [isEditEstablishment, setIsEditEstablishment] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [establishmentDialog, setEstablishmentDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    getEstablishments();
  }, [getEstablishments, refreshTable])

  useEffect(() => {
    if (establishments) {
      setEstablishmentsCrud(establishments);
    }
  }, [establishments])

  const onRefresh = () => setRefreshTable((state) => !state);

  const openNew = () => {
    setIsEditEstablishment(false);
    setEstablishment(emptyEstablishment);
    setSubmitted(false);
    setEstablishmentDialog(true);
    setActionName('Añadir Establecimiento');
  };

  const editEstablishment = (establishmentEdit) => {
    setlastEstablishmentEdit(establishmentEdit);
    setSubmitted(false);
    setIsEditEstablishment(true);
    setEstablishment({ ...establishmentEdit });
    setEstablishmentDialog(true);
    setActionName('Editar Establecimiento');
  };

  const saveEstablishment = async () => {

    const isValid = validateFields();
    setSubmitted(true);

    if (isValid) {

      if (establishment.id) {

        const editEstablishment = {
          ...(lastEstablishmentEdit.name !== establishment.name && { name: establishment.name }),
          ...(lastEstablishmentEdit.active !== establishment.active && { active: establishment.active }),
        };

        try {
          await updateEstablishment(establishment.id, editEstablishment);
          onRefresh();
          toast.current.show({ severity: 'success', summary: 'Operación Exitosa', detail: `Establecimiento ${establishment.name} actualizado correctamente`, life: 3000 });
        } catch (error) {
          showError(error);
        }

      } else {

        const newEstablishment = {
          name: establishment.name,
          active: establishment.active,
        };

        try {
          await addEstablishment(newEstablishment);
          onRefresh();
          toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: `Establecimiento ${establishment.name} creado correctamente`, life: 3000 });
        } catch (error) {
          showError(error);
        }
      }

      setSubmitted(false);
      setValidationErrors({});
      setEstablishmentDialog(false);
      setEstablishment(emptyEstablishment);
    }
  };

  const hideDialog = () => {
    setSubmitted(false);
    setEstablishmentDialog(false);
    setValidationErrors({});
  };

  const validateFields = () => {
    const errors = {};
    const filteredEstablishment = establishments.filter(est => est.name.toLowerCase() === establishment.name.toLowerCase());

    if (!establishment.name) {
      errors.name = "El nombre del establecimiento es requerido";
    } else if (establishment.name.length < 2) {
      errors.name = "El nombre del establecimiento tiene que tener mínimo 2 letras";
    } else if (!isEditEstablishment && filteredEstablishment.length > 0) {
      errors.name = "El nombre del establecimiento ya esta utilizado";
    } else if (isEditEstablishment && filteredEstablishment.length > 0 && lastEstablishmentEdit.name !== establishment.name) {
      errors.name = "El nombre del establecimiento ya esta utilizado";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onInputChange = (e, name) => {
    const val = e.target.value;

    let errors = { ...validationErrors };

    if (name === 'name') {
      const filteredEstablishment = establishments.filter(establishment => establishment.name.toLowerCase() === val.toLowerCase());

      if (val.length < 2) {
        errors.name = "El nombre del establecimiento tiene que tener mínimo 2 letras";
      } else {
        delete errors.name;
      }

      if (val !== lastEstablishmentEdit.name && filteredEstablishment.length > 0) {
        errors.name = "El nombre del establecimiento ya esta utilizado";
      }
    }

    setEstablishment(prevEstablishment => ({ ...prevEstablishment, [name]: val }));
    setValidationErrors(errors);
  };

  const showError = (error) => {
    toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: error.message, life: 3000 });
  }

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const establishmentDialogFooter = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Guardar" icon="pi pi-check" onClick={saveEstablishment} disabled={!submitted || Object.keys(validationErrors).length === 0 ? false : true} />
    </React.Fragment>
  );

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h3 className="m-0">PANEL DE ESTABLECIMIENTOS</h3>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
        <Button label="Nuevo" icon="pi pi-plus" severity="success" style={{ marginLeft: '1rem' }} onClick={openNew} />
        <Button label="Exportar" icon="pi pi-upload" className="p-button-help" style={{ marginLeft: '1rem' }} onClick={exportCSV} />
      </span>
    </div>
  );

  const activeBodyTemplate = (rowData) => {
    return <i className={classNames('pi', (rowData.active ? 'text-green-500 pi-check-circle' : 'text-red-500 pi-times-circle'))}></i>;
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editEstablishment(rowData)} />
      </React.Fragment>
    );
  };

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
            <DataTable ref={dt} value={establishmentsCrud} selection={selectedEstablishments} onSelectionChange={(e) => setSelectedEstablishments(e.value)}
              dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} emptyMessage='No se han encontrado establecimientos'
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} establecimientos" globalFilter={globalFilter} header={header}>
              <Column field="name" header="Establecimiento" sortable style={{ minWidth: '24rem' }} ></Column>
              <Column field="active" header="Activo" sortable dataType="boolean" body={activeBodyTemplate} style={{ minWidth: '10rem' }}></Column>
              <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }} bodyClassName="text-center"></Column>
            </DataTable>
          </div>

          <Dialog visible={establishmentDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={actionName} modal className="p-fluid" footer={establishmentDialogFooter} onHide={hideDialog}>
            {loadingCrud && <ProgressSpinner style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }} />}
            <div className="field">
              <label htmlFor="name" className="font-bold">
                Nombre del establecimiento
              </label>
              <InputText id="name" value={establishment.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus
                className={classNames({ "p-invalid": submitted && (!establishment.name || validationErrors.name) })} />
              {submitted && !establishment.name
                ? (<small className="p-error">El nombre del establecimiento es requerido</small>)
                : submitted && validationErrors.name && (<small className="p-error">{validationErrors.name}</small>)
              }
            </div>

            <div className="field" style={{ height: "2.5rem", display: "flex", alignItems: "center" }}>
              <div className="p-field-checkbox" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <InputSwitch
                  id='active'
                  checked={establishment.active}
                  onChange={(e) => onInputChange(e, 'active')}
                />
                <label htmlFor="active" className="font-bold" style={{ marginLeft: "1rem", alignSelf: "center" }}>
                  Activo
                </label>
              </div>
            </div>
          </Dialog>
        </div>
      }
    </>
  )
}
