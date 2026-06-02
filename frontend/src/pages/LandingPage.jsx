import CommunityVoices from "../components/landing/CommunityVoices";
import Features from "../components/landing/Features";
import LandingHome from "../components/landing/LandingHome";
import Marquee from "../components/landing/Marquee";
import TopAI from "../components/landing/TopAI";
import WhyPenguin from "../components/landing/WhyPenguin";
import { useOutletContext } from "react-router-dom";

export default function LandingPage() {
    const { refs } = useOutletContext();
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
