import React, { useState, useEffect } from 'react';
import { JoinTableClient, ReserveTableClient } from './AccessClientTables';
import { useParams } from 'react-router-dom';
import { useTable } from '../../hooks';
import { ProgressSpinner } from 'primereact/progressspinner';
import '../../scss/AlignComponent.scss';

export function HomeClient() {

  const tableURL = useParams();
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
