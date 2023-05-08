import React, { useState } from 'react';
import { getBookingKey } from '../../../utils/constants';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import QRCode from 'react-qr-code';
import './FooterMenu.scss';

export function FooterMenu(props) {

    const { idTable } = props;

    const [showTableBookingQRDialog, setShowTableBookingQRDialog] = useState(false);
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);

    const hideShowTableBookingQRDialog = () => {
        setShowTableBookingQRDialog(false);
    };


    const hideShowPaymentDialog = () => {
        setShowPaymentDialog(false);
    };

    return (
        <>
            <div>
                <div className='fixed-button-container'>
                    <Button icon="pi pi-qrcode" className='footer-qr-button' rounded onClick={() => setShowTableBookingQRDialog(true)} />
                </div>
                <div className="footer-container">
                    <i className="pi pi-home" style={{ fontSize: '1.8rem' }} />
                    <i className="pi pi-credit-card" style={{ fontSize: '1.8rem' }} onClick={() => setShowPaymentDialog(true)} />
                </div>
            </div>

            <Dialog visible={showTableBookingQRDialog} style={{ width: '90vw' }} header="Código QR de invitación" modal onHide={hideShowTableBookingQRDialog}>
                <div className='header-qrDialog-container'>
                    {idTable && <QRCode value={`https://irest.netlify.app/client-invite/id_table=${idTable}&key=${getBookingKey()}`} />}
                </div>
            </Dialog>

            <Dialog visible={showPaymentDialog} style={{ width: '90vw' }} header="Método de pago" modal onHide={hideShowPaymentDialog}>
                <div className='paymentDialog-container'>
                    <Button icon="pi pi-credit-card" label='Tarjeta' />
                    <Button icon="pi pi-wallet" label='Efectivo' />
                </div>
            </Dialog>
        </>
    )
}
