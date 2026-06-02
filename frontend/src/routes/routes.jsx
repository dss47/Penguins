import AuthPage from "../pages/AuthPage"
import LandingPage from "../pages/LandingPage"
import ProposerOutils from "../pages/ProposerOutils"
import ToolPage from "../pages/toolsPage"
import Validations from "../pages/Validations"
import MainPage from "../pages/MainPage"

export const publicRoutes = [
    { path: '/', element: <LandingPage/>, name: 'Landing Page' },
    { path: '/Auth', element: <AuthPage/>, name: 'Auth' },
    { path: '/ProposerOutils', element: <ProposerOutils/>, name: 'Proposer Outils' },
    { path: '/tools', element: <ToolPage/>, name: 'tools' },
    { path: '/Validations', element: <Validations/>, name: 'Validations' },
    { path: '/MainPage', element: <MainPage/>, name: 'Main Page' },
]