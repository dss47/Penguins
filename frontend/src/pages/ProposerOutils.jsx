import styles from "../style/Pages/ProposerOutils.module.css"
import Header from "../components/ProposerOutils/header";
import Main from "../components/ProposerOutils/main";

function ProposerOutils() {
  return (
    <div className={styles.proposerPage}>
      <Header />
      <Main />
    </div>
  );
}
export default ProposerOutils;