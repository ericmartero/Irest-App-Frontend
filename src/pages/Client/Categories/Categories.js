import React, { useState, useEffect } from 'react';
import { useCategory } from '../../../hooks';
import { DataView } from 'primereact/dataview';

export function Categories() {

  const [categoriesTable, setCategoriesTable] = useState(null);
  const { categories, loading, error, getCategories } = useCategory();

  useEffect(() => {
    getCategories();
  }, [getCategories])

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
      <div className="card">
        <h1>Categories</h1>
        <DataView value={categoriesTable} itemTemplate={itemTemplate} />
      </div>
    </>
  )
}
