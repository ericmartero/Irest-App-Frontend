import React, { useState } from 'react';
import { getBookingKey } from '../../../utils/constants';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import QRCode from 'react-qr-code';
import './FooterMenu.scss';

export function FooterMenu(props) {

    const { idTable } = props;

    const [showTableBookingQRDialog, setShowTableBookingQRDialog] = useState(false);

    const hideShowTableBookingQRDialog = () => {
        setShowTableBookingQRDialog(false);
    };

    return (
        <>
            <div>
                <div className='fixed-button-container'>
                    <Button icon="pi pi-qrcode" className='footer-qr-button' rounded onClick={() => setShowTableBookingQRDialog(true)} />
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
                    {idTable && <QRCode value={`http://localhost:3000/client-invite/id_table=${idTable}&key=${getBookingKey()}`} />}
                </div>
            </Dialog>
        </>
    )
}
