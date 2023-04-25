import { MainLayout, ClientLayout } from '../layouts';
import { HomeClient, Categories } from '../pages/Client';

const routesClient = [
    {
        path: '/:id',
        layout: MainLayout,
        component: HomeClient,
        exact: true
    },
    {
        path: '/client/:id',
        layout: ClientLayout,
        component: Categories,
        exact: true
    }
];

export default routesClient;