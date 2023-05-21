import routesPanel from './routes.panel';
import routesClient from './routes.client';
import { Error404 } from '../pages/Error404';
import { Error404Layout } from '../layouts';

const routes = [
    ...routesPanel,
    ...routesClient,
    {
        layout: Error404Layout,
        component: Error404,
    }
];

export default routes;