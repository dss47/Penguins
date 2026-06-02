import LoginForm from "../components/forms/loginForm";
import SignupForm from "../components/forms/signupForm";
import styles from "../style/Pages/authpage.module.css"
import { useState } from "react";
// import signupRobot from "../assets/signuprobot.webp"
// import loginRobot from "../assets/loginrobot.webp"


const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleAuth = () => {
        setIsLogin(!isLogin);
    };

    return (
        <>
            <div className={styles.pageWrapper}>
                <div className={`${styles.authContainer} ${!isLogin ? "active" : ""}`}>
                    <SignupForm onSwitch={toggleAuth} />
                    <LoginForm onSwitch={toggleAuth} />

                    <div className={styles.toggleContainer}>
                        <div className={styles.toggle}>
                            <div className={`${styles.togglePanel} ${styles.toggleLeft}`}>
                                <div className={styles.signupBubble}>
                                    Salut, l'ami !
                                </div>
                                {/* <img src={signupRobot} className={styles.signupRobot} alt="Robot" /> */}
                            </div>
                            <div className={`${styles.togglePanel} ${styles.toggleRight}`}>
                                <div className={styles.loginBubble}>
                                    Bon retour !
                                </div>
                                {/* <img src={loginRobot} className={styles.loginRobot} alt="Robot" /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AuthPage