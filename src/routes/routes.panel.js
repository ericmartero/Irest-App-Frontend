import { DashboardLayout, MainLayout } from '../layouts';
import {
    HomePageAdmin,
    UsersAdmin,
    CategoriesAdmin,
    ProductsAdmin,
    TablesAdmin,
    PaymentsHistoryAdmin,
    TablesQRAdmin,
    UsersEstablishmentsAdmin,
    ChefTableDetails
} from '../pages/Admin';
import { MainPage } from '../pages/MainPage';
import { WaiterTableDetails } from '../pages/Admin/TableDetailsAdmin';

const routesPanel = [
    {
        path: '/',
        layout: MainLayout,
        component: MainPage,
        exact: true
    },
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
    },
    {
        path: '/admin/tables-qr',
        layout: DashboardLayout,
        component: TablesQRAdmin,
        exact: true
    },
    {
        path: '/admin/users-establishments',
        layout: DashboardLayout,
        component: UsersEstablishmentsAdmin,
        exact: true
    },
    {
        path: '/admin/orders-kitchen',
        layout: DashboardLayout,
        component: ChefTableDetails,
        exact: true
    }
];

export default routesPanel;