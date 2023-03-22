import { AdminLayout } from '../layouts';
import { HomeAdmin, UsersAdmin, CategoriesAdmin, ProductsAdmin } from '../pages/Admin';

const routesAdmin = [
    {
        path: '/admin',
        layout: AdminLayout,
        component: HomeAdmin,
        exact: true
    },
    {
        path: '/admin/users',
        layout: AdminLayout,
        component: UsersAdmin,
        exact: true
    },
    {
        path: '/admin/categories',
        layout: AdminLayout,
        component: CategoriesAdmin,
        exact: true
    },
    {
        path: '/admin/products',
        layout: AdminLayout,
        component: ProductsAdmin,
        exact: true
    }
];

export default routesAdmin;