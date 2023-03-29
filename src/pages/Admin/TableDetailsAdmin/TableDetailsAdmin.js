import React, { useState, useEffect } from 'react';
import { useOrder, useTable } from '../../../hooks';
import { useParams } from 'react-router-dom';

export function TableDetailsAdmin() {

  const tableURL = useParams();
  const { orders, getOrdersByTable } = useOrder();
  const { tables, getTableById } = useTable();

  const [table, setTable] = useState(null);
  const [order, setOrder] = useState(null);


  useEffect(() => {
    getTableById(tableURL.id);
  }, [tableURL.id, getTableById])

  useEffect(() => {
    if (tables) {
      setTable(tables);
    }
  }, [tables]);

  useEffect(() => {
    if (table && table.tableBooking !== null) {
      getOrdersByTable(table.tableBooking.id);
    }
  }, [table]);

  useEffect(() => {
    if (orders) {
      setOrder(orders);
    }
  }, [orders]);

  return (
    <div>
        <h2>Detalle de la mesa...</h2>
    </div>
  )
}
