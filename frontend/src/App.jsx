
import {Routes , Route , Navigate } from "react-router-dom"
import {publicRoutes} from "./routes/routes"
import Layout from "./layout/Layout"
function App() {
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