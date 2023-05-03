import React from 'react';
import { Badge } from 'primereact/badge';
import './Header.scss';

export function Header(props) {

    const { name, isMain, goBack } = props;

    return (
        <>
            {isMain ?
                <div className='header-main-container'>
                    <h2>{name}</h2>
                    <i className="pi pi-shopping-cart p-overlay-badge" style={{ fontSize: '1.8rem' }}>
                        <Badge value="2"></Badge>
                    </i>
                </div>
                :
                <div className='header-main-container'>
                    <div className='header-container'>
                        <i className="pi pi-arrow-left" style={{ fontSize: '1rem', marginRight: '1rem' }} onClick={goBack}></i>
                        <h2>{name}</h2>
                    </div>
                    <i className="pi pi-shopping-cart p-overlay-badge" style={{ fontSize: '1.8rem' }}>
                        <Badge value="2"></Badge>
                    </i>
                </div>
            }
        </>
    )
}
