import React, { useEffect } from 'react';
import { useCategory } from '../../hooks';

export function CategoriesAdmin() {

  const { categories, getCategories } = useCategory();
  console.log(categories);

  useEffect(() => {
    getCategories();
  }, [])
  

  return (
    <div>
        <h1>CategoriesAdmin</h1>
    </div>
  )
}
