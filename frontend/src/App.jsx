import { Routes, Route, Navigate } from "react-router-dom"
import { publicRoutes, adminRoutes } from "./routes/routes"
import Layout from "./layout/Layout"
import AdminPage from "./pages/adminPage"
import ManagerLayout from "./components/manager/ManagerLayout"
import { AuthProvider, useAuth } from "./context/AuthContext"

function AppContent() {
  const { loading, isAuthenticated, isAdmin, isManager } = useAuth()

  if (loading) {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>Chargement...</div>
  }

  if (isAuthenticated && isAdmin) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminPage />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          {adminRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        {isAuthenticated && isManager && (
          <Route path="manager" element={<ManagerLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            {adminRoutes
              .filter(r => r.path !== 'users')
              .map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))
            }
          </Route>
        )}
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
