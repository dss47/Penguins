import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSnowflake } from '@fortawesome/free-regular-svg-icons'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import style from "../../style/Validations/ToolbarFilter.module.css"

function Toolbar({ searchQuery, setSearchQuery, filterStatus, setFilterStatus, sortOption, setSortOption }) {
  return (
    <div className={style.toolbar}>
      <div className={style.toolbarFilterBar}>
        <input 
          className={style.toolbarSearch} 
          type="text" 
          placeholder="Rechercher un outil, un auteur…" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button 
          className={`${style.toolbarBtn} ${filterStatus === 'tous' ? style.toolbarBtnActive : ''}`}
          onClick={() => setFilterStatus('tous')}
        >
          <FontAwesomeIcon icon={faSnowflake} /> Tous
        </button>
        <button 
          className={`${style.toolbarBtn} ${filterStatus === 'attente' ? style.toolbarBtnActive : ''}`}
          onClick={() => setFilterStatus('attente')}
        >
          <FontAwesomeIcon icon={faClock} /> En attente
        </button>
        <button 
          className={`${style.toolbarBtn} ${filterStatus === 'accepte' ? style.toolbarBtnActive : ''}`}
          onClick={() => setFilterStatus('accepte')}
        >
          <FontAwesomeIcon icon={faCircleCheck} /> Acceptés
        </button>
        <button 
          className={`${style.toolbarBtn} ${filterStatus === 'rejete' ? style.toolbarBtnActive : ''}`}
          onClick={() => setFilterStatus('rejete')}
        >
          <FontAwesomeIcon icon={faCircleXmark} /> Rejetés
        </button>
      </div>

      <div className={style.toolbarSort}>
        <select 
          className={style.toolbarSelect}
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option>A → Z</option>
          <option>Plus récent</option>
          <option>Plus ancien</option>
        </select>
      </div>
    </div>
  );
}

export default Toolbar;