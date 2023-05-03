import React, { useState, useEffect } from 'react';
import { useCategory } from '../../../hooks';
import { getBookingKey } from '../../../utils/constants';
import { useParams, useHistory } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { DataView } from 'primereact/dataview';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import QRCode from 'react-qr-code';
import '../../../scss/AlignComponent.scss';
import './Categories.scss';

export function Categories() {

  const paramsURL = useParams();
  const history = useHistory();
  const [categoriesTable, setCategoriesTable] = useState(null);
  const { categories, loading, getCategoriesClient } = useCategory();
  const [showTableBookingQRDialog, setShowTableBookingQRDialog] = useState(false);

  useEffect(() => {
    getCategoriesClient();
  }, [getCategoriesClient])

  useEffect(() => {
    if (categories) {
      setCategoriesTable(categories);
    }
  }, [categories]);

  const hideShowTableBookingQRDialog = () => {
    setShowTableBookingQRDialog(false);
  };

  const goProductsCategory = (category) => {
    history.push(`/client/${paramsURL.idTable}/${category.id}`);
  };

  const itemTemplate = (category) => {
    return (
      <div className="col-12" onClick={() => goProductsCategory(category)}>
        <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
          <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={category.image} alt={category.name} />
          <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
            <div className="flex flex-column align-items-center sm:align-items-start gap-3">
              <div className="text-2xl font-bold text-900">{category.title}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {loading ?
        <div className="align-content-mobile">
          <ProgressSpinner />
        </div>
        :
        <>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Nuestra Carta</h2>
              <Button icon="pi pi-qrcode" className="layout-button" onClick={() => setShowTableBookingQRDialog(true)} />
            </div>
            <DataView value={categoriesTable} itemTemplate={itemTemplate} emptyMessage='No se han encontrado categorias' />

            <Dialog visible={showTableBookingQRDialog} style={{ width: '90vw' }} 
              header="Código QR de invitación" modal onHide={hideShowTableBookingQRDialog}
              headerClassName='header_dialog_color'>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                {paramsURL && <QRCode value={`http://localhost:3000/client-invite/id_table=${paramsURL.idTable}&key=${getBookingKey()}`} />}
              </div>
            </Dialog>
          </div>
        </>
      }
    </>
  )
}
