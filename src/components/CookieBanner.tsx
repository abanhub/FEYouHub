import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "cookies-consent";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    setVisible(saved !== "accepted");
  }, []);

  if (!visible) return null;

  return (
    <div id="cookieBanner" className="fixed bottom-4 left-1/2 -translate-x-1/2 max-w-xl w-[92vw] bg-black/85 border border-zinc-700 rounded-md shadow-xl p-4 z-50">
      <p className="text-sm text-zinc-300 mb-3">
        This site uses cookies to help improve your user experience. Learn more about how we use cookies in our <a className="text-brand-orange underline" href="#">Cookie Notice</a>.
      </p>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" className="bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-700" onClick={() => setVisible(false)}>Customize Cookies</Button>
        <Button className="bg-brand-orange hover:bg-brand-orange-hover text-black" onClick={() => { localStorage.setItem(STORAGE_KEY, "accepted"); setVisible(false); }}>Ok</Button>
      </div>
    </div>
  );
};

export default CookieBanner;
