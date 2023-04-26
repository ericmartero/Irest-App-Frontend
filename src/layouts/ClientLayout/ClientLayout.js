import React from 'react';
import { useAuth } from '../../hooks';
import { HomeClient } from '../../pages/Client';
import './ClientLayout.scss';

export function ClientLayout(props) {

    const { children } = props;
    const { authClient } = useAuth();

    if (!authClient) {
        return <HomeClient />;
    } 

    return (
        <div>
            <p>ClientLayout</p>

            { children }
        </div>
    )
}
