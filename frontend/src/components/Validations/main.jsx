import style from "../../style/Validations/table.module.css"
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { faDeleteLeft } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { faClock } from '@fortawesome/free-regular-svg-icons'

function Main(){
  const outils = [
    { id: 1, nom: 'ScriptAI Pro', url: 'scriptai.pro', categorie: 'Génération contenu', soumis: 'Karim A.', date: '12 mai 2025', statut: 'attente', couleur: '#6c3fd4' },
    { id: 2, nom: 'DevAssist AI', url: 'devassist.io', categorie: 'Développement', soumis: 'Sara M.', date: '10 mai 2025', statut: 'attente', couleur: '#1a7a4a' },
    { id: 3, nom: 'PixelGen', url: 'pixelgen.app', categorie: 'Image & Design', soumis: 'Yassir B.', date: '9 mai 2025', statut: 'modifications', couleur: '#1a5fa8' },
    { id: 4, nom: 'DataMind', url: 'datamind.ai', categorie: 'Analyse de données', soumis: 'Nadia K.', date: '7 mai 2025', statut: 'accepte', couleur: '#a85e1a' },
    { id: 5, nom: 'ChatFlow Pro', url: 'chatflow.io', categorie: 'Chatbots & NLP', soumis: 'Omar L.', date: '5 mai 2025', statut: 'accepte', couleur: '#1a7a4a' },
    { id: 6, nom: 'AutoBot X', url: 'autobotx.net', categorie: 'Automatisation', soumis: 'Ines T.', date: '3 mai 2025', statut: 'rejete', couleur: '#a81a1a' },
    { id: 7, nom: 'VoiceClone AI', url: 'voiceclone.ai', categorie: 'Audio & Voix', soumis: 'Mehdi R.', date: "Aujourd'hui", statut: 'attente', couleur: '#1a5fa8' },
  ]
  
  const getStatutBadge = (statut) => {
    switch (statut) {
      case 'attente':      
        return <span className={`${style.badge} ${style.badgeAttente}`}><FontAwesomeIcon icon={faClock} /> En attente</span>
      case 'accepte':     
        return <span className={`${style.badge} ${style.badgeAccepte}`}><FontAwesomeIcon icon={faCheck} /> Acceptée</span>
      case 'rejete':      
        return <span className={`${style.badge} ${style.badgeRejete}`}><FontAwesomeIcon icon={faTrash} /> Rejetée</span>
      default:            
        return null
    }
  }

  const getActions = (statut) => {
    if (statut === 'accepte') return <span className={style.actionPublie}><FontAwesomeIcon icon={faCheck} /> Publié</span>
    if (statut === 'rejete')  return <span className={style.actionRejete}><FontAwesomeIcon icon={faXmark} /> Rejeté</span>
    return (
      <>
        <button className={style.btnAccepter}><FontAwesomeIcon icon={faCheck} /> Accepter</button>
        <button className={style.btnRejeter}><FontAwesomeIcon icon={faDeleteLeft} /></button>
      </>
    )
  }

  return(
    <>
      <div className={style.tableContainer}>
        <table className={style.tableOutils}>
          <thead>
            <tr>
              <th>Outil</th>
              <th>Catégorie</th>
              <th>Soumis par</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {outils.map(outil => (
              <tr key={outil.id}>
                <td>
                  <div className={style.outilInfo}>
                    <div className={style.outilLogo} style={{ background: outil.couleur }}>
                      {outil.nom[0]}
                    </div>
                    <div>
                      <div className={style.outilNom}>{outil.nom}</div>
                      <div className={style.outilUrl}>{outil.url}</div>
                    </div>
                  </div>
                </td>
                <td className={style.tdMuted}>{outil.categorie}</td>
                <td className={style.tdMuted}>{outil.soumis}</td>
                <td className={style.tdMuted}>{outil.date}</td>
                <td>{getStatutBadge(outil.statut)}</td>
                <td>
                  <div className={style.actions}>
                    <button className={style.btnVoir}><FontAwesomeIcon icon={faEye} /></button>
                    {getActions(outil.statut)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Main;