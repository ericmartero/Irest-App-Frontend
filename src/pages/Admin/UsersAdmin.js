import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { AutoComplete } from "primereact/autocomplete";
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { useUser } from '../../hooks';
import './UsersAdmin.scss';

export function UsersAdmin() {

  let emptyUser = {
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    isActive: true,
    roles: [],
  };

  const [products, setProducts] = useState(null);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [product, setProduct] = useState(emptyUser);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);

  const [selectedRoles, setSelectedRoles] = useState(null);
  const [filteredRoles, setFilteredRoles] = useState(null);
  let rolesList = [{ name: 'Admin' }, { name: 'Employee' }, { name: 'Boss' }];

  const [actionName, setActionName] = useState('');

  const toast = useRef(null);
  const dt = useRef(null);
  const { users, getUsers, addUser, deleteUser } = useUser();
  const [refreshTable, setRefreshTable] = useState(false);

  useEffect(() => {
    getUsers();
  }, [refreshTable])

  useEffect(() => {
    setProducts(users);
  }, [users])

  const onRefresh = () => setRefreshTable((state) => !state);

  const openNew = () => {
    setProduct(emptyUser);
    setSubmitted(false);
    setProductDialog(true);
    setActionName('Añadir Usuario');
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };

  const saveProduct = async () => {
    setSubmitted(true);

    //console.log(product);

    if (product.firstName.trim()) {
      let _products = [...products];
      let _product = { ...product };
      
      //EDITAR
      if (product.id) {
        const index = findIndexById(product.id);

        _products[index] = _product;
        toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Usuario actualizado correctamente', life: 3000 });
      
      //ENVIAR
      } else {

        const roleNames = selectedRoles?.map(role => role.name.toLowerCase());
        product.roles = roleNames;

        try {
          await addUser(product);
          onRefresh();
          console.log('Usuario creado correctamente');
        } catch (error) {
          console.log(error);
        }

        toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Usuario creado correctamente', life: 3000 });
      }

      setProducts(_products);
      setProductDialog(false);
      setProduct(emptyUser);
    }
  };

  const editProduct = (product) => {
    console.log(product);
    setProduct({ ...product });
    setProductDialog(true);
    setActionName('Editar Usuario');
  };

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  };

  const deleteProduct = async () => {
    console.log(product);

    try {
      await deleteUser(product.id);
      onRefresh();
    } catch (error) {
      console.log(error);
    }

    //ESTO DE ABAJO NO TOCAR, COJE DE NUEVO AL BORRAR 
    let _products = products.filter((val) => val.id !== product.id);
    console.log(_products);

    setProducts(_products);
    setDeleteProductDialog(false);
    setProduct(emptyUser);
    toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Usuario borrado correctamente', life: 3000 });
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < products.length; i++) {
      if (products[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  };

  const deleteSelectedProducts = () => {
    let _products = products.filter((val) => !selectedProducts.includes(val));

    setProducts(_products);
    setDeleteProductsDialog(false);
    setSelectedProducts(null);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _product = { ...product };

    _product[`${name}`] = val;

    setProduct(_product);
  };

  const onRoleChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _product = { ...product };

    _product[`${name}`] = val;
    //_product.roles = selectedRoles;

    setProduct(_product);
  };

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

  const activeBodyTemplate = (rowData) => {
    return <i className={classNames('pi', { 'text-green-500 pi-check-circle': !rowData.verified, 'text-red-500 pi-times-circle': rowData.verified })}></i>;
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
        <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
      </React.Fragment>
    );
  };

  const search = (event) => {
    setTimeout(() => {
      let _filteredRoles;

      if (!event.query.trim().length) {
        _filteredRoles = [...rolesList];
      } else {
        _filteredRoles = rolesList.filter((role) => {
          return role.name
            .toLowerCase()
            .startsWith(event.query.toLowerCase());
        });
      }

      setFilteredRoles(_filteredRoles);
    }, 200);
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Panel de usuarios</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
      </span>
    </div>
  );
  const productDialogFooter = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Guardar" icon="pi pi-check" onClick={saveProduct} />
    </React.Fragment>
  );
  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
      <Button label="Si" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
    </React.Fragment>
  );
  const deleteProductsDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductsDialog} />
      <Button label="Si" icon="pi pi-check" severity="danger" onClick={deleteSelectedProducts} />
    </React.Fragment>
  );

  return (
    <div>
      <Toast ref={toast} />
      <div className="card" >
        <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

        <DataTable ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
          dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} usuarios" globalFilter={globalFilter} header={header}>
          <Column selectionMode="multiple" exportable={false}></Column>
          <Column field="email" header="Email" sortable style={{ minWidth: '16rem' }}></Column>
          <Column field="firstName" header="Nombre" sortable style={{ minWidth: '12rem' }}></Column>
          <Column field="lastName" header="Apellidos" sortable style={{ minWidth: '12rem' }}></Column>
          <Column field="roles" header="Roles" sortable style={{ minWidth: '12rem' }}
            body={(rowData) =>
              rowData.roles.map((role) => {
                let tagClass = '';
                switch (role) {
                  case 'admin':
                    tagClass = 'warning';
                    break;
                  case 'boss':
                    tagClass = 'danger';
                    break;
                  case 'employee':
                    tagClass = 'success';
                    break;
                  default:
                    break;
                }
                return (
                  <Tag
                    key={role}
                    value={role}
                    className="my-tag p-mr-2"
                    severity={tagClass}
                  />
                );
              })
            }
          ></Column>
          <Column field="isActive" header="Activo" dataType="boolean" body={activeBodyTemplate} style={{ minWidth: '8rem' }}></Column>
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
        </DataTable>
      </div>

      <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={actionName} modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
        <div className="field">
          <label htmlFor="email" className="font-bold">
            Email
          </label>
          <InputText id="email" type="email" value={product.email} onChange={(e) => onInputChange(e, 'email')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.email })} />
          {submitted && !product.email && <small className="p-error">El email es requerido</small>}
        </div>
        <div className="field">
          <label htmlFor="firstName" className="font-bold">
            Nombre
          </label>
          <InputText id="firstName" value={product.firstName} onChange={(e) => onInputChange(e, 'firstName')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.firstName })} />
          {submitted && !product.firstName && <small className="p-error">El nombre es requerido</small>}
        </div>
        <div className="field">
          <label htmlFor="lastName" className="font-bold">
            Apellidos
          </label>
          <InputText id="lastName" value={product.lastName} onChange={(e) => onInputChange(e, 'lastName')} />
        </div>
        <div className="field">
          <label htmlFor="password" className="font-bold">
            Contraseña
          </label>
          <InputText id="password" type="password" value={product.password} onChange={(e) => onInputChange(e, 'password')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.password })} />
          {submitted && !product.password && <small className="p-error">La contraseña es requerida</small>}
        </div>
        <div className="field">
          <label htmlFor="roles" className="font-bold">
            Roles
          </label>
          <AutoComplete
            field="name"
            multiple
            value={selectedRoles}
            suggestions={filteredRoles}
            completeMethod={search}
            onChange={(e) => setSelectedRoles(e.value)}
          />
        </div>
      </Dialog>

      <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {product && (
            <span>
              Seguro que quieres eliminar el usuario <b>{product.firstName}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog visible={deleteProductsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {product && <span>Seguro que quieres eliminar los usuarios seleccionados?</span>}
        </div>
      </Dialog>
    </div>
  );
}