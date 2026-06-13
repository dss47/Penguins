import AuthPage from "../pages/AuthPage"
import LandingPage from "../pages/LandingPage"
import ProposerOutils from "../pages/ProposerOutils"
import ToolPage from "../pages/toolsPage"
import Validations from "../pages/Validations"
import Library from "../pages/Library"
import ShelfItems from "../components/library/ShelfItems"
import HomeSearch from "../pages/HomeSearch"
import ToolDetailsPage from "../pages/toolDetailsPage"
import Profile from "../pages/Profile"

import AdminDashboard from "../components/admin/AdminDashboard";
import AdminUsers from "../components/admin/AdminUsers";
import AdminModeration from "../components/admin/AdminModeration";
import AdminAddTool from "../components/admin/AdminAddTool";
import AdminTools from "../components/admin/AdminTools";
import AdminEntityManager from "../components/admin/AdminEntityManager";

export const publicRoutes = [
    { path: '/', element: <LandingPage/>, name: 'Landing Page' },
    { path: '/Auth', element: <AuthPage/>, name: 'Auth' },
    { path: '/ProposerOutils', element: <ProposerOutils/>, name: 'Proposer Outils' },
    { path: '/tools', element: <ToolPage/>, name: 'tools' },
    { path: '/Validations', element: <Validations/>, name: 'Validations' },
    { path: '/MainPage', element: <HomeSearch/>, name: 'Main Page' },
    { path: '/Library', element: <Library/>, name: 'Library' },
    { path: '/Library/Shelf/:shelfIndex', element: <ShelfItems/>, name: 'Shelf Items' },
    { path: '/HomeSearch', element: <HomeSearch/>, name: 'Home Search' },
    { path: '/Profile', element: <Profile/>, name: 'Profile' },
    { path: '/tool/:name', element: <ToolDetailsPage/>, name: 'ToolDetailsPage' },
]

export const adminRoutes = [
    { path: 'dashboard', element: <AdminDashboard/>, name: 'Dashboard' },
    { path: 'users', element: <AdminUsers/>, name: 'Users' },
    { path: 'suggestions', element: <Validations/>, name: 'Validations' },
    { path: 'moderation', element: <AdminModeration/>, name: 'Moderation' },
    { path: 'add', element: <AdminAddTool/>, name: 'Add Tool' },
    { path: 'tools', element: <AdminTools/>, name: 'Manage Tools' },
    { path: 'data', element: <AdminEntityManager/>, name: 'Gérer les données' },
]
