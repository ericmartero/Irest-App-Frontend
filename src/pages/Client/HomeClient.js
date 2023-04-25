import React, { useState, useEffect } from 'react';
import { JoinTableClient, ReserveTableClient } from './AccessClientTables';
import { useParams } from 'react-router-dom';
import { useTable } from '../../hooks';

export function HomeClient() {

  const tableURL = useParams();
  const { tables, getTableClient } = useTable();

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
      {table?.tableBooking === null
        ? <ReserveTableClient />
        : <JoinTableClient table={table} />
      }
    </>
  )
}
