import React, { useState, useEffect } from 'react';
import { useCategory } from '../../../hooks';
import { Header } from '../../../components/Client/Header/Header';
import { useParams, useHistory } from 'react-router-dom';
import { DataView } from 'primereact/dataview';
import { ProgressSpinner } from 'primereact/progressspinner';
import '../../../scss/AlignComponent.scss';
import './Categories.scss';

export function Categories(props) {

  const { orders, table, onRefreshOrders, payment } = props;

  const paramsURL = useParams();
  const history = useHistory();
  const [categoriesTable, setCategoriesTable] = useState(null);
  const { categories, loading, getCategoriesClient } = useCategory();

  useEffect(() => {
    getCategoriesClient();
  }, [getCategoriesClient])

  useEffect(() => {
    if (categories) {
      setCategoriesTable(categories);
    }
  }, [categories]);

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
            <Header
              name="Nuestra Carta"
              isMain={true}
              isOrderTracking={false}
              orders={orders}
              table={table}
              onRefreshOrders={onRefreshOrders}
              payment={payment}
            />
            <div className='categories-container'>
              <DataView value={categoriesTable} itemTemplate={itemTemplate} emptyMessage='No se ha encontrado ninguna categoría en la carta' />
            </div>
          </div>
        </>
      }
    </>
  )
}
