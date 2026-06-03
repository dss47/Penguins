import { useState } from "react";
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
    { id: 8, nom: 'SmartSEO', url: 'smartseo.com', categorie: 'Marketing', soumis: 'Ali C.', date: '1 mai 2025', statut: 'attente', couleur: '#1a5fa8' },
    { id: 9, nom: 'CodeWizard', url: 'codewizard.app', categorie: 'Développement', soumis: 'Hassan N.', date: '30 avr 2025', statut: 'accepte', couleur: '#6c3fd4' },
    { id: 10, nom: 'Visionary', url: 'visionary.ai', categorie: 'Image & Design', soumis: 'Salma G.', date: '28 avr 2025', statut: 'rejete', couleur: '#a85e1a' },
    { id: 11, nom: 'DataCrunch', url: 'datacrunch.io', categorie: 'Analyse de données', soumis: 'Tarik O.', date: '25 avr 2025', statut: 'attente', couleur: '#1a7a4a' },
    { id: 12, nom: 'WriteGenius', url: 'writgenius.com', categorie: 'Génération contenu', soumis: 'Fatima Z.', date: '22 avr 2025', statut: 'accepte', couleur: '#6c3fd4' },
    { id: 13, nom: 'SoundScape', url: 'soundscape.net', categorie: 'Audio & Voix', soumis: 'Mounir M.', date: '20 avr 2025', statut: 'attente', couleur: '#1a5fa8' },
    { id: 14, nom: 'LogicBot', url: 'logicbot.ai', categorie: 'Chatbots & NLP', soumis: 'Lina E.', date: '18 avr 2025', statut: 'modifications', couleur: '#1a7a4a' },
    { id: 15, nom: 'WorkflowMax', url: 'workflowmax.io', categorie: 'Automatisation', soumis: 'Samir B.', date: '15 avr 2025', statut: 'accepte', couleur: '#a81a1a' },
    { id: 16, nom: 'EcoBot', url: 'ecobot.green', categorie: 'Environnement', soumis: 'Yassir B.', date: '12 avr 2025', statut: 'attente', couleur: '#1a7a4a' },
    { id: 17, nom: 'FinancePro', url: 'financepro.com', categorie: 'Finance', soumis: 'Nadia K.', date: '10 avr 2025', statut: 'accepte', couleur: '#a85e1a' },
    { id: 18, nom: 'HealthAI', url: 'healthai.org', categorie: 'Santé', soumis: 'Omar L.', date: '8 avr 2025', statut: 'rejete', couleur: '#a81a1a' },
    { id: 19, nom: 'EduLearn', url: 'edulearn.edu', categorie: 'Education', soumis: 'Ines T.', date: '5 avr 2025', statut: 'attente', couleur: '#1a5fa8' }
  ];
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const totalPages = Math.ceil(outils.length / itemsPerPage);
  
  const currentData = outils.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
            {currentData.map(outil => (
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
        
        {totalPages > 1 && (
          <div className={style.paginationContainer}>
            <button 
              className={style.pageBtn} 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Précédent
            </button>
            <span className={style.pageInfo}>
              Page {currentPage} sur {totalPages}
            </span>
            <button 
              className={style.pageBtn} 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Main;