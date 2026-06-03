
import {Routes , Route , Navigate } from "react-router-dom"
import {publicRoutes, adminRoutes} from "./routes/routes"
import Layout from "./layout/Layout"
import AdminPage from "./pages/adminPage"

function App() {
  const user = "user"; 

  if (user === "admin") {
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
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          {publicRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
        <Route path="/" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App