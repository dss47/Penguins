import style from "../style/Pages/Profile.module.css"
import AccountDetails from "../components/profile/AccountDetails"
import Favorites from "../components/profile/Favorites"
import Insights from "../components/profile/Insights"
import ProfileHeader from "../components/profile/ProfileHeader"
import Reviews from "../components/profile/Reviews"
import SearchHistory from "../components/profile/SearchHistory"
import Shelves from "../components/profile/Shelves"
import Suggestions from "../components/profile/Suggestions"
import { useAuth } from "../context/AuthContext";
import LoginPrompt from "../components/LoginPrompt";

const Profile = () =>{
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <LoginPrompt />;

    return(
        <div className={style.shell}>
            <ProfileHeader />
            <Insights />
            <div className={style.grid}>
                <Reviews />
                <Favorites />
                <Shelves />
                <SearchHistory />
                <Suggestions />
                <AccountDetails />
            </div>
        </div>
    )
}
export default Profile