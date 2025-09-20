import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import "./styles.css";

const sites = [
  { name: "YouPorn" },
  { name: "RedTube" },
  { name: "Tube8" },
  { name: "Thumbzilla" },
];

const languages = [
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "cn", label: "中文" },
];

const NetworkBar = () => {
  const [open, setOpen] = useState<"sites" | "lang" | null>(null);
  const { lang, setLang } = useLanguage();

  return (
    <div className="networkBar border-b border-zinc-800 bg-zinc-950 text-zinc-400 text-[11px]">
      <ul className="networkListContent max-w-7xl mx-auto px-4 h-8 flex items-center gap-5 uppercase tracking-wide">
        <li className="alpha"><a className="networkTab" href="https:sort.anbann.tech">Sort Algorithm</a></li>
        <li><a className="networkTab" href="">YouHub</a></li>
        <li><a className="networkTab" href="#"></a></li>
        <li><a className="networkTab" href="#">Coming soon hehee..</a></li>

        <li
          className="dropdownTrigger sitesDropdown"
          onMouseEnter={() => setOpen("sites")}
          onMouseLeave={() => setOpen(null)}
        >
          <span className="networkTab">Sites</span>
          <ul className={`dropdown ${open === "sites" ? "" : "hide"}`}>
            {sites.map((s, i) => (
              <li key={s.name} className={i === 0 ? "alpha" : i === sites.length - 1 ? "omega" : undefined}>
                <a className="networkTab" href="#">{s.name}</a>
              </li>
            ))}
          </ul>


        </li>
      </ul>
    </div>
  );
};

export default NetworkBar;

