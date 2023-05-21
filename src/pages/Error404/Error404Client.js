import React from 'react';

export function Error404Client() {
    return (
        <div className="flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden" style={{ backgroundColor: "white" }}>
            <div className="flex flex-column align-items-center justify-content-center">
                <div>
                    <div className="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center" style={{ borderRadius: '53px' }}>
                        <span className="text-blue-500 font-bold text-3xl">404</span>
                        <h1 className="text-900 font-bold text-5xl mb-2">Página no disponible</h1>
                        <div className="text-600 mb-5">El recurso solicitado no está disponible</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
