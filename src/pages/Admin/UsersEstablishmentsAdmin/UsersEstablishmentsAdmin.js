import React, { useState, useEffect, useRef } from 'react';
import { useUser, useAuth, useEstablishment } from '../../../hooks';
import { AccessDenied } from '../../AccessdDenied';
import { classNames } from 'primereact/utils';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { map, size } from 'lodash';
import '../../../scss/Dialogs.scss';

export function UsersEstablishmentsAdmin() {

  let emptyUser = {
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    isActive: true,
    establishment: '',
    roles: [],
  };

  const rolesList = ['admin', 'waiter', 'chef', 'superuser', 'customer'];

  const dt = useRef(null);
  const toast = useRef(null);
  const { auth } = useAuth();
  const { users, loading, error, loadingCrud, getUsersAll, addUserAll, deleteUserAll, updateUserAll } = useUser();
  const { establishments, getEstablishments } = useEstablishment();

  const [refreshTable, setRefreshTable] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [usersTable, setUsersTable] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState(null);
  const [user, setUser] = useState(emptyUser);
  const [actionName, setActionName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [userDialog, setUserDialog] = useState(false);
  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);
  const [isEditUser, setIsEditUser] = useState(false)
  const [lastUserEdit, setlastUserEdit] = useState({});
  const [selectedRoles, setSelectedRoles] = useState(null);
  const [selectedEstablishment, setSelectedEstablishment] = useState(null);
  const [establishmentsDropdown, setEstablishmentsDropdown] = useState([])
  const [establishmentActive, setEstablishmentActive] = useState(true);

  useEffect(() => {
    getUsersAll();
  }, [refreshTable, getUsersAll]);

  useEffect(() => {
    if (users) {
      const filteredUsers = users.filter(user => user.id !== auth.me.user.id);
      setUsersTable(filteredUsers);
    }
  }, [users, auth]);

  useEffect(() => {
    getEstablishments();
  }, [getEstablishments]);

  useEffect(() => {
    if (establishments) {
      setEstablishmentsDropdown(formatDropdownData(establishments));
    }
  }, [establishments]);

  useEffect(() => {
    if (selectedRoles?.includes('superuser')) {
      setEstablishmentActive(false);
      setSelectedEstablishment(null);
    }

    else {
      setEstablishmentActive(true);
    }
  }, [selectedRoles]);

  const onRefresh = () => { 
    setRefreshTable((state) => !state);
    setGlobalFilter(null);
  };

  const showError = (error) => {
    toast.current.show({ severity: 'error', summary: 'Operación Fallida', detail: error.message, life: 3000 });
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const formatDropdownData = (data) => {
    return map(data, (item) => ({
      id: item.id,
      value: item.name
    }));
  };

  const openNew = () => {
    setIsEditUser(false);
    setUser(emptyUser);
    setSelectedEstablishment(null);
    setSubmitted(false);
    setUserDialog(true);
    setActionName('Añadir Producto');
    setSelectedRoles(null);
    document.body.classList.add('body-scroll-lock');
  };

  const saveUser = async () => {

    const isValid = validateFields();
    setSubmitted(true);

    const selectedOption = establishmentsDropdown.find((option) => option.value === selectedEstablishment);

    if (isValid) {

      const lowerCaseSelectedRoles = selectedRoles?.map(role => role.toLowerCase());

      if (user.id) {

        const editUser = {
          ...(lastUserEdit.email !== user.email && { email: user.email }),
          ...(lastUserEdit.firstName !== user.firstName && { firstName: user.firstName }),
          ...(user.password !== '' && { password: user.password }),
          ...(user.lastName !== '' ? { lastName: user.lastName } : { lastName: null }),
          ...(selectedRoles.length !== 0 ? { roles: lowerCaseSelectedRoles } : { roles: ['waiter'] }),
          ...((establishmentActive !== false && selectedOption !== undefined) && { establishment: selectedOption.id }),
          ...(lastUserEdit.isActive !== user.isActive && { isActive: user.isActive }),
        };

        try {
          await updateUserAll(user.id, editUser);
          onRefresh();
          toast.current.show({ severity: 'success', summary: 'Operación Exitosa', detail: `Usuario ${user.firstName} actualizado correctamente`, life: 3000 });
        } catch (error) {
          showError(error);
        }

      } else {

        user.roles = lowerCaseSelectedRoles;

        const newUser = {
          email: user.email,
          firstName: user.firstName,
          password: user.password,
          isActive: user.isActive,
          ...(selectedOption !== undefined && { establishment: selectedOption.id }),
          ...(user.lastName && { lastName: user.lastName }),
          ...(user.roles !== undefined ? { roles: lowerCaseSelectedRoles } : { roles: ['waiter'] })
        };

        try {
          await addUserAll(newUser);
          onRefresh();
          toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: `Usuario ${user.firstName} creado correctamente`, life: 3000 });
        } catch (error) {
          showError(error);
        }
      }

      setSubmitted(false);
      setValidationErrors({});
      setUserDialog(false);
      setUser(emptyUser);
      document.body.classList.remove('body-scroll-lock');
    }
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

  const deleteSelectedUsers = async () => {
    try {
      await Promise.all(selectedUsers.map(async (user) => {
        await deleteUserAll(user.id);
      }));

      onRefresh();

      if (selectedUsers.length === 1) {
        toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Usuario borrado correctamente', life: 3000 });
      }

      else {
        toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Usuarios borrados correctamente', life: 3000 });
      }

    } catch (error) {
      showError(error);
    }

    setDeleteUsersDialog(false);
    setSelectedUsers(null);
  };

  const onInputChange = (e, name) => {
    const val = e.target.value || '';

    let errors = { ...validationErrors };

    switch (name) {
      case "email":
        if (!isValidEmail(val)) {
          errors.email = "El formato de correo electrónico es inválido";
        } else {
          delete errors.email;
        }
        break;
      case "firstName":
        if (val.length < 2) {
          errors.firstName = "El nombre tiene que tener mínimo 2 letras";
        } else {
          delete errors.firstName;
        }
        break;
      case "password":
        if (isEditUser)
          if (val.length > 0 && !validatePassword(val)) {
            errors.password = "La contraseña tiene que tener mínimo 6 caracteres, una mayúscula, una minúscula y un número"
          }
          else {
            delete errors.password;
          }
        else {
          if (!validatePassword(val)) {
            errors.password = "La contraseña tiene que tener mínimo 6 caracteres, una mayúscula, una minúscula y un número"
          }
          else {
            delete errors.password;
          }
        }
        break;
      default:
        break;
    }

    setUser(prevUser => ({ ...prevUser, [name]: val }));
    setValidationErrors(errors);
  };

  const validateFields = () => {
    const errors = {};
    if (!user.email) {
      errors.email = "El email es requerido";
    } else if (!isValidEmail(user.email)) {
      errors.email = "El formato de correo electrónico es inválido";
    }
    if (!user.firstName) {
      errors.firstName = "El nombre es requerido";
    } else if (user.firstName.length < 2) {
      errors.firstName = "El nombre tiene que tener mínimo 2 letras";
    }

    if (size(selectedRoles) > 1 && selectedRoles.includes('superuser')) {
      errors.roles = "El usuario con el rol de superusuario no puede tener más roles";
    } else if (size(selectedRoles) > 1 && selectedRoles.includes('customer')) {
      errors.roles = "El usuario con el rol de cliente no puede tener más roles";
    }

    if (isEditUser) {
      if (user.password.length > 0 && !validatePassword(user.password)) {
        errors.password = "La contraseña tiene que tener mínimo 6 caracteres, una mayúscula, una minúscula y un número";
      }
    }

    else {
      if (!user.password) {
        errors.password = "La contraseña es requerida";
      } else if (!validatePassword(user.password)) {
        errors.password = "La contraseña tiene que tener mínimo 6 caracteres, una mayúscula, una minúscula y un número";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputSwitch = (e, valid) => {
    const val = e.target.value;
    setUser(prevUser => ({ ...prevUser, [valid]: val }));
  };

  const onDropdownChange = (value) => {

    let errors = { ...validationErrors };
    setSelectedEstablishment(value);

    if (value === null) {
      errors.establishment = "El establecimiento es requerido";
    } else {
      delete errors.establishment;
    }

    setValidationErrors(errors);
  };

  const onMultiSelect = (e) => {
    let errors = { ...validationErrors };
    setSelectedRoles(e.value)

    if (size(e.value) > 1 && e.value.includes('superuser')) {
      errors.roles = "El usuario con el rol de superusuario no puede tener más roles";
    } else if (size(e.value) > 1 && e.value.includes('customer')) {
      errors.roles = "El usuario con el rol de cliente no puede tener más roles";
    } else {
      delete errors.roles;
    }

    setValidationErrors(errors);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  function validatePassword(password) {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\w,.-]{6,}$/;
    return passwordRegex.test(password);
  };

  const editUser = (userEdit) => {
    setSubmitted(false);
    setIsEditUser(true);
    setlastUserEdit(userEdit);
    setUser({ ...userEdit, password: '' });
    setSelectedRoles(userEdit.roles);
    setUserDialog(true);
    setActionName('Editar Usuario');

    if (userEdit.establishment) setSelectedEstablishment(userEdit.establishment.name);
  };

  const hideDeleteUserDialog = () => {
    setDeleteUserDialog(false);
  };

  const hideDeleteUsersDialog = () => {
    setDeleteUsersDialog(false);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setUserDialog(false);
    setValidationErrors({});
    document.body.classList.remove('body-scroll-lock');
  };

  const confirmDeleteSelected = () => {
    setDeleteUsersDialog(true);
  };

  const itemTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <span>{option}</span>
      </div>
    );
  };

  const activeBodyTemplate = (rowData) => {
    return <i className={classNames('pi', (rowData.isActive ? 'text-green-500 pi-check-circle' : 'text-red-500 pi-times-circle'))}></i>;
  };

  const selectedItemTemplate = (option) => {
    if (option) {
      return (
        <div className="inline-flex align-items-center py-1 px-2 bg-primary text-primary border-round mr-2">
          <span>{option}</span>
        </div>
      );
    }

    return 'Selecciona los roles';
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="Nuevo" icon="pi pi-plus" severity="success" onClick={openNew} />
        <Button label="Borrar" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedUsers || !selectedUsers.length} />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editUser(rowData)} />
        <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteUser(rowData)} />
      </React.Fragment>
    );
  };

  const userDialogFooter = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Guardar" icon="pi pi-check" onClick={saveUser} disabled={!submitted || Object.keys(validationErrors).length === 0 ? false : true} />
    </React.Fragment>
  );

  const deleteUserDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteUserDialog} />
      <Button label="Si" icon="pi pi-check" severity="danger" onClick={deleteSelectedUser} />
    </React.Fragment>
  );

  const deleteUsersDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteUsersDialog} />
      <Button label="Si" icon="pi pi-check" severity="danger" onClick={deleteSelectedUsers} />
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
                  <Column field="firstName" header="Nombre" sortable style={{ minWidth: '6rem' }}></Column>
                  <Column field="lastName" header="Apellidos" sortable style={{ minWidth: '8rem' }}></Column>
                  <Column field="establishment.name" header="Establecimiento" sortable style={{ minWidth: '12rem' }}></Column>
                  <Column field="roles" header="Roles" sortable style={{ minWidth: '8rem' }}
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
                  <Column field="isActive" header="Activo" sortable dataType="boolean" body={activeBodyTemplate} style={{ minWidth: '1rem' }}></Column>
                  <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '10rem' }}></Column>
                </DataTable>
              </div>

              <Dialog visible={userDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={actionName} modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
                {loadingCrud && <ProgressSpinner style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }} />}
                <div className="field">
                  <label htmlFor="email" className="font-bold">
                    Email
                  </label>
                  <InputText id="email" type="email" value={user.email} onChange={(e) => onInputChange(e, 'email')} required autoFocus
                    className={classNames({ "p-invalid": submitted && (!user.email || validationErrors.email) })} />
                  {submitted && !user.email
                    ? (<small className="p-error">El email es requerido</small>)
                    : submitted && validationErrors.email && (<small className="p-error">{validationErrors.email}</small>)
                  }
                </div>

                <div className="field">
                  <label htmlFor="roles" className="font-bold">
                    Roles
                  </label>
                  <MultiSelect
                    value={selectedRoles}
                    onChange={(e) => onMultiSelect(e)}
                    options={rolesList}
                    optionLabel="role"
                    placeholder="Selecciona los roles"
                    itemTemplate={itemTemplate}
                    selectedItemTemplate={selectedItemTemplate}
                    className={classNames({ "p-invalid": submitted && (validationErrors.roles) })}
                  />
                  {submitted && validationErrors.roles && (<small className="p-error">{validationErrors.roles}</small>)}
                </div>
                {establishmentActive &&
                  <div className="field">
                    <label htmlFor="establishment" className="font-bold">
                      Establecimiento
                    </label>
                    <Dropdown value={selectedEstablishment} onChange={(e) => onDropdownChange(e.value)} options={establishmentsDropdown} optionLabel="value"
                      placeholder="Selecciona un establecimiento" appendTo="self" className={classNames({ "p-invalid": submitted && (validationErrors.establishment) })} />
                    {submitted && validationErrors.establishment && (<small className="p-error">{validationErrors.establishment}</small>)}
                  </div>
                }
                <div className="field">
                  <label htmlFor="firstName" className="font-bold">
                    Nombre
                  </label>
                  <InputText id="firstName" value={user.firstName} onChange={(e) => onInputChange(e, 'firstName')} required autoFocus className={classNames({ "p-invalid": submitted && (!user.firstName || validationErrors.firstName) })} />
                  {submitted && !user.firstName
                    ? <small className="p-error">El nombre es requerido</small>
                    : submitted && validationErrors.firstName && (<small className="p-error">{validationErrors.firstName}</small>)
                  }
                </div>
                <div className="field">
                  <label htmlFor="lastName" className="font-bold">
                    Apellidos
                  </label>
                  <InputText id="lastName" value={user.lastName || ''} onChange={(e) => onInputChange(e, 'lastName')} />
                </div>
                <div className="field">
                  <label htmlFor="password" className="font-bold">
                    Contraseña
                  </label>
                  {isEditUser ? (
                    <>
                      <InputText id="password" type="password" value={user.password} onChange={(e) => onInputChange(e, 'password')} required autoFocus className={classNames({ "p-invalid": submitted && (validationErrors.password) })} />
                      {submitted && validationErrors.password && (<small className="p-error">{validationErrors.password}</small>)}
                    </>
                  ) : (
                    <>
                      <InputText id="password" type="password" value={user.password} onChange={(e) => onInputChange(e, 'password')} required autoFocus className={classNames({ "p-invalid": submitted && (!user.password || validationErrors.password) })} />
                      {submitted && !user.password
                        ? (<small className="p-error">La contraseña es requerida</small>)
                        : submitted && validationErrors.password && (<small className="p-error">{validationErrors.password}</small>)
                      }
                    </>
                  )}
                </div>

                <div className="field" style={{ height: "2.5rem", display: "flex", alignItems: "center" }}>
                  <div className="p-field-checkbox" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <InputSwitch
                      id='isActive'
                      checked={user.isActive}
                      onChange={(e) => handleInputSwitch(e, 'isActive')}
                    />
                    <label htmlFor="isActive" className="font-bold" style={{ marginLeft: "1rem", alignSelf: "center" }}>
                      Usuario Activo
                    </label>
                  </div>
                </div>
              </Dialog>

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

              <Dialog visible={deleteUsersDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal footer={deleteUsersDialogFooter} onHide={hideDeleteUsersDialog}>
                <div className="confirmation-content">
                  <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                  {user && selectedUsers?.length === 1
                    ? <span>Seguro que quieres eliminar el usuario seleccionado?</span>
                    : <span>Seguro que quieres eliminar los usuarios seleccionados?</span>
                  }
                </div>
              </Dialog>
            </div>
          }
        </>
      }
    </>
  )
}
