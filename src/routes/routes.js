import routesAdmin from './routes.admin';
import routesClient from './routes.client';
import { Error404 } from '../pages';
import { Error404Layout } from '../layouts';

const routes = [
    ...routesAdmin,
    ...routesClient,
    {
        layout: Error404Layout,
        component: Error404,
    }
];

export default routes;