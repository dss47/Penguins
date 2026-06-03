import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import styles from "../style/Pages/adminPage.module.css";

export default function AdminPage() {
  return (
    <div className={styles.wrapper}>
      <AdminSidebar />
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}