import { useState } from "react";
import styles from "../../style/admin/adminUsers.module.css";
import BanConfirmForm from "../forms/BanConfirmForm";
import PromoteConfirmForm from "../forms/PromoteConfirmForm";

// TODO: API → GET /api/admin/users
const MOCK_USERS = [
  { id: 1, name: "Marie Dupont",   email: "marie@example.com",  role: "user",    status: "active",  joined: "12 jan. 2025" },
  { id: 2, name: "Jean Martin",    email: "jean@example.com",   role: "manager", status: "active",  joined: "3 fév. 2025" },
  { id: 3, name: "Sophie Bernard", email: "sophie@example.com", role: "user",    status: "banned",  joined: "21 mars 2025" },
  { id: 4, name: "Lucas Petit",    email: "lucas@example.com",  role: "user",    status: "active",  joined: "5 avr. 2025" },
  { id: 5, name: "Emma Leroy",     email: "emma@example.com",   role: "admin",   status: "active",  joined: "1 jan. 2025" },
  { id: 6, name: "Thomas Moreau",  email: "thomas@example.com", role: "user",    status: "active",  joined: "18 mai 2025" },
];

const ROLE_LABELS = { admin: "Admin", manager: "Manager", user: "Utilisateur" };
const ROLE_BADGE  = { admin: styles.badgeAdmin, manager: styles.badgeManager, user: styles.badgeUser };

const searchIcon = (
  <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

function getInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function AdminUsers() {
  const [search, setSearch]       = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [confirmBan, setConfirmBan]         = useState(null); // userId
  const [confirmPromote, setConfirmPromote] = useState(null); // userId
  const [users, setUsers] = useState(MOCK_USERS);

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole   = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleBan = (userId) => {
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: "banned" } : u));
    setConfirmBan(null);
  };

  const handlePromote = (userId) => {
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: "manager" } : u));
    setConfirmPromote(null);
  };

  return (
    <div>
      {/* ── En-tête ── */}
      <div className={styles.header}>
        <h1 className={styles.title}>Utilisateurs</h1>
        <p className={styles.subtitle}>{users.length} comptes enregistrés sur la plateforme</p>
      </div>

      {/* ── Toolbar ── */}
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
        {filtered.length === 0 ? (
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
              {filtered.map((user) => (
                <>
                  <tr key={user.id}>
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
                        {ROLE_LABELS[user.role]}
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
                        {user.role === "user" && user.status === "active" && (
                          <button
                            className={`${styles.btnAction} ${styles.btnPromote}`}
                            onClick={() => {
                              setConfirmPromote(confirmPromote === user.id ? null : user.id);
                              setConfirmBan(null);
                            }}
                          >
                            ↑ Promouvoir
                          </button>
                        )}
                        {user.status === "active" && user.role !== "admin" && (
                          <button
                            className={`${styles.btnAction} ${styles.btnBan}`}
                            onClick={() => {
                              setConfirmBan(confirmBan === user.id ? null : user.id);
                              setConfirmPromote(null);
                            }}
                          >
                            ✕ Bannir
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
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}