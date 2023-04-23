import React, { useState, useEffect, useRef } from 'react';
import { useEstablishment } from '../../../hooks';

export function EstablishmentsAdmin() {

  const { loading, establishments, getEstablishments } = useEstablishment();

  const [establishmentsCrud, setEstablishmentsCrud] = useState(null);

  useEffect(() => {
    getEstablishments();
  }, [getEstablishments])

  useEffect(() => {
    if (establishments) {
      setEstablishmentsCrud(establishments);
    }
  }, [establishments])
  

  return (
    <div>
        <h1>EstablishmentsAdmin</h1>
    </div>
  )
}
