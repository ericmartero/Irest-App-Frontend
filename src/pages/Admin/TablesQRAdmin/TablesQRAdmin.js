import React, { useState, useEffect, useRef } from 'react';
import { useTable } from '../../../hooks';
import { DataView } from 'primereact/dataview';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tag } from 'primereact/tag';
import QRCode from 'react-qr-code';

export function TablesQRAdmin() {

    const intervalRef = useRef();
    const { loading, tables, getTables } = useTable();

    const [refreshTables, setRefreshTables] = useState(false);
    const [tablesCrud, setTablesCrud] = useState([]);

    const onRefresh = () => setRefreshTables((state) => !state);

    useEffect(() => {
        const autoRefreshTables = () => {
            onRefresh();
        }

        intervalRef.current = setInterval(autoRefreshTables, 10000);

        return () => {
            clearInterval(intervalRef.current);
        };
    }, []);

    useEffect(() => {
        getTables();
    }, [getTables, refreshTables])

    useEffect(() => {
        if (tables) {
            const filteredTables = tables.filter(table => table.active);
            setTablesCrud(filteredTables);
        }
    }, [tables]);

    const getSeverity = (table) => {

        if (table.tableBooking === null) {
            return 'success';
        }

        return 'danger';
    };

    const itemTemplate = (table, layout) => {
        if (!table) {
            return;
        }

        if (layout === 'grid') return gridItem(table);
    };

    const header = () => {
        return (
            <div className="grid grid-nogutter">
                <div className="col-6 textHeader">
                    <h3 className="m-0">CÓDIGOS QR MESAS</h3>
                </div>
            </div>
        );
    };

    const gridItem = (table) => {
        return (
            <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2">
                <div className="p-4 border-1 surface-border surface-card border-round">
                    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                        <div className="flex align-items-center gap-2">
                            <div className="text-2xl font-bold">Mesa {table.number}</div>
                        </div>

                        <Tag value={table.tableBooking === null ? 'VACÍA' : 'OCUPADA'} severity={getSeverity(table)}></Tag>
                    </div>
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        <QRCode value={`https://irest.netlify.app/${table.id}`} />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            {loading ?
                <div className="align-container">
                    <ProgressSpinner />
                </div>
                :
                <DataView value={tablesCrud} itemTemplate={itemTemplate} layout={'grid'} header={header()} emptyMessage='No se ha encontrado ninguna mesa' />
            }
        </>
    )
}
