import React from 'react';
import { OrdersAdmin } from '../OrdersAdmin';
import { ChefTableDetails } from '../TableDetailsAdmin';
import { useAuth } from '../../../hooks';

export function HomePageAdmin() {

    const { auth } = useAuth();

    if (auth?.me.user.roles.includes('admin') || auth?.me.user.roles.includes('waiter')) {
        return (
            <OrdersAdmin/>
        )
    }

    else if (auth?.me.user.roles.includes('chef')) {
        return (
            <ChefTableDetails/>
        )
    }

    else {
        return (
            <OrdersAdmin/>
        )
    }
}
