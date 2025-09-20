import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import NetworkBar from "@/components/NetworkBar";
import WarningModal from "@/components/WarningModal";
import LegacyHeader from "@/components/Header";
import GlobalCookieBanner from "@/components/GlobalCookieBanner";
import { Footer } from "react-day-picker";

const Channel = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-black">
         <NetworkBar />
      <LegacyHeader />
      <WarningModal />
      <div className="text-center">
        <h1 className="text-4xl text-brand-orange font-bold mb-4 ">404</h1>
        <p className="text-xl text-white-600 mb-4">Coming soon...</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>


    </div>
  );
};

export default Channel;
