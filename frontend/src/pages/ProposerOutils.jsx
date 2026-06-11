import styles from "../style/Pages/ProposerOutils.module.css"
import Header from "../components/ProposerOutils/header";
import Main from "../components/ProposerOutils/main";
import { useAuth } from "../context/AuthContext";
import LoginPrompt from "../components/LoginPrompt";

function ProposerOutils() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <LoginPrompt />;

  return (
    <div className={styles.proposerPage}>
      <Header />
      <Main />
    </div>
  );
}
export default ProposerOutils;