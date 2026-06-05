import style from "../style/Pages/Profile.module.css"
import AccountDetails from "../components/profile/AccountDetails"
import Favorites from "../components/profile/Favorites"
import Insights from "../components/profile/Insights"
import ProfileHeader from "../components/profile/ProfileHeader"
import Reviews from "../components/profile/Reviews"
import SearchHistory from "../components/profile/SearchHistory"
import Shelves from "../components/profile/Shelves"
import Suggestions from "../components/profile/Suggestions"

const Profile = () =>{
    const userId = "123"; // Hardcoded userId
    return(
        <div className={style.shell}>
            <ProfileHeader userId={userId} />
            <Insights userId={userId} />
            <div className={style.grid}>
                <Reviews userId={userId} />
                <Favorites userId={userId} />
                <Shelves userId={userId} />
                <SearchHistory userId={userId} />
                <Suggestions userId={userId} />
                <AccountDetails userId={userId} />
            </div>
        </div>
    )
}
export default Profile