import { Routes, Route, Navigate } from "react-router-dom"
import { publicRoutes, adminRoutes } from "./routes/routes"
import Layout from "./layout/Layout"
import AdminPage from "./pages/adminPage"
import { AuthProvider, useAuth } from "./context/AuthContext"

function AppContent() {
  const { loading, isAuthenticated, isAdmin, role } = useAuth()

  if (loading) {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>Chargement...</div>
  }

  if (isAuthenticated && (isAdmin || role === "manager")) {
    const allowedRoutes = isAdmin
      ? adminRoutes
      : adminRoutes.filter((r) => r.path !== "dashboard")

    return (
      <Routes>
        <Route path="/admin" element={<AdminPage />}>
          <Route
            index
            element={<Navigate to={isAdmin ? "dashboard" : "users"} replace />}
          />
          {allowedRoutes.map((route) => (
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
