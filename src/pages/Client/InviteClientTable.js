import React, { useState, useEffect } from 'react';
import { useTableBooking, useAuth } from '../../hooks';
import { setBookingKey } from '../../api/bookingKey';
import { Error404Client } from '../Error404';
import { useParams, useHistory } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import '../../scss/AlignComponent.scss';

export function InviteClientTable() {

  const paramsURL = useParams();
  const history = useHistory();
  const { join } = useAuth();
  const { joinTable } = useTableBooking();
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await joinTable(paramsURL.idTable, paramsURL.key);
        const { tokenSession, key } = response;
        join(tokenSession);
        setBookingKey(key);
        history.push(`/client/table=${paramsURL.idTable}`);
      } catch (error) {
        setError(true);
      }
    })()
  }, [history, join, joinTable, paramsURL.idTable, paramsURL.key])

  if (error) {
    return <Error404Client/>
  }

  return (
    <div className="align-container-mobile">
      <ProgressSpinner />
    </div>
  )
}
