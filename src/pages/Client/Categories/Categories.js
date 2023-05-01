import React, { useState, useEffect } from 'react';
import { useCategory } from '../../../hooks';
import { DataView } from 'primereact/dataview';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import '../../../scss/AlignComponent.scss';

export function Categories() {

  const [categoriesTable, setCategoriesTable] = useState(null);
  const { categories, loading, error, getCategoriesClient } = useCategory();

  useEffect(() => {
    getCategoriesClient();
  }, [getCategoriesClient])

  useEffect(() => {
    if (categories) {
      setCategoriesTable(categories);
    }
  }, [categories]);

  const itemTemplate = (category) => {
    return (
      <div className="col-12">
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
              <Button icon="pi pi-qrcode" className="layout-button" />
            </div>
            <DataView value={categoriesTable} itemTemplate={itemTemplate} emptyMessage='No se han encontrado categorias' />
          </div>
        </>
      }
    </>
  )
}
