import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinux } from "@fortawesome/free-brands-svg-icons";
import style from "../../style/ProposerOutils/ProposerOutils.module.css";

function Header(){
return(

<>
<div className={style["page-header"]}>
  
<h1 className=""><span className="logo"><FontAwesomeIcon icon={faLinux} /></span> Proposer un outil <span className="ia">IA</span> </h1>
      
</div>


</>


)
}
export default Header