import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth, useTable } from '../../hooks';
import { HomeClient } from '../../pages/Client';
import { TopMenu } from '../../components/Client';
import './ClientLayout.scss';

export function ClientLayout(props) {

    const { children } = props;

    const tableURL = useParams();
    const { authClient } = useAuth();
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

    if (!authClient) {
        return <HomeClient />;
    } 

    return (
        <div>
            <TopMenu table={table} />
            { children }
        </div>
    )
}
