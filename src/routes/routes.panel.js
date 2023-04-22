import { AdminLayout } from '../layouts';
import { HomePageAdmin, UsersAdmin, CategoriesAdmin, ProductsAdmin, TablesAdmin, PaymentsHistoryAdmin } from '../pages/Admin';
import { WaiterTableDetails } from '../pages/Admin/TableDetailsAdmin';

const routesPanel = [
    {
        path: '/admin',
        layout: AdminLayout,
        component: HomePageAdmin,
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
    },
    {
        path: '/admin/tables',
        layout: AdminLayout,
        component: TablesAdmin,
        exact: true
    },
    {
        path: '/admin/table/:id',
        layout: AdminLayout,
        component: WaiterTableDetails,
        exact: true
    },
    {
        path: '/admin/payments-history',
        layout: AdminLayout,
        component: PaymentsHistoryAdmin,
        exact: true
    }
];

export default routesPanel;