import { MainLayout, ClientLayout } from '../layouts';
import { HomeClient, Categories, Products, InviteClientTable, OrdersTracking } from '../pages/Client';

const routesClient = [
    {
        path: '/client-invite/table=:idTable&key=:key',
        layout: MainLayout,
        component: InviteClientTable,
        exact: true
    },
    {
        path: '/:idTable',
        layout: MainLayout,
        component: HomeClient,
        exact: true
    },
    {
        path: '/client/table=:idTable',
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