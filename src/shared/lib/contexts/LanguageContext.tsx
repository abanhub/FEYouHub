import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type LangCode = "en" | "vi" | "de" | "fr" | "es" | "cn";

type LanguageContextType = {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: (key: string) => string;
};

const STORAGE_KEY = "ui-lang";

type Dict = Record<string, any>;

const DICT: Record<LangCode, Dict> = {
  en: {
    header: {
      home: "Home",
      shorts: "Shorts",
      subscriptions: "Subscriptions",
      you: "You",
      history: "History",
      playlists: "Playlists",
      your_videos: "Your videos",
      watch_later: "Watch later",
      liked_videos: "Liked videos",
    },
    search: { placeholder: "Search YouHub" },
    hero: { title: "Trending videos", subtitle: "Fresh content for you" },
    cookies: {
      text: "This site uses cookies to help improve your user experience. Learn more about how we use cookies in our ",
      customize: "Customize Cookies",
      ok: "Ok",
      notice: "Cookie Notice",
    },
    footer: {
      contact_us: "Contact Us",
      contact_prompt: "Have feedback or found an issue? We’d love to hear from you.",
      open_form: "Open Form",
      email_us: "Email Us",
      about: "About",
      discover: "Discover",
      support: "Support",
      legal: "Legal",
      more: "More",
      language: "Language",
      company: "Company",
      careers: "Careers",
      blog: "Blog",
      press: "Press",
      creators: "Creators",
      live: "Live",
      help_center: "Help Center",
      contact: "Contact",
      safety: "Safety",
      accessibility: "Accessibility",
      terms: "Terms",
      privacy: "Privacy",
      dmca: "DMCA",
      cookie_notice: "Cookie Notice",
      advertising: "Advertising",
      api: "API",
      partners: "Partners",
      sitemap: "Sitemap",
    },
  },
  vi: {
    header: {
      home: "Trang chủ",
      shorts: "Shorts",
      subscriptions: "Kênh đăng ký",
      you: "Bạn",
      history: "Video đã xem",
      playlists: "Danh sách phát",
      your_videos: "Video của bạn",
      watch_later: "Xem sau",
      liked_videos: "Video đã thích",
    },
    search: { placeholder: "Tìm kiếm YouTube" },
    hero: { title: "Nội dung nổi bật", subtitle: "Gợi ý mới dành cho bạn" },
    cookies: {
      text: "Trang này sử dụng cookie để cải thiện trải nghiệm của bạn. Tìm hiểu thêm trong ",
      customize: "Tùy chỉnh cookie",
      ok: "Đồng ý",
      notice: "Thông báo Cookie",
    },
    footer: {
      contact_us: "Liên hệ",
      contact_prompt: "Bạn có gặp lỗi hay phát hiện vấn đề? Hãy cho chúng tôi biết.",
      open_form: "Mở biểu mẫu",
      email_us: "Gửi email",
      about: "Giới thiệu",
      discover: "Khám phá",
      support: "Hỗ trợ",
      legal: "Pháp lý",
      more: "Khác",
      language: "Ngôn ngữ",
      company: "Công ty",
      careers: "Tuyển dụng",
      blog: "Blog",
      press: "Báo chí",
      creators: "Người sáng tạo",
      live: "Trực tiếp",
      help_center: "Trung tâm trợ giúp",
      contact: "Liên hệ",
      safety: "An toàn",
      accessibility: "Trợ năng",
      terms: "Điều khoản",
      privacy: "Quyền riêng tư",
      dmca: "DMCA",
      cookie_notice: "Thông báo Cookie",
      advertising: "Quảng cáo",
      api: "API",
      partners: "Đối tác",
      sitemap: "Sơ đồ trang",
    },
  },
  de: {},
  fr: {},
  es: {},
  cn: {},
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<LangCode>(() => (localStorage.getItem(STORAGE_KEY) as LangCode) || "en");

  const setLang = useCallback((l: LangCode) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const t = useCallback(
    (key: string) => {
      const path = key.split(".");
      const get = (obj: any, ks: string[]) => ks.reduce((o, k) => (o && k in o ? o[k] : undefined), obj);
      const v = get(DICT[lang] as any, path) ?? get(DICT.en as any, path);
      return typeof v === "string" ? v : key;
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};

