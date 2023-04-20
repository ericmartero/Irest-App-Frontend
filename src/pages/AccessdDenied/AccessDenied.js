import React from 'react';
import './AccessDenied.scss';

export function AccessDenied() {
    return (
        <div className="align-main-container">
            <div className="first-container">
                <div className="w-full surface-card flex flex-column align-items-center second-container">
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
