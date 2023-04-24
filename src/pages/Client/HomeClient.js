import React, { useState, useEffect } from 'react';
import { JoinTableClient, ReserveTableClient } from './AccessClientTables';
import { useParams } from 'react-router-dom';
import { useTable } from '../../hooks';

export function HomeClient() {

  const tableURL = useParams();
  const { tables, getTableById } = useTable();

  const [table, setTable] = useState(null);

  useEffect(() => {
    getTableById(tableURL.id);
  }, [tableURL.id, getTableById]);

  useEffect(() => {
    if (tables) {
      setTable(tables);
    }
  }, [tables]);

  return (
    <>
      {table?.tableBooking === null
        ? <ReserveTableClient />
        : <JoinTableClient />
      }
    </>
  )
}
