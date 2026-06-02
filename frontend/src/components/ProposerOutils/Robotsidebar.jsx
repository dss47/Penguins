import { useState, useEffect } from "react";
import style from "../../style/ProposerOutils/Robotsidebar.module.css";

const messages = [
  "Hey ! 👋",
  "Partagez un outil génial avec tout le monde !",
  "La communauté vous remerciera 🚀",
  "Remplissez le formulaire avec soin ✨",
];

export default function RobotSidebar() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setMsgIndex((i) => (i + 1) % messages.length);
        setVisible(true);
      }, 400);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="robot-sidebar">

      {/* Bulle message */}
      <div className={`robot-bubble ${visible ? "bubble-in" : "bubble-out"}`}>
        {messages[msgIndex]}
      </div>

      {/* Robot SVG animé */}
      <div className="robot-float-wrapper">
        <div className="robot-float">
          <svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg" className="robot-svg">

            {/* Antenne */}
            <line x1="100" y1="20" x2="100" y2="40" stroke="#7c6bff" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="100" cy="15" r="6" fill="#7c6bff" className="antenna-pulse"/>

            {/* Tête */}
            <rect x="55" y="40" width="90" height="75" rx="20" fill="#1a2140" stroke="#7c6bff" strokeWidth="2"/>

            {/* Yeux */}
            <circle cx="80"  cy="68" r="12" fill="#0f1629"/>
            <circle cx="120" cy="68" r="12" fill="#0f1629"/>
            <circle cx="80"  cy="68" r="7" fill="#7c6bff" className="eye-blink"/>
            <circle cx="120" cy="68" r="7" fill="#7c6bff" className="eye-blink"/>
            <circle cx="82"  cy="66" r="2.5" fill="white"/>
            <circle cx="122" cy="66" r="2.5" fill="white"/>

            {/* Bouche */}
            <path d="M 82 88 Q 100 100 118 88" stroke="#7c6bff" strokeWidth="2.5" fill="none" strokeLinecap="round"/>

            {/* Cou */}
            <rect x="90" y="115" width="20" height="12" rx="4" fill="#1a2140" stroke="#7c6bff" strokeWidth="1.5"/>

            {/* Corps */}
            <rect x="45" y="127" width="110" height="85" rx="18" fill="#1a2140" stroke="#7c6bff" strokeWidth="2"/>

            {/* Panneau */}
            <rect x="65" y="143" width="70" height="45" rx="10" fill="#0f1629" stroke="rgba(124,107,255,0.3)" strokeWidth="1"/>

            {/* Lumières */}
            <circle cx="82"  cy="158" r="5" fill="#22c55e" className="light-blink"/>
            <circle cx="100" cy="158" r="5" fill="#7c6bff"/>
            <circle cx="118" cy="158" r="5" fill="#f59e0b" className="light-blink-slow"/>

            {/* Barre progression */}
            <rect x="75" y="172" width="50" height="6" rx="3" fill="#0a0f20"/>
            <rect x="75" y="172" width="35" height="6" rx="3" fill="#7c6bff" className="bar-animate"/>

            {/* Bras gauche */}
            <g className="arm-left" style={{transformOrigin: "29px 135px"}}>
              <rect x="18" y="130" width="22" height="60" rx="11" fill="#1a2140" stroke="#7c6bff" strokeWidth="2"/>
              <circle cx="29" cy="196" r="10" fill="#1a2140" stroke="#7c6bff" strokeWidth="2"/>
            </g>

            {/* Bras droit */}
            <g className="arm-right" style={{transformOrigin: "171px 135px"}}>
              <rect x="160" y="130" width="22" height="60" rx="11" fill="#1a2140" stroke="#7c6bff" strokeWidth="2"/>
              <circle cx="171" cy="196" r="10" fill="#1a2140" stroke="#7c6bff" strokeWidth="2"/>
            </g>

            {/* Jambes */}
            <rect x="68"  y="210" width="28" height="40" rx="12" fill="#1a2140" stroke="#7c6bff" strokeWidth="2"/>
            <rect x="104" y="210" width="28" height="40" rx="12" fill="#1a2140" stroke="#7c6bff" strokeWidth="2"/>

            {/* Pieds */}
            <rect x="62"  y="242" width="38" height="16" rx="8" fill="#1a2140" stroke="#7c6bff" strokeWidth="2"/>
            <rect x="100" y="242" width="38" height="16" rx="8" fill="#1a2140" stroke="#7c6bff" strokeWidth="2"/>

          </svg>
        </div>
        <div className="robot-shadow"/>
      </div>

      {/* Particules */}
      <div className="particles">
        {[1,2,3,4,5,6].map((n) => (
          <span key={n} className={`particle particle-${n}`}/>
        ))}
      </div>

    </div>
  );
}