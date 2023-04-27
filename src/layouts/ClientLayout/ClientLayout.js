import React from 'react';
import { useAuth } from '../../hooks';
import { HomeClient } from '../../pages/Client';
import { TopMenu } from '../../components/Client';
import './ClientLayout.scss';

export function ClientLayout(props) {

    const { children } = props;
    const { authClient } = useAuth();

    if (!authClient) {
        return <HomeClient />;
    } 

    return (
        <div>
            <TopMenu />
            { children }
        </div>
    )
}
