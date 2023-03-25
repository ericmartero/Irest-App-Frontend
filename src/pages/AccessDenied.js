import React from 'react';
import '../scss/AlignComponent.scss';

export function AccessDenied() {
    return (
        <div className="align-container">
            <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, rgba(247, 149, 48, 0.4) 10%, rgba(247, 149, 48, 0) 30%)' }}>
                <div className="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center" style={{ borderRadius: '53px' }}>
                    <div className="flex justify-content-center align-items-center bg-pink-500 border-circle" style={{ height: '3.2rem', width: '3.2rem' }}>
                        <i className="pi pi-fw pi-exclamation-circle text-2xl text-white"></i>
                    </div>
                    <h1 className="text-900 font-bold text-5xl mb-2">Acceso denegado</h1>
                    <div className="text-600 mb-5">No tienes los permisos necesarios para acceder a este recurso.</div>
                    <img src="https://res.cloudinary.com/djwjh0wpw/image/upload/v1679785461/accesdenied_lbmh1z.png" alt="Error" className="mb-5" width="80%" />
                </div>
            </div>
        </div>
    )
}
