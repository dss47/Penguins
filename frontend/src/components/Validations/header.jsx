

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import style from "../../style/Validations/insight.module.css";
function Header(){
return(
    <>
<div className={style.box_titre}>
<span>  </span>
<h2><FontAwesomeIcon icon={faBookmark} />  Soumissions     <span className={style.ia}>   d'outils IA </span></h2>
</div>

     </>


);
}
export default Header