import React from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Button } from 'primereact/button';

export function MainPage() {

    const history = useHistory();

    const goAdmin = () => {
        history.push('/admin');
    };

    return (
        <div className="flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden" style={{backgroundColor: "white"}}>
            <div className="flex flex-column align-items-center justify-content-center">
                <div>
                    <div className="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center">
                        <img src="https://res.cloudinary.com/djwjh0wpw/image/upload/v1679673058/icono-irest_gvyksj.png" alt="logo" />
                        <h1 className="text-900 font-bold text-5xl mb-5" style={{textAlign: "center"}}>Bienvenido a iRest</h1>
                        <div className="text-600 mb-5" style={{textAlign: "center"}}>Escanea el codigo QR para poder acceder a una mesa</div>
                        <Button label='Acceder al panel de control' onClick={goAdmin}/>
                    </div>
                </div>
            </div>
        </div>
    );
}
