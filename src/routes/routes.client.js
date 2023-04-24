import { MainLayout, ClientLayout } from '../layouts';
import { HomeClient } from '../pages/Client';

const routesClient = [
    {
        path: '/:id',
        layout: MainLayout,
        component: HomeClient,
        exact: true
    },
];

export default routesClient;