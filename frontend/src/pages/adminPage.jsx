import { useState } from "react";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminUsers from "../components/admin/AdminUsers";
import AdminSuggestions from "../components/admin/AdminSuggestions";
import AdminModeration from "../components/admin/AdminModeration";
import styles from "../style/adminPage.module.css";

const TABS = {
  dashboard:   AdminDashboard,
  users:       AdminUsers,
  suggestions: AdminSuggestions,
  moderation:  AdminModeration,
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const ActiveComponent = TABS[activeTab];
  return (
    <div className={styles.wrapper}>
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className={styles.content}>
        <ActiveComponent />
      </main>
    </div>
  );
}