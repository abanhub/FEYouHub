import { useEffect, useState } from "react";
import { X } from "lucide-react";
import "./styles.css";
import { useLanguage } from "@/context/LanguageContext";

const STORAGE_KEY = "cookies-consent";

const GlobalCookieBanner = () => {
  const [visible, setVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    setVisible(saved !== "accepted");
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div id="globalCookieBanner" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-3xl">
      <div className="globalCookieBanner">
        <div className="globalCookieBanner__wrapper">
          <i className="globalCookieBanner__icon bg-cookie" aria-hidden />
          <div className="globalCookieBanner__content">
            {t("cookies.text")}<a className="underline text-brand-orange" href="#">{t("footer.cookie_notice")}</a>.
            <button className="globalCookieBanner__close js-closeGlobalBanner" onClick={() => setVisible(false)} aria-label="Close banner">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="globalCookieBanner__buttons">
            <button className="buttonBase js-customizeGlobalCookies" onClick={() => setVisible(false)}>{t("cookies.customize")}</button>
            <button className="buttonBase js-acceptGlobalCookies" onClick={accept}>{t("cookies.ok")}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalCookieBanner;
