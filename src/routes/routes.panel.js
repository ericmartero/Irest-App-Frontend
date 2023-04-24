import { DashboardLayout } from '../layouts';
import { HomePageAdmin, UsersAdmin, CategoriesAdmin, ProductsAdmin, TablesAdmin, PaymentsHistoryAdmin } from '../pages/Admin';
import { WaiterTableDetails } from '../pages/Admin/TableDetailsAdmin';

const routesPanel = [
    {
        path: '/admin',
        layout: DashboardLayout,
        component: HomePageAdmin,
        exact: true
    },
    {
        path: '/admin/users',
        layout: DashboardLayout,
        component: UsersAdmin,
        exact: true
    },
    {
        path: '/admin/categories',
        layout: DashboardLayout,
        component: CategoriesAdmin,
        exact: true
    },
    {
        path: '/admin/products',
        layout: DashboardLayout,
        component: ProductsAdmin,
        exact: true
    },
    {
        path: '/admin/tables',
        layout: DashboardLayout,
        component: TablesAdmin,
        exact: true
    },
    {
        path: '/admin/table/:id',
        layout: DashboardLayout,
        component: WaiterTableDetails,
        exact: true
    },
    {
        path: '/admin/payments-history',
        layout: DashboardLayout,
        component: PaymentsHistoryAdmin,
        exact: true
    }
];

export default routesPanel;