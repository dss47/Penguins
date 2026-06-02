import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faFolderOpen, 
  faClock, 
  faCircleCheck, 
  faCircleXmark 
} from "@fortawesome/free-solid-svg-icons";
import style from "../../style/Validations/insight.module.css";

function Insight() {
  return (
    <div className={style.insightContainer}>
      
      {/* Carte : Total Soumissions */}
      <div className={`${style.insightCard} ${style.cardTotal}`}>
        <span className={style.insightNumber}>24</span>
        <span className={style.insightLabel}>
          <FontAwesomeIcon icon={faFolderOpen} className={style.insightIcon} /> Total soumissions
        </span>
      </div>

      {/* Carte : En attente */}
      <div className={`${style.insightCard} ${style.cardPending}`}>
        <span className={style.insightNumber}>8</span>
        <span className={style.insightLabel}>
          <FontAwesomeIcon icon={faClock} className={style.insightIcon} /> En attente
        </span>
      </div>

      {/* Carte : Acceptés */}
      <div className={`${style.insightCard} ${style.cardAccepted}`}>
        <span className={style.insightNumber}>13</span>
        <span className={style.insightLabel}>
          <FontAwesomeIcon icon={faCircleCheck} className={style.insightIcon} /> Acceptées
        </span>
      </div>

      {/* Carte : Rejetés */}
      <div className={`${style.insightCard} ${style.cardRejected}`}>
        <span className={style.insightNumber}>3</span>
        <span className={style.insightLabel}>
          <FontAwesomeIcon icon={faCircleXmark} className={style.insightIcon} /> Rejetées
        </span>
      </div>

    </div>
  );
}

export default Insight;