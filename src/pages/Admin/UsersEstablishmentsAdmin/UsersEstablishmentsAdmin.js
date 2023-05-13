import React, { useState, useEffect, useRef } from 'react';
import { useUser, useAuth } from '../../../hooks';
import { AccessDenied } from '../../AccessdDenied';
import { classNames } from 'primereact/utils';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';

export function UsersEstablishmentsAdmin() {

  let emptyUser = {
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    isActive: true,
    roles: [],
  };

  const dt = useRef(null);
  const toast = useRef(null);
  const { auth } = useAuth();
  const { users, loading, error, loadingCrud, getUsersAll, addUserAll, deleteUserAll, updateUserAll } = useUser();

  const [refreshTable, setRefreshTable] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [usersTable, setUsersTable] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState(null);
  const [user, setUser] = useState(emptyUser);
  const [deleteUserDialog, setDeleteUserDialog] = useState(false);

  useEffect(() => {
    getUsersAll();
  }, [refreshTable, getUsersAll]);

  useEffect(() => {
    if (users) {
      const filteredUsers = users.filter(user => user.id !== auth.me.user.id);
      setUsersTable(filteredUsers);
    }
  }, [users, auth]);

  const onRefresh = () => setRefreshTable((state) => !state);

  const showError = (error) => {
    toast.current.show({ severity: 'error', summary: 'Operación Fallida', detail: error.message, life: 3000 });
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const confirmDeleteUser = (user) => {
    setUser(user);
    setDeleteUserDialog(true);
  };

  
  const deleteSelectedUser = async () => {
    try {
      await deleteUserAll(user.id);
      onRefresh();
      toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Usuario borrado correctamente', life: 3000 });
    } catch (error) {
      showError(error);
    }

    setDeleteUserDialog(false);
    setUser(emptyUser);
  };

  const hideDeleteUserDialog = () => {
    setDeleteUserDialog(false);
  };

  const activeBodyTemplate = (rowData) => {
    return <i className={classNames('pi', (rowData.isActive ? 'text-green-500 pi-check-circle' : 'text-red-500 pi-times-circle'))}></i>;
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="Nuevo" icon="pi pi-plus" severity="success" onClick={""} />
        <Button label="Borrar" icon="pi pi-trash" severity="danger" onClick={""} disabled={!selectedUsers || !selectedUsers.length} />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={""} />
        <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteUser(rowData)} />
      </React.Fragment>
    );
  };

  const deleteUserDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteUserDialog} />
      <Button label="Si" icon="pi pi-check" severity="danger" onClick={deleteSelectedUser} />
    </React.Fragment>
  );

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h3 className="m-0">PANEL DE USUARIOS</h3>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
      </span>
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

                <DataTable ref={dt} value={usersTable} selection={selectedUsers} onSelectionChange={(e) => setSelectedUsers(e.value)}
                  dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} emptyMessage='No se han encontrado Ususarios'
                  paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                  currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} usuarios" globalFilter={globalFilter} header={header}>
                  <Column selectionMode="multiple" exportable={false}></Column>
                  <Column field="email" header="Email" sortable style={{ minWidth: '14rem' }}></Column>
                  <Column field="firstName" header="Nombre" sortable style={{ minWidth: '10rem' }}></Column>
                  <Column field="lastName" header="Apellidos" sortable style={{ minWidth: '12rem' }}></Column>
                  <Column field="establishment.name" header="Establecimiento" sortable style={{ minWidth: '12rem' }}></Column>
                  <Column field="roles" header="Roles" sortable style={{ minWidth: '10rem' }}
                    body={(rowData) =>
                      rowData.roles.map((role) => {
                        let tagClass = '';
                        switch (role) {
                          case 'admin':
                            role = 'Admin';
                            tagClass = 'danger';
                            break;
                          case 'waiter':
                            role = 'Camarero';
                            tagClass = 'warning';
                            break;
                          case 'chef':
                            role = 'Cocinero';
                            tagClass = 'success';
                            break;
                          case 'superuser':
                            role = 'Superusuario';
                            break;
                          default:
                            role = 'Cliente';
                            tagClass = 'info';
                            break;
                        }
                        return (
                          <Tag
                            key={role}
                            value={role}
                            className={classNames('p-mr-2 my-tag', { 'my-tag-bottom': rowData.roles.length === 2 })}
                            severity={tagClass}
                          />
                        );
                      })
                    }
                  ></Column>
                  <Column field="isActive" header="Activo" sortable dataType="boolean" body={activeBodyTemplate} style={{ minWidth: '4rem' }}></Column>
                  <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '10rem' }}></Column>
                </DataTable>
              </div>

              <Dialog visible={deleteUserDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
                <div className="confirmation-content">
                  <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                  {user && (
                    <span>
                      Seguro que quieres eliminar el usuario <b>{user.firstName}</b>?
                    </span>
                  )}
                </div>
              </Dialog>
            </div>
          }
        </>
      }
    </>
  )
}
