import React, { useRef } from 'react';
import { useTableBooking } from '../../../../hooks';
import { useHistory } from "react-router-dom";
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

export function ReserveTableClient(props) {

  const toastError = useRef(null);
  const history = useHistory();
  const { reserveTable } = useTableBooking();

  const showError = (error) => {
    toastError.current.show({ severity: 'error', summary: 'Error al acceder a la mesa', detail: error.message, life: 3000 });
  }

  const onReserveTable = async () => {
    try {
      await reserveTable(props.table.id);
      history.push(`/client/${props.table.id}`);
    } catch (error) {
      showError(error);
    }
  };

  return (
    <div>
      <Toast ref={toastError} position="bottom-center" className="toast" />
      <div className="flex align-items-center justify-content-center h-screen">
        <div className="p-4 w-full lg:w-6 mx-auto">
          <div className="text-center mb-5">
            <img src="https://res.cloudinary.com/djwjh0wpw/image/upload/v1678622048/irest-logo-white-copy_mlspdo.png" alt="hyper" height={100} className="mb-3" />
            <div className="text-900 text-3xl font-medium mb-3">Bienvenido a {props.table?.establishment.name}</div>
            <span className="text-600 font-medium line-height-3">Pulsa el botón para reservar la mesa</span>
          </div>

          <Button type="submit" label={`Reservar la mesa ${props.table?.number}`} className="w-full mt-3" onClick={onReserveTable} />
        </div>
      </div>
    </div>
  )
}
