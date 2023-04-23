import React, { useState, useEffect, useRef } from 'react';
import { useEstablishment } from '../../../hooks';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import '../../../scss/AlignComponent.scss';

export function EstablishmentsAdmin() {

  const toast = useRef(null);
  const dt = useRef(null);
  const { loading, establishments, getEstablishments } = useEstablishment();

  const [establishmentsCrud, setEstablishmentsCrud] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [selectedEstablishments, setSelectedEstablishments] = useState(null);

  useEffect(() => {
    getEstablishments();
  }, [getEstablishments])

  useEffect(() => {
    if (establishments) {
      setEstablishmentsCrud(establishments);
    }
  }, [establishments])

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h3 className="m-0">PANEL DE ESTABLECIMIENTOS</h3>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
      </span>
    </div>
  );

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="Nuevo" icon="pi pi-plus" severity="success" />
        <Button label="Borrar" icon="pi pi-trash" severity="danger" />
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
        <Button icon="pi pi-pencil" rounded outlined className="mr-2" />
        <Button icon="pi pi-trash" rounded outlined severity="danger" />
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
            <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

            <DataTable ref={dt} value={establishmentsCrud} selection={selectedEstablishments} onSelectionChange={(e) => setSelectedEstablishments(e.value)}
              dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} emptyMessage='No se han encontrado establecimientos'
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} establecimientos" globalFilter={globalFilter} header={header}>
              <Column selectionMode="multiple" exportable={false}></Column>
              <Column field="name" header="Establecimiento" sortable style={{ minWidth: '8rem' }} ></Column>
              <Column field="active" header="Activo" sortable dataType="boolean" body={activeBodyTemplate}></Column>
              <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
            </DataTable>
          </div>
        </div>
      }
    </>
  )
}
