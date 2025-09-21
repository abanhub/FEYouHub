import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Search, Menu, Upload, Heart, User, Video, Camera } from "lucide-react";

import "../styles/layout.css";
import { useLanguage, type LangCode } from "@/shared/lib/contexts/LanguageContext";
import { useSafeMode } from "@/shared/lib/contexts/SafeModeContext";
import { Button } from "@/shared/ui/button";
import Switch from "@/shared/ui/switch";

const languages: Array<{ code: LangCode; label: string }> = [
  { code: "en", label: "English" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "cn", label: "中文" },
];

// Refactored header with language support
const LegacyHeader = () => {
  const { t, lang, setLang } = useLanguage();
  const { safeMode, setSafeMode } = useSafeMode();
  const [langOpen, setLangOpen] = useState(false);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [query, setQuery] = useState<string>(params.get("q") || "");

  const doSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) {
      navigate("/search");
      return;
    }
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <header id="header" className="bg-black border-b border-gray-800">
      <div id="headerWrapper" className="max-w-7xl mx-auto px-4">
        {/* Row 1: logo + search + actions */}
        <div id="headerContainer" className="h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button aria-label="Desktop Navigation" id="desktopNavigation" type="button" className="header-hamb-btn">
              <Menu className="h-6 w-6 text-white" />
            </button>

            <div className="logoWrapper flex items-center">
              <Link to="/">
                <img title="YouHub" alt="YouHub logo" width="150" height="26" src="/logo.svg" />
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center flex-1 mx-6">
            <div className="ph-search flex items-center h-10 rounded-full bg-zinc-900 border border-zinc-700 w-full max-w-[680px] pl-4 pr-1">
              <Search className="h-4 w-4 text-zinc-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") doSearch();
                }}
                placeholder={t("search.placeholder")}
                className="ml-2 flex-1 bg-transparent text-sm text-white placeholder-zinc-400 outline-none"
              />
              <button
                onClick={doSearch}
                className="ml-2 px-3 py-1.5 rounded-full bg-brand-orange text-black text-xs font-semibold"
              >
                {t("search.go") || "Search"}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              className="hidden h-9 rounded-full bg-brand-orange px-4 font-semibold text-black hover:bg-brand-orange-hover lg:inline-flex"
            >
              GO PREMIUM
            </Button>

            <div className="relative hidden items-center gap-2 text-zinc-300 md:flex">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900">
                <Video className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-brand-orange px-0.5 text-[10px] font-bold leading-3 text-black">
                  0
                </span>
              </div>
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900">
                <Camera className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-brand-orange px-0.5 text-[10px] font-bold leading-3 text-black">
                  0
                </span>
              </div>
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-2 text-zinc-400 md:flex">
              <span className="text-[11px] uppercase tracking-wide">Safe</span>
              <Switch checked={safeMode} onCheckedChange={setSafeMode} aria-label="Toggle safe mode" />
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-gray-300">
              <User className="h-5 w-5" />
            </div>

            {/* Language menu */}
            <div className="relative">
              <button
                className="h-9 rounded-full border border-zinc-700 bg-zinc-900 px-3 text-xs uppercase tracking-wide text-zinc-200"
                onClick={() => setLangOpen((value) => !value)}
                aria-haspopup="listbox"
                aria-expanded={langOpen}
              >
                {lang}
              </button>
              {langOpen && (
                <div className="lang-dropdown absolute right-0 mt-2 w-40 rounded-md border border-zinc-700 bg-black p-1 shadow-lg">
                  {languages.map((item) => (
                    <button
                      key={item.code}
                      className={`w-full rounded px-2 py-1.5 text-left text-sm ${
                        lang === item.code ? "bg-zinc-800 text-white" : "text-zinc-300 hover:bg-zinc-800"
                      }`}
                      onClick={() => {
                        setLang(item.code);
                        setLangOpen(false);
                      }}
                      type="button"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: nav tabs (YouTube-like) */}
        <div className="hidden h-10 items-center gap-6 text-xs uppercase tracking-wide md:flex">
          <a className="ph-nav-link active" href="#">
            {t("header.home")}
          </a>
          <a className="ph-nav-link" href="#">
            {t("header.shorts")}
          </a>
          <a className="ph-nav-link" href="#">
            {t("header.subscriptions")}
          </a>
          <a className="ph-nav-link" href="#">
            {t("header.you")}
          </a>
          <a className="ph-nav-link" href="#">
            {t("header.history")}
          </a>
          <a className="ph-nav-link" href="#">
            {t("header.playlists")}
          </a>
          <a className="ph-nav-link" href="#">
            {t("header.your_videos")}
          </a>
          <a className="ph-nav-link" href="#">
            {t("header.watch_later")}
          </a>
          <a className="ph-nav-link" href="#">
            {t("header.liked_videos")}
          </a>
        </div>
      </div>
    </header>
  );
};

export default LegacyHeader;

