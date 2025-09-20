import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import "./styles.css";
import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
  const [openContact, setOpenContact] = useState(false);
  const { t } = useLanguage();

  return (
    <footer className="ph-footer bg-black border-t border-zinc-800 mt-10">
      {/* Contact Us strip */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-white text-lg font-bold">{t("footer.contact_us")}</h3>
          <p className="text-zinc-400 text-sm">{t("footer.contact_prompt")}</p>
        </div>
        <div className="flex gap-3">
          <Button
            data-trending-sentinel
            className="bg-brand-orange hover:bg-brand-orange-hover text-black"
            onClick={() => setOpenContact((v) => !v)}
          >
            {openContact ? "Close" : t("footer.open_form")}
          </Button>
          <a href="mailto:support@hornhub.local" className="inline-flex items-center">
            <Button variant="secondary" className="bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800">{t("footer.email_us")}</Button>
          </a>
        </div>
      </div>

      {openContact && (
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <div className="ph-footer-contact grid grid-cols-1 md:grid-cols-3 gap-4 bg-zinc-950 border border-zinc-800 rounded-md p-4">
            <Input placeholder="Your name" className="bg-zinc-900 border-zinc-700 text-white" />
            <Input type="email" placeholder="Email address" className="bg-zinc-900 border-zinc-700 text-white" />
            <Input placeholder="Subject" className="bg-zinc-900 border-zinc-700 text-white" />
            <div className="md:col-span-3">
              <Textarea placeholder="Message" className="bg-zinc-900 border-zinc-700 text-white min-h-[120px]" />
            </div>
            <div className="md:col-span-3 flex justify-end">
              <Button className="bg-brand-orange hover:bg-brand-orange-hover text-black">Send</Button>
            </div>
          </div>
        </div>
      )}

      {/* Links columns */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-sm">
        <div>
          <h4 className="ph-footer-title">{t("footer.about")}</h4>
          <ul className="ph-footer-links">
            <li><a href="#">{t("footer.company")}</a></li>
            <li><a href="#">{t("footer.careers")}</a></li>
            <li><a href="#">{t("footer.blog")}</a></li>
            <li><a href="#">{t("footer.press")}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="ph-footer-title">{t("footer.discover")}</h4>
          <ul className="ph-footer-links">
            <li><a href="#">{t("header.home")}</a></li>
            <li><a href="#">{t("header.subscriptions")}</a></li>
            <li><a href="#">{t("header.playlists")}</a></li>
            <li><a href="#">{t("header.your_videos")}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="ph-footer-title">{t("footer.support")}</h4>
          <ul className="ph-footer-links">
            <li><a href="#">{t("footer.help_center")}</a></li>
            <li><a href="#">{t("footer.contact")}</a></li>
            <li><a href="#">{t("footer.safety")}</a></li>
            <li><a href="#">{t("footer.accessibility")}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="ph-footer-title">{t("footer.legal")}</h4>
          <ul className="ph-footer-links">
            <li><a href="#">{t("footer.terms")}</a></li>
            <li><a href="#">{t("footer.privacy")}</a></li>
            <li><a href="#">{t("footer.dmca")}</a></li>
            <li><a href="#">{t("footer.cookie_notice")}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="ph-footer-title">{t("footer.more")}</h4>
          <ul className="ph-footer-links">
            <li><a href="#">{t("footer.advertising")}</a></li>
            <li><a href="#">{t("footer.api")}</a></li>
            <li><a href="#">{t("footer.partners")}</a></li>
            <li><a href="#">{t("footer.sitemap")}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="ph-footer-title">{t("footer.language")}</h4>
          <ul className="ph-footer-links">
            <li><a href="#">English</a></li>
            <li><a href="#">Deutsch</a></li>
            <li><a href="#">Français</a></li>
            <li><a href="#">Español</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom note */}
      <div className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-6 text-xs text-zinc-400 leading-relaxed">
          <p>
            © {new Date().getFullYear()} Hornhub. All rights reserved. This interface is a look‑alike UI for demonstration purposes and contains no adult content.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
