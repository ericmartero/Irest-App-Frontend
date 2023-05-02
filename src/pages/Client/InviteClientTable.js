import React, { useState, useEffect } from 'react';
import { useTableBooking, useAuth } from '../../hooks';
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
        const { tokenSession } = response;
        join(tokenSession);
        history.push(`/client/id_table=${paramsURL.idTable}&key=${paramsURL.key}`);
      } catch (error) {
        setError(true);
      }
    })()
  }, [history, join, joinTable, paramsURL.idTable, paramsURL.key])

  if (error) {
    return <h1>ERROR!!</h1>
  }

  return (
    <div className="align-container-mobile">
      <ProgressSpinner />
    </div>
  )
}
