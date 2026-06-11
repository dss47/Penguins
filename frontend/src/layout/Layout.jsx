import { Outlet, useLocation } from "react-router-dom";
import { useRef } from "react";
import Menu from "./Menu";

const Layout = () => {
    const location = useLocation();
    const isLanding = location.pathname === "/";
    // 1. Create a ref for each section you want to scroll to
    const featuresRef = useRef(null);
    const whyPenguinRef = useRef(null);
    const topAiRef = useRef(null);
    const landingHomeRef = useRef(null);
    const communityVoicesRef = useRef(null);

    const sectionRefs = { featuresRef, whyPenguinRef, topAiRef ,landingHomeRef ,communityVoicesRef};
    const scrollToSection = (elementRef) => {
        if (elementRef && elementRef.current) {
            elementRef.current.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    };

    return (
        <div>
            <Menu 
                className="layout-wrapper" 
                scrollToSection={scrollToSection} 
                refs={sectionRefs} 
            />
            
            <main style={{ paddingTop: isLanding ? "80px" : "0" }}>
                <Outlet context={{ refs: sectionRefs }} />
            </main>
        </div>
    )
}
export default Layout;