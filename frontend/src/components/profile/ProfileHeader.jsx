import { useEffect, useState, useRef } from "react";
import { Loader2, Camera } from "lucide-react";
import api, { API_BASE } from "../../services/api";
import style from "../../style/profile/ProfileHeader.module.css"

const ProfileHeader = () =>{
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const fileRef = useRef(null);

    const fetchProfile = () => {
        api.get("/user/profile")
            .then((res) => setProfile(res.data || null))
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchProfile(); }, []);

    const handleAvatarClick = () => fileRef.current?.click();

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarUploading(true);
        const fd = new FormData();
        fd.append("avatar", file);
        api.post("/user/profile/update", fd)
            .then(() => fetchProfile())
            .catch(() => {})
            .finally(() => {
                setAvatarUploading(false);
                if (fileRef.current) fileRef.current.value = "";
            });
    };

    if (loading) {
        return (
            <div className={style.hero} style={{ display: "flex", justifyContent: "center", padding: "2rem 0" }}>
                <Loader2 size={24} className="animate-spin" />
            </div>
        );
    }
    if (!profile) return null;

    const hasAvatar = profile.profile_url;
    const avatarSrc = hasAvatar
        ? (profile.profile_url.startsWith("/") ? API_BASE + profile.profile_url : profile.profile_url)
        : null;

    const initials = (profile.name || "?")
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const daysActive = profile.created_at
        ? Math.floor((Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24))
        : 0;

    const joinedDate = profile.created_at
        ? new Date(profile.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long" })
        : "";

    const statusDot = profile.status === "active" ? "var(--ng)" : profile.status === "suspended" ? "var(--err)" : "var(--text-muted)";

    return(
        <div className={style.hero}>
        <div className={style.avatar_wrap} style={{ cursor: "pointer" }} onClick={handleAvatarClick} title="Change profile picture">
          {avatarUploading ? (
            <div className={style.avatar}>
              <Loader2 size={28} className="animate-spin" />
            </div>
          ) : avatarSrc ? (
            <div className={style.avatar} style={{ overflow: "hidden" }}>
              <img src={avatarSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
            </div>
          ) : (
            <div className={style.avatar}>{initials}</div>
          )}
          <div className={style.avatar_status}></div>
          <div style={{
              position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
              borderRadius: "50%", background: "rgba(0,0,0,0.4)", display: "flex",
              alignItems: "center", justifyContent: "center", opacity: 0,
              transition: "opacity 0.2s", color: "#fff",
          }}
            className="avatar-overlay"
            onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "0"}
          >
            <Camera size={22} />
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
        </div>
        <div className={style.hero_info}>
          <h1>{profile.name}</h1>
          <div className={style.email}>{profile.email}</div>
          <div className={style.tags}>
            <span className={`${style.tag} ${style.role}`}><span className={style.dot}></span> {profile.role}</span>
            <span className={`${style.tag} ${style.status}`}><span className={style.dot} style={{ background: statusDot }}></span> {profile.status}</span>
            {profile.profession_name && (
                <span className={`${style.tag} ${style.prof}`}>🎨 {profile.profession_name}</span>
            )}
          </div>
        </div>
        <div className={style.hero_meta}>
          <div className={style.meta_item}>
            <strong>{daysActive}</strong>
            days active
          </div>
          <div className={style.meta_item} style={{marginTop:"8px", fontSize:".7rem"}}>
            {joinedDate && `Joined ${joinedDate}`}
          </div>
        </div>
      </div>
    )
}
export default ProfileHeader