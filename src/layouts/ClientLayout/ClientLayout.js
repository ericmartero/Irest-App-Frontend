import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth, useTable } from '../../hooks';
import { HomeClient } from '../../pages/Client';
import { TopMenu } from '../../components/Client';
import './ClientLayout.scss';

export function ClientLayout(props) {

    const { children } = props;

    const paramsURL = useParams();
    const { authClient } = useAuth();
    const { tables, getTableClient } = useTable();

    const [table, setTable] = useState(null);

    useEffect(() => {
        getTableClient(paramsURL.idTable);
    }, [paramsURL.idTable, getTableClient]);

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
            <div className="layout-main-container layout-main-mobile">
                <div className="layout-main">
                    {children}
                </div>
            </div>
        </div>
    )
}
