import React, { useState, useEffect } from "react";
import styles from "../../style/admin/adminUsers.module.css";
import BanConfirmForm from "../forms/BanConfirmForm";
import PromoteConfirmForm from "../forms/PromoteConfirmForm";
import DemoteConfirmForm from "../forms/DemoteConfirmForm";
import UnbanConfirmForm from "../forms/UnbanConfirmForm";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const ROLE_LABELS = { admin: "Admin", manager: "Manager", user: "Utilisateur" };
const ROLE_BADGE  = { admin: styles.badgeAdmin, manager: styles.badgeManager, user: styles.badgeUser };

const searchIcon = (
  <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

function getInitials(name) {
  return name ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "U";
}

export default function AdminUsers() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch]       = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  
  const [confirmBan, setConfirmBan]         = useState(null);
  const [confirmPromote, setConfirmPromote] = useState(null);
  const [confirmDemote, setConfirmDemote]   = useState(null);
  const [confirmUnban, setConfirmUnban]     = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    api.get("/admin/users")
      .then((res) => {
        setUsers(res.data || []);
      })
      .catch((err) => console.error("Error fetching users:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole   = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleBan = (userId) => {
    api.post("/admin/users/ban", { id: userId })
      .then(() => {
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: "suspended" } : u));
        setConfirmBan(null);
      })
      .catch((err) => console.error(err));
  };

  const handleUnban = (userId) => {
    api.post("/admin/users/unban", { id: userId })
      .then(() => {
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: "active" } : u));
        setConfirmUnban(null);
      })
      .catch((err) => console.error(err));
  };

  const handlePromote = (userId) => {
    api.post("/admin/users/promote", { id: userId })
      .then(() => {
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: "manager" } : u));
        setConfirmPromote(null);
      })
      .catch((err) => console.error(err));
  };

  const handleDemote = (userId) => {
    api.post("/admin/users/demote", { id: userId })
      .then(() => {
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: "user" } : u));
        setConfirmDemote(null);
      })
      .catch((err) => console.error(err));
  };

  const resetConfirms = () => {
    setConfirmBan(null);
    setConfirmPromote(null);
    setConfirmDemote(null);
    setConfirmUnban(null);
  };

  return (
    <div>
      {/* ── En-tête ── */}
      <div className={styles.header}>
        <h1 className={styles.title}>Utilisateurs</h1>
        <p className={styles.subtitle}>{users.length} comptes enregistrés sur la plateforme</p>
      </div>

      {/* ─�� Toolbar ── */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          {searchIcon}
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Rechercher par nom ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className={styles.filterSelect}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">Tous les rôles</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="user">Utilisateur</option>
        </select>
      </div>

      {/* ── Tableau ── */}
      <div className={styles.tableWrapper}>
        {loading ? (
          <div className={styles.empty}>Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>Aucun utilisateur trouvé.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Inscription</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((user) => (
                <React.Fragment key={user.id}>
                  <tr>
                    {/* Utilisateur */}
                    <td>
                      <div className={styles.userCell}>
                        <div className={styles.avatar}>{getInitials(user.name)}</div>
                        <div>
                          <div className={styles.userName}>{user.name}</div>
                          <div className={styles.userEmail}>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    {/* Rôle */}
                    <td>
                      <span className={`${styles.badge} ${ROLE_BADGE[user.role]}`}>
                        {ROLE_LABELS[user.role] || user.role}
                      </span>
                    </td>
                    {/* Statut */}
                    <td>
                      <span className={`${styles.badge} ${user.status === "active" ? styles.badgeActive : styles.badgeBanned}`}>
                        {user.status === "active" ? "Actif" : "Banni"}
                      </span>
                    </td>
                    {/* Date */}
                    <td>{user.joined}</td>
                    {/* Actions */}
                    <td>
                      <div className={styles.actions}>
                        {isAdmin && user.role === "user" && user.status === "active" && (
                          <button
                            className={`${styles.btnAction} ${styles.btnPromote}`}
                            onClick={() => {
                              resetConfirms();
                              setConfirmPromote(user.id);
                            }}
                          >
                            ↑ Promouvoir
                          </button>
                        )}
                        {isAdmin && user.role === "manager" && user.status === "active" && (
                          <button
                            className={`${styles.btnAction} ${styles.btnPromote}`}
                            style={{ color: "var(--warning)", backgroundColor: "color-mix(in srgb, var(--warning) 15%, transparent)" }}
                            onClick={() => {
                              resetConfirms();
                              setConfirmDemote(user.id);
                            }}
                          >
                            ↓ Rétrograder
                          </button>
                        )}
                        {user.status === "active" && user.role !== "admin" && (
                          <button
                            className={`${styles.btnAction} ${styles.btnBan}`}
                            onClick={() => {
                              resetConfirms();
                              setConfirmBan(user.id);
                            }}
                          >
                            ✕ Bannir
                          </button>
                        )}
                        {(user.status === "suspended" || user.status === "banned" || user.status === "deleted") && user.role !== "admin" && (
                          <button
                            className={`${styles.btnAction} ${styles.btnPromote}`}
                            style={{ color: "var(--success)", backgroundColor: "color-mix(in srgb, var(--success) 15%, transparent)" }}
                            onClick={() => {
                              resetConfirms();
                              setConfirmUnban(user.id);
                            }}
                          >
                            ✓ Débannir
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* ── Formulaire confirm ban inline ── */}
                  {confirmBan === user.id && (
                    <tr key={`ban-${user.id}`}>
                      <td colSpan={5} style={{ padding: "0 16px 12px" }}>
                        <BanConfirmForm
                          userName={user.name}
                          onConfirm={() => handleBan(user.id)}
                          onCancel={() => setConfirmBan(null)}
                        />
                      </td>
                    </tr>
                  )}

                  {/* ── Formulaire confirm promote inline ── */}
                  {confirmPromote === user.id && (
                    <tr key={`promote-${user.id}`}>
                      <td colSpan={5} style={{ padding: "0 16px 12px" }}>
                        <PromoteConfirmForm
                          userName={user.name}
                          onConfirm={() => handlePromote(user.id)}
                          onCancel={() => setConfirmPromote(null)}
                        />
                      </td>
                    </tr>
                  )}

                  {/* ── Formulaire confirm demote inline ── */}
                  {confirmDemote === user.id && (
                    <tr key={`demote-${user.id}`}>
                      <td colSpan={5} style={{ padding: "0 16px 12px" }}>
                        <DemoteConfirmForm
                          userName={user.name}
                          onConfirm={() => handleDemote(user.id)}
                          onCancel={() => setConfirmDemote(null)}
                        />
                      </td>
                    </tr>
                  )}

                  {/* ── Formulaire confirm unban inline ── */}
                  {confirmUnban === user.id && (
                    <tr key={`unban-${user.id}`}>
                      <td colSpan={5} style={{ padding: "0 16px 12px" }}>
                        <UnbanConfirmForm
                          userName={user.name}
                          onConfirm={() => handleUnban(user.id)}
                          onCancel={() => setConfirmUnban(null)}
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}

        {totalPages > 1 && filtered.length > 0 && (
          <div className={styles.paginationContainer}>
            <button
              className={styles.pageBtn}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Précédent
            </button>
            <span className={styles.pageInfo}>
              Page {currentPage} sur {totalPages}
            </span>
            <button
              className={styles.pageBtn}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
