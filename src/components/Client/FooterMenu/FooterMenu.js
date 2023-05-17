import React, { useState, useEffect, useRef } from 'react';
import { getBookingKey } from '../../../utils/constants';
import { Payment } from '../Payment';
import { useTable, useTableBooking } from '../../../hooks';
import { useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import QRCode from 'react-qr-code';
import './FooterMenu.scss';

export function FooterMenu(props) {

    const { idTable } = props;

    const toast = useRef(null);
    const paramsURL = useParams();
    const { changeAlertClient } = useTableBooking();
    const { tables, getTableClient } = useTable();

    const [showTableBookingQRDialog, setShowTableBookingQRDialog] = useState(false);
    const [warnWaiterDialog, setWarnWaiterDialog] = useState(false);
    const [table, setTable] = useState(null);

    useEffect(() => {
        getTableClient(paramsURL.idTable);
    }, [paramsURL.idTable, getTableClient]);

    useEffect(() => {
        if (tables) {
            setTable(tables);
        }
    }, [tables]);

    const isPaidToast = () => {
        toast.current.show({ severity: 'info', summary: 'Pago realizado', detail: `Ya se ha realizado el pago de los pedidos`, life: 1500 });
    };

    const noOrdersToPaymentToast = () => {
        toast.current.show({ severity: 'info', summary: 'Pago', detail: `No hay pedidos para poder realizar el pago`, life: 1500 });
    };

    const showError = (error) => {
        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: error.message, life: 1500 });
    }

    const hideShowTableBookingQRDialog = () => {
        setShowTableBookingQRDialog(false);
    };

    const hideWarnWaiterDialog = () => {
        setWarnWaiterDialog(false);
    };

    const warnWaiter = async () => {
        try {
            await changeAlertClient(table.tableBooking.id, true);
            toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: `Se ha llamado al camarero correctamente`, life: 1500 });
        } catch (error) {
            showError(error);
        }

        setWarnWaiterDialog(false);
    };

    const finishwarnWaiterDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className='mt-3' outlined onClick={hideWarnWaiterDialog} />
            <Button label="Si" icon="pi pi-check" onClick={warnWaiter} />
        </React.Fragment>
    );

    return (
        <>
            <Toast ref={toast} position="bottom-center" />
            <div>
                <div className='fixed-button-container'>
                    <Button icon="pi pi-qrcode" className='footer-qr-button' rounded onClick={() => setShowTableBookingQRDialog(true)} />
                </div>
                <div className="footer-container">
                    <i className="pi pi-bell" style={{ fontSize: '1.8rem' }} onClick={() => setWarnWaiterDialog(true)} />
                    <Payment table={table} isPaidToast={isPaidToast} noOrdersToPaymentToast={noOrdersToPaymentToast} />
                </div>
            </div>

            <Dialog visible={showTableBookingQRDialog} style={{ width: '90vw' }} header="Código QR de invitación" modal onHide={hideShowTableBookingQRDialog}>
                <div className='header-qrDialog-container'>
                    {idTable && <QRCode value={`https://irest.netlify.app/client-invite/table=${idTable}&key=${getBookingKey()}`} />}
                </div>
            </Dialog>

            <Dialog visible={warnWaiterDialog} style={{ width: '90vw' }} modal header="Avisar al Camarero" onHide={hideWarnWaiterDialog} className='footer-warnWaiter-container'
                footer={finishwarnWaiterDialogFooter}>
                <div className="footer-payment-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>¿Seguro que quieres llamar a un camarero?</span>
                </div>
            </Dialog>
        </>
    )
}
