import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSnowflake } from '@fortawesome/free-regular-svg-icons'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import style from "../../style/Validations/ToolbarFilter.module.css"

function Toolbar() {
  return (
    <div className={style.toolbar}>
      <div className={style.toolbarFilterBar}>
        <input className={style.toolbarSearch} type="text" placeholder="Rechercher un outil, un auteur…" />
        <button className={`${style.toolbarBtn} ${style.toolbarBtnActive}`}>
          <FontAwesomeIcon icon={faSnowflake} /> Tous
        </button>
        <button className={`${style.toolbarBtn} ${style.toolbarBtnActive}`}>
          <FontAwesomeIcon icon={faClock} /> En attente
        </button>
        <button className={`${style.toolbarBtn} ${style.toolbarBtnActive}`}>
          <FontAwesomeIcon icon={faCircleCheck} /> Acceptés
        </button>
        <button className={`${style.toolbarBtn} ${style.toolbarBtnActive}`}>
          <FontAwesomeIcon icon={faCircleXmark} /> Rejetés
        </button>
      </div>

      <div className={style.toolbarSort}>
        <select className={style.toolbarSelect}>
          <option>A → Z</option>
          <option>Plus récent</option>
          <option>Plus ancien</option>
        </select>
      </div>
    </div>
  );
}

export default Toolbar;