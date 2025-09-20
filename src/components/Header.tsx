import { Search, Menu, Upload, Heart, User, Video, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import "./styles.css";
import { useLanguage } from "@/context/LanguageContext";
import { useSafeMode } from "@/context/SafeModeContext";
import Switch from "@/components/ui/switch";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

// Refactored header with language support
const LegacyHeader = () => {
  const { t, lang, setLang } = useLanguage();
  const { safeMode, setSafeMode } = useSafeMode();
  const [langOpen, setLangOpen] = useState(false);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [query, setQuery] = useState<string>(params.get("q") || "");

  const doSearch = () => {
    const q = query.trim();
    if (!q) {
      navigate("/search");
      return;
    }
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };
  return (
    <header id="header" className="bg-black border-b border-gray-800">
      <div id="headerWrapper" className="max-w-7xl mx-auto px-4">
        {/* Row 1: logo + search + actions */}
        <div id="headerContainer" className="h-14 flex items-center justify-between">
          {/* Left: menu + logo */}
          <div className="flex items-center gap-3">
            <button aria-label="Desktop Navigation" id="desktopNavigation" type="button" className="header-hamb-btn">
              <Menu className="h-6 w-6 text-white" />
            </button>

            <div className="logoWrapper flex items-center">
              <Link to="/">
               <img title="YouHub" alt="Nhìn cái chóa gì" width="150" height="26" src='../../../logo.svg'/>
              </Link>
            </div>
          </div>

          {/* Center: search pill */}
          <div className="hidden md:flex items-center flex-1 mx-6">
            <div className="ph-search flex items-center h-10 rounded-full bg-zinc-900 border border-zinc-700 w-full max-w-[680px] pl-4 pr-1">
              <Search className="h-4 w-4 text-zinc-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') doSearch(); }}
                placeholder={t("search.placeholder")}
                className="ml-2 flex-1 bg-transparent text-sm text-white placeholder-zinc-400 outline-none"
              />
              <button onClick={doSearch} className="ml-2 px-3 py-1.5 rounded-full bg-brand-orange text-black text-xs font-semibold">
                {t("search.go") || "Search"}
              </button>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-3">
            <Button size="sm" className="rounded-full px-4 h-9 bg-brand-orange hover:bg-brand-orange-hover text-black font-semibold hidden lg:inline-flex">GO PREMIUM</Button>

            <div className="relative hidden md:flex items-center gap-2 text-zinc-300">
              <div className="relative h-9 w-9 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center">
                <Video className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3.5 min-w-[14px] px-0.5 rounded-full bg-brand-orange text-[10px] text-black font-bold leading-3 text-center">0</span>
              </div>
              <div className="relative h-9 w-9 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center">
                <Camera className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3.5 min-w-[14px] px-0.5 rounded-full bg-brand-orange text-[10px] text-black font-bold leading-3 text-center">0</span>
              </div>
            </div>

            {/* Safe Mode toggle */}
            {/* <div className="hidden md:flex items-center gap-2 px-2 h-9 rounded-full bg-zinc-900 border border-zinc-700">
              <span className="text-[11px] uppercase tracking-wide text-zinc-400">Safe</span>
              <Switch checked={safeMode} onCheckedChange={setSafeMode} />
            </div> */}

            <div className="h-9 w-9 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-gray-300">
              <User className="h-5 w-5" />
            </div>
            {/* Language menu */}
            <div className="relative">
              <button className="px-3 h-9 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs uppercase tracking-wide" onClick={() => setLangOpen(v=>!v)}>
                {lang}
              </button>
              {langOpen && (
                <div className="lang-dropdown absolute right-0 mt-2 w-40 bg-black border border-zinc-700 rounded-md shadow-lg p-1 z-50">
                  {[
                    { code: "en", label: "English" },
                    { code: "vi", label: "Tiếng Việt" },
                    { code: "de", label: "Deutsch" },
                    { code: "fr", label: "Français" },
                    { code: "es", label: "Español" },
                    { code: "cn", label: "中文" },
                  ].map((l) => (
                    <button key={l.code} className={`w-full text-left px-2 py-1.5 rounded text-sm ${lang===l.code?"bg-zinc-800 text-white":"text-zinc-300 hover:bg-zinc-800"}`} onClick={()=>{setLang(l.code as any); setLangOpen(false);}}>
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: nav tabs (YouTube-like) */}
        <div className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wide h-10">
          <a className="ph-nav-link active" href="#">{t("header.home")}</a>
          <a className="ph-nav-link" href="#">{t("header.shorts")}</a>
          <a className="ph-nav-link" href="#">{t("header.subscriptions")}</a>
          <a className="ph-nav-link" href="#">{t("header.you")}</a>
          <a className="ph-nav-link" href="#">{t("header.history")}</a>
          <a className="ph-nav-link" href="#">{t("header.playlists")}</a>
          <a className="ph-nav-link" href="#">{t("header.your_videos")}</a>
          <a className="ph-nav-link" href="#">{t("header.watch_later")}</a>
          <a className="ph-nav-link" href="#">{t("header.liked_videos")}</a>
        </div>
      </div>
    </header>
  );
};

export default LegacyHeader;
