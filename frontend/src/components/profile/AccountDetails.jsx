import { useEffect, useState } from "react";
import { Loader2, Check, X, AlertTriangle, Trash2 } from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import style from "../../style/profile/AccountDetails.module.css"

const inputStyle = {
    width: "100%", padding: "6px 10px", background: "var(--bg-card-h)",
    border: "1px solid var(--bd)", borderRadius: "8px", color: "var(--text)",
    fontSize: ".88rem", fontFamily: "inherit", boxSizing: "border-box", outline: "none",
};

const selectStyle = { ...inputStyle, cursor: "pointer" };

const AccountDetails = () =>{
    const { logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [professions, setProfessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editError, setEditError] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editProfessionId, setEditProfessionId] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");

    const fetchProfile = () => {
        api.get("/user/profile")
            .then((res) => setProfile(res.data || null))
            .catch(() => {});
    };

    useEffect(() => {
        Promise.all([
            api.get("/user/profile"),
            api.get("/professions"),
        ]).then(([profileRes, profRes]) => {
            setProfile(profileRes.data || null);
            setProfessions(profRes.data || []);
        }).catch(() => {}).finally(() => setLoading(false));
    }, []);

    const startEditing = () => {
        setEditName(profile?.name || "");
        setEditEmail(profile?.email || "");
        setEditProfessionId(profile?.profession_id != null ? String(profile.profession_id) : "");
        setCurrentPassword("");
        setNewPassword("");
        setNewPasswordConfirmation("");
        setEditError("");
        setEditing(true);
    };

    const cancelEditing = () => {
        setEditing(false);
        setEditError("");
    };

    const handleSave = () => {
        if (!editName.trim()) { setEditError("Name is required."); return; }
        if (!editEmail.trim()) { setEditError("Email is required."); return; }

        setSaving(true);
        setEditError("");

        const payload = {
            name: editName.trim(),
            email: editEmail.trim(),
            profession_id: editProfessionId ? Number(editProfessionId) : null,
            current_password: currentPassword,
            new_password: newPassword,
            new_password_confirmation: newPasswordConfirmation,
        };

        api.post("/user/profile/update", payload)
            .then((res) => {
                setEditing(false);
                fetchProfile();
            })
            .catch((err) => {
                const msg = err?.response?.data?.message || err?.message || err?.data?.message || "Error saving profile";
                setEditError(msg);
            })
            .finally(() => setSaving(false));
    };

    if (loading) {
        return (
            <div className={`${style.card} ${style.full}`}>
                <div className={style.card_head}><h2>⚙️ Account Details</h2></div>
                <div className={style.card_body} style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                    <Loader2 size={20} className="animate-spin" />
                </div>
            </div>
        );
    }
    if (!profile) return null;

    const statusColor = profile.status === "active" ? "var(--ng)" : profile.status === "suspended" ? "var(--err)" : "var(--text-muted)";

    const formatFullDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    };

    return(
        <div className={`${style.card} ${style.full}`}>
        <div className={style.card_head}>
          <h2>⚙️ Account Details</h2>
          {!editing ? (
            <button onClick={startEditing} className="btn-ghost" style={{
                background: "transparent", border: "1px solid var(--bd)", borderRadius: "8px",
                padding: "5px 14px", fontFamily: "inherit", fontSize: ".78rem", fontWeight: 600,
                color: "var(--nv)", cursor: "pointer",
            }}>Edit</button>
          ) : null}
        </div>
        <div className={style.card_body}>
          {editError && (
            <div style={{
                padding: "10px 14px", marginBottom: "14px", borderRadius: "10px",
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                fontSize: ".82rem", color: "#f87171",
            }}>{editError}</div>
          )}
          <div className={style.settings_grid}>
            <div className={style.settings_field}>
              <div className={style.settings_label}>Full Name</div>
              {editing ? (
                <input style={inputStyle} value={editName} onChange={(e) => setEditName(e.target.value)} />
              ) : (
                <div className={style.settings_val}>{profile.name}</div>
              )}
            </div>
            <div className={style.settings_field}>
              <div className={style.settings_label}>Email Address</div>
              {editing ? (
                <input style={inputStyle} value={editEmail} onChange={(e) => setEditEmail(e.target.value)} type="email" />
              ) : (
                <div className={`${style.settings_val} ${style.monospace}`}>{profile.email}</div>
              )}
            </div>
            <div className={style.settings_field}>
              <div className={style.settings_label}>Role</div>
              <div className={style.settings_val}>{profile.role}</div>
            </div>
            <div className={style.settings_field}>
              <div className={style.settings_label}>Account Status</div>
              <div className={style.settings_val} style={{ color: statusColor }}>● {profile.status}</div>
            </div>
            <div className={style.settings_field}>
              <div className={style.settings_label}>Profession</div>
              {editing ? (
                <select style={selectStyle} value={editProfessionId} onChange={(e) => setEditProfessionId(e.target.value)}>
                  <option value="">—</option>
                  {professions.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              ) : (
                <div className={style.settings_val}>{profile.profession_name || "—"}</div>
              )}
            </div>
            <div className={style.settings_field}>
              <div className={style.settings_label}>Password</div>
              {editing ? (
                <input style={inputStyle} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} type="password" placeholder="Current password" />
              ) : (
                <div className={`${style.settings_val} ${style.redacted}`}>●●●●●●●●●●</div>
              )}
            </div>
            {editing && (
              <>
                <div className={style.settings_field}>
                  <div className={style.settings_label}>New Password</div>
                  <input style={inputStyle} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" placeholder="New password" />
                </div>
                <div className={style.settings_field}>
                  <div className={style.settings_label}>Confirm New Password</div>
                  <input style={inputStyle} value={newPasswordConfirmation} onChange={(e) => setNewPasswordConfirmation(e.target.value)} type="password" placeholder="Confirm new password" />
                </div>
              </>
            )}
            <div className={style.settings_field}>
              <div className={style.settings_label}>Member Since</div>
              <div className={style.settings_val}>{formatFullDate(profile.created_at)}</div>
            </div>
            <div className={style.settings_field}>
              <div className={style.settings_label}>Last Updated</div>
              <div className={style.settings_val}>{formatFullDate(profile.updated_at)}</div>
            </div>
          </div>
          {editing && (
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "16px" }}>
              <button onClick={cancelEditing} disabled={saving} style={{
                  padding: "8px 16px", border: "1px solid var(--bd)", borderRadius: "9px",
                  background: "transparent", color: "var(--muted)", cursor: "pointer",
                  fontSize: "13px", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "5px",
              }}>
                <X size={13} /> Cancel
              </button>
              <button onClick={handleSave} disabled={saving} style={{
                  padding: "8px 18px", border: "none", borderRadius: "9px",
                  background: saving ? "var(--bd)" : "linear-gradient(135deg, var(--nc), var(--nv))",
                  color: saving ? "var(--muted)" : "#fff", cursor: saving ? "not-allowed" : "pointer",
                  fontSize: "13px", fontWeight: 600, fontFamily: "inherit", display: "flex", alignItems: "center", gap: "5px",
              }}>
                {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                Save
              </button>
            </div>
          )}
        </div>

        <div className={style.dangerZone}>
          <div className={style.dangerHead}><AlertTriangle size={16} /> Zone dangereuse</div>
          <p className={style.dangerDesc}>La suppression de votre compte est irréversible après 30 jours. Vous pouvez annuler en vous reconnectant pendant cette période.</p>
          <button className={style.deleteBtn} onClick={() => { setShowDeleteConfirm(true); setDeleteError(""); }}>
            <Trash2 size={14} /> Supprimer mon compte
          </button>
        </div>

        {showDeleteConfirm && (
          <div className={style.confirmOverlay} onClick={() => !deleting && setShowDeleteConfirm(false)}>
            <div className={style.confirmDialog} onClick={(e) => e.stopPropagation()}>
              <h3 className={style.confirmTitle}><AlertTriangle size={18} /> Confirmer la suppression</h3>
              <p className={style.confirmText}>
                Êtes-vous sûr de vouloir supprimer votre compte ? Vous avez 30 jours pour annuler cette action en vous reconnectant.
              </p>
              {deleteError && <p className={style.confirmError}>{deleteError}</p>}
              <div className={style.confirmActions}>
                <button className={style.confirmCancel} disabled={deleting} onClick={() => setShowDeleteConfirm(false)}>
                  Annuler
                </button>
                <button className={style.confirmDelete} disabled={deleting} onClick={() => {
                  setDeleting(true);
                  setDeleteError("");
                  api.post("/user/delete")
                    .then(() => { logout(); })
                    .catch((err) => {
                      setDeleteError(err?.response?.data?.message || err?.message || "Erreur lors de la suppression");
                    })
                    .finally(() => setDeleting(false));
                }}>
                  {deleting ? <><Loader2 size={14} className="animate-spin" /> Suppression...</> : "Oui, supprimer mon compte"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
}
export default AccountDetails