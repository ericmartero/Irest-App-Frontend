import { MainLayout, ClientLayout } from '../layouts';
import { HomeClient, Categories, Products, InviteClientTable, OrdersTracking } from '../pages/Client';

const routesClient = [
    {
        path: '/:idTable',
        layout: MainLayout,
        component: HomeClient,
        exact: true
    },
        {
        path: '/client-invite/id_table=:idTable&key=:key',
        layout: MainLayout,
        component: InviteClientTable,
        exact: true
    },
    {
        path: '/client/id_table=:idTable',
        layout: ClientLayout,
        component: Categories,
        exact: true
    },
    {
        path: '/client/:idTable/orders',
        layout: ClientLayout,
        component: OrdersTracking,
        exact: true
    },
    {
        path: '/client/:idTable/:idCategory',
        layout: ClientLayout,
        component: Products,
        exact: true
    }
];

export default routesClient;