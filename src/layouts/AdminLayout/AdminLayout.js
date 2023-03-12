import React from 'react';
import { useAuth } from '../../hooks';
import { LoginAdmin } from '../../pages/Admin';
import { TopMenu } from '../../components/Admin';
import './AdminLayout.scss';

export function AdminLayout(props) {

    const { children } = props;
    const { auth } = useAuth();

    if (!auth) return <LoginAdmin />;

    return (
        <div>
            <TopMenu/>
            {children}
        </div>
    )
}
