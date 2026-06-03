import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeftLong, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import style from "../style/layout/Menu.module.css";

const Menu = ({ scrollToSection, refs }) => {
    const [activated, setActivated] = useState('landing');
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [theme, setTheme] = useState(
        localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
    );

    useEffect(() => {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            document.documentElement.classList.add('light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.documentElement.classList.remove('light');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const onMainActivated = () => setActivated('main');
    const onLandingActivated = () => setActivated('landing');
    
    const logOut = () => {
        setIsLoggedIn(false);
    };

    return (
        <nav className={style.navbar}>
            <div className={style.navContainer}>
                {activated === "landing" ? 
                <div className={style.logoSection} onClick={() => scrollToSection(refs.landingHomeRef)} style={{cursor: 'pointer'}}>
                    <div className={style.logoIcon}>🐧</div>
                        penguin
                </div>
                :
                <Link to='/MainPage' className={style.Link}>
                    <div className={style.logoSection} style={{cursor: 'pointer'}} >
                        <div className={style.logoIcon}>🐧</div>
                            penguin
                    </div>
                </Link>
            }

                <div className={style.sliderWrapper}>
                    <div className={`${style.sliderTrack} ${activated === 'main' ? style.slideMain : style.slideLanding}`}>
                        <div className={style.menuHalf}>
                            <ul className={style.navLinks}>
                                <li onClick={() => scrollToSection(refs.featuresRef)}>Caractéristiques</li>
                                <li>Comment ça marche</li>
                                <li onClick={() => scrollToSection(refs.whyPenguinRef)}>Pourquoi Penguin</li>
                                <li>Découvrir</li>
                                <li onClick={() => scrollToSection(refs.topAiRef)}>Meilleures IA</li>
                                <li>Tarifs</li>
                                <li onClick={() => scrollToSection(refs.communityVoicesRef)}>Communauté</li>
                                <li>contact</li>
                            </ul>
                            
                            <button onClick={onMainActivated} className={style.slideBtnRight}>
                                App <FontAwesomeIcon icon={faArrowRight} className={style.iconMargin} />
                            </button>
                        </div>
                        <div className={style.menuHalf}>
                                <Link to="/" className={style.Link}>
                                    <button onClick={onLandingActivated} className={style.slideBtnLeft}>
                                    <FontAwesomeIcon icon={faArrowLeftLong} className={style.iconMargin} /> Web
                            </button>
                                </Link>

                            <ul className={style.navLinksApp}>
                                <li><Link className={style.Link} to="/tools">Explorer</Link></li>
                                <li><Link className={style.Link} to="/Library">Bibliothèque</Link></li>
                                <li><Link className={style.Link} to="/ProposerOutils">Proposer un outil</Link></li>
                                <li><Link className={style.Link} to="/Profile">Profil</Link></li>
                            </ul>
                        </div>

                    </div>
                </div>
                <div className={style.authSection}>
                    <button onClick={toggleTheme} className={style.outlineBtn} style={{marginRight: '10px', padding: '0.5rem 0.8rem'}}>
                        <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
                    </button>
                    {isLoggedIn ? (
                        <>
                            <button onClick={logOut} className={style.outlineBtn}>Se déconnecter</button>
                        </>
                    ) : (
                        <>
                            <Link to="/Auth" className={style.textLink}>Se connecter</Link>
                            <Link to="/Auth" className={style.primaryBtn}>Commencez gratuitement</Link>
                        </>
                    )}
                </div>
                
            </div>
        </nav>
    );
};

export default Menu;