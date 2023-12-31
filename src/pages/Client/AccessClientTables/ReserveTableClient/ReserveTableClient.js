import React, { useRef } from 'react';
import { useTableBooking, useAuth } from '../../../../hooks';
import { setBookingKey } from '../../../../api/bookingKey';
import { useHistory } from "react-router-dom";
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import '../AccessClientTables.scss';

export function ReserveTableClient(props) {

  const { reserve } = useAuth();
  const toastError = useRef(null);
  const history = useHistory();
  const { reserveTable } = useTableBooking();

  const showError = (error) => {
    toastError.current.show({ severity: 'error', summary: 'Error al acceder a la mesa', detail: error.message, life: 3000 });
  }

  const onReserveTable = async () => {
    try {
      const response = await reserveTable(props.table.id);
      const { tokenSession, key } = response;
      reserve(tokenSession);
      setBookingKey(key);
      history.push(`/client/table=${props.table.id}`);
    } catch (error) {
      showError(error);
    }
  };

  return (
    <div>
      <Toast ref={toastError} position="bottom-center" className="toast" />
      <div className='image-container'>
        <img src="https://res.cloudinary.com/djwjh0wpw/image/upload/v1684488250/imagen_bar_cliente_a2qxwr.png" alt="hyper" className='image-fill-container' />
      </div>
      <div className="flex align-items-center justify-content-center content-container">
        <div className="p-4 w-full lg:w-6 mx-auto">
          <div className="text-center mb-5">
            <div className="text-900 text-3xl font-medium mb-4">Bienvenido a {props.table?.establishment.name}</div>
            <span className="text-600 font-medium line-height-3">Pulsa el botón para reservar la mesa</span>
          </div>

          <Button type="submit" label={`Reservar la mesa ${props.table?.number}`} className="w-full mt-3" onClick={onReserveTable} />
        </div>
      </div>
    </div>
  )
}
