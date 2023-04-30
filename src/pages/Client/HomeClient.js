import React, { useState, useEffect } from 'react';
import { JoinTableClient, ReserveTableClient } from './AccessClientTables';
import { Categories } from './Categories';
import { useParams, useHistory } from 'react-router-dom';
import { useTable, useAuth } from '../../hooks';
import { ProgressSpinner } from 'primereact/progressspinner';
import '../../scss/AlignComponent.scss';

export function HomeClient() {

  const tableURL = useParams();
  const history = useHistory();
  const { authClient } = useAuth();
  const { loading, tables, getTableClient } = useTable();

  const [table, setTable] = useState(null);

  useEffect(() => {
    getTableClient(tableURL.id);
  }, [tableURL.id, getTableClient]);

  useEffect(() => {
    if (tables) {
      setTable(tables);
    }
  }, [tables]);

  return (
    <>
      {loading ?
        <div className="align-container-mobile">
          <ProgressSpinner />
        </div>
        :
        <>
          {table?.tableBooking === null
            ? <ReserveTableClient table={table} />
            : <JoinTableClient table={table} />
          }
        </>
      }
    </>
  )
}
