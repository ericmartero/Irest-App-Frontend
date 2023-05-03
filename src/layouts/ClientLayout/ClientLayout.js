import React, { useState, useEffect } from 'react';
import { getBookingKey } from '../../utils/constants';
import { useParams } from 'react-router-dom';
import { useAuth, useTable } from '../../hooks';
import { HomeClient } from '../../pages/Client';
import { TopMenu } from '../../components/Client';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import QRCode from 'react-qr-code';
import './ClientLayout.scss';

export function ClientLayout(props) {

    const { children } = props;

    const paramsURL = useParams();
    const { authClient } = useAuth();
    const { tables, getTableClient } = useTable();

    const [table, setTable] = useState(null);
    const [showTableBookingQRDialog, setShowTableBookingQRDialog] = useState(false);

    useEffect(() => {
        getTableClient(paramsURL.idTable);
    }, [paramsURL.idTable, getTableClient]);

    useEffect(() => {
        if (tables) {
            setTable(tables);
        }
    }, [tables]);

    const hideShowTableBookingQRDialog = () => {
        setShowTableBookingQRDialog(false);
    };

    if (!authClient) {
        return <HomeClient />;
    }

    return (
        <div>
            <TopMenu table={table} />
            <div className="layout-main-container layout-main-mobile">
                <div className="layout-main children-margin">
                    {children}
                </div>
            </div>
            <div>
                <div className='fixed-button-container'>
                    <Button icon="pi pi-qrcode" rounded onClick={() => setShowTableBookingQRDialog(true)} />
                </div>
                <div className="footer-container">
                    <i className="pi pi-home" style={{ fontSize: '1.8rem' }} />
                    <i className="pi pi-credit-card" style={{ fontSize: '1.8rem' }} />
                </div>
            </div>

            <Dialog visible={showTableBookingQRDialog} style={{ width: '90vw' }}
                header="Código QR de invitación" modal onHide={hideShowTableBookingQRDialog}
                headerClassName='header_dialog_color'>
                <div className='header-qrDialog-container'>
                    {paramsURL && <QRCode value={`http://localhost:3000/client-invite/id_table=${paramsURL.idTable}&key=${getBookingKey()}`} />}
                </div>
            </Dialog>
        </div>
    )
}
