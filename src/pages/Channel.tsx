import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import NetworkBar from "@/features/layout/ui/NetworkBar";
import WarningModal from "@/features/layout/ui/WarningModal";
import LegacyHeader from "@/features/layout/ui/Header";
import GlobalCookieBanner from "@/features/layout/ui/GlobalCookieBanner";
import Footer from "@/features/layout/ui/Footer";

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
