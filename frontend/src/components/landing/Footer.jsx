import style from "../../style/landing/Footer.module.css"

export default function Footer({ scrollRef }) {
  return (
    <div ref={scrollRef} className={style.wrapper}>
      <footer className={style.inner}>
        <div className={style.grid}>
          <div className={style.brand}>
            <div className={style.logo}>
              <span className={style.logoIcon}>🐧</span>
              penguin
            </div>
            <p>
              L'annuaire intelligent d'outils IA propulsé par la communauté.
              Trouvez, comparez et partagez les meilleurs outils d'intelligence
              artificielle.
            </p>
            <div className={style.socialIcons}>
              <button className={style.socialBtn} aria-label="Twitter/X">𝕏</button>
              <button className={style.socialBtn} aria-label="GitHub">⌨</button>
              <button className={style.socialBtn} aria-label="Discord">💬</button>
              <button className={style.socialBtn} aria-label="LinkedIn">🔗</button>
            </div>
          </div>

          <div>
            <div className={style.colTitle}>Explorer</div>
            <ul className={style.colLinks}>
              <li>Outils IA</li>
              <li>Catégories</li>
              <li>Meilleures IA</li>
              <li>Bibliothèque</li>
            </ul>
          </div>

          <div>
            <div className={style.colTitle}>Communauté</div>
            <ul className={style.colLinks}>
              <li>Proposer un outil</li>
              <li>Avis et notes</li>
              <li>Discussions</li>
              <li>Blog</li>
            </ul>
          </div>

          <div>
            <div className={style.colTitle}>Contact</div>
            <ul className={style.colLinks}>
              <li>hello@penguin.ai</li>
              <li>Signalement</li>
              <li>Partenariat</li>
              <li>Assistance</li>
            </ul>
          </div>
        </div>

        <div className={style.divider}></div>

        <div className={style.bottom}>
          <span className={style.copyright}>
            &copy; {new Date().getFullYear()} Penguin. Tous droits réservés.
          </span>
          <div className={style.legal}>
            <a href="#">Confidentialité</a>
            <a href="#">CGU</a>
            <a href="#">Mentions légales</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
