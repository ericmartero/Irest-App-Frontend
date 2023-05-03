import React, { useState } from 'react';
import { getBookingKey } from '../../../utils/constants';
import { useParams } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import QRCode from 'react-qr-code';
import './Header.scss';

export function Header(props) {

    const { name, isMain, goBack } = props;

    const paramsURL = useParams();
    const [showTableBookingQRDialog, setShowTableBookingQRDialog] = useState(false);

    const hideShowTableBookingQRDialog = () => {
        setShowTableBookingQRDialog(false);
    };

    return (
        <>
            {isMain ?
                <div className='header-main-container'>
                    <h2>{name}</h2>
                    <Button icon="pi pi-qrcode" className="layout-button" onClick={() => setShowTableBookingQRDialog(true)} />
                </div>
                :
                <div className='header-main-container'>
                    <div className='header-container'>
                        <i className="pi pi-arrow-left" style={{ fontSize: '1rem', marginRight: '1rem' }} onClick={goBack}></i>
                        <h2>{name}</h2>
                    </div>
                    <Button icon="pi pi-qrcode" className="layout-button" onClick={() => setShowTableBookingQRDialog(true)} />
                </div>
            }

            <Dialog visible={showTableBookingQRDialog} style={{ width: '90vw' }}
                header="Código QR de invitación" modal onHide={hideShowTableBookingQRDialog}
                headerClassName='header_dialog_color'>
                <div className='header-qrDialog-container'>
                    {paramsURL && <QRCode value={`http://localhost:3000/client-invite/id_table=${paramsURL.idTable}&key=${getBookingKey()}`} />}
                </div>
            </Dialog>
        </>
    )
}
