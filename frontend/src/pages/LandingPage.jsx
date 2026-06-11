import { useEffect } from "react";
import CommunityVoices from "../components/landing/CommunityVoices";
import Features from "../components/landing/Features";
import LandingHome from "../components/landing/LandingHome";
import Marquee from "../components/landing/Marquee";
import TopAI from "../components/landing/TopAI";
import WhyPenguin from "../components/landing/WhyPenguin";
import { useOutletContext, useLocation } from "react-router-dom";

export default function LandingPage() {
    const { refs } = useOutletContext();
    const location = useLocation();

    useEffect(() => {
        const section = location.state?.scrollTo;
        if (!section) return;
        const map = {
            features: refs.featuresRef,
            whyPenguin: refs.whyPenguinRef,
            topAi: refs.topAiRef,
            community: refs.communityVoicesRef,
        };
        setTimeout(() => {
            map[section]?.current?.scrollIntoView({ behavior: "smooth" });
        }, 150);
    }, [location.state?.scrollTo]);

    return (
        <>

        <LandingHome scrollRef={refs.landingHomeRef}/>
        <Marquee/>
        <Features scrollRef={refs.featuresRef} />
        <WhyPenguin scrollRef={refs.whyPenguinRef} />
        <CommunityVoices scrollRef={refs.communityVoicesRef}/>
        <TopAI scrollRef={refs.topAiRef} />
        </>
    );
}
