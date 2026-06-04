import AuthPage from "../pages/AuthPage"
import LandingPage from "../pages/LandingPage"
import ProposerOutils from "../pages/ProposerOutils"
import ToolPage from "../pages/toolsPage"
import Validations from "../pages/Validations"
import MainPage from "../pages/MainPage"
import Library from "../pages/Library"
import ShelfItems from "../components/library/ShelfItems"

import AdminDashboard from "../components/admin/AdminDashboard";
import AdminUsers from "../components/admin/AdminUsers";
import AdminModeration from "../components/admin/AdminModeration";

export const publicRoutes = [
    { path: '/', element: <LandingPage/>, name: 'Landing Page' },
    { path: '/Auth', element: <AuthPage/>, name: 'Auth' },
    { path: '/ProposerOutils', element: <ProposerOutils/>, name: 'Proposer Outils' },
    { path: '/tools', element: <ToolPage/>, name: 'tools' },
    { path: '/Validations', element: <Validations/>, name: 'Validations' },
    { path: '/MainPage', element: <MainPage/>, name: 'Main Page' },
    { path: '/Library', element: <Library/>, name: 'Library' },
    { path: '/Library/Shelf/:shelfIndex', element: <ShelfItems/>, name: 'Shelf Items' },
]

export const adminRoutes = [
    { path: 'dashboard', element: <AdminDashboard/>, name: 'Dashboard' },
    { path: 'users', element: <AdminUsers/>, name: 'Users' },
    { path: 'suggestions', element: <Validations/>, name: 'Validations' },
    { path: 'moderation', element: <AdminModeration/>, name: 'Moderation' },
]