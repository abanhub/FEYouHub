import { useEffect, useState } from "react";

const SESSION_KEY = "warning-modal-shown";

const WarningModal = () => {
  const [open, setOpen] = useState(false);
  // All content below is rebuilt in React + Tailwind (no raw HTML injection).

  useEffect(() => {
    const shown = sessionStorage.getItem(SESSION_KEY) === "1";
    if (!shown) setOpen(true);
  }, []);

  const close = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={close} />
      <div className="relative max-w-2xl w-[92vw] bg-black border border-zinc-700 rounded-md shadow-xl p-6 text-white">
        <div className="flex flex-col items-center text-center gap-3">
          <img
            className="h-8"
            src="https://ei.phncdn.com/www-static/images/pornhub_logo_straight.svg"
            alt="Logo"
          />
          <h3 className="text-xl font-extrabold">This is an adult website</h3>
          <p className="text-zinc-300 text-sm leading-relaxed">
            This website contains age‑restricted materials. By entering, you affirm that you are at least 18 years of age
            or the age of majority in your jurisdiction and you consent to viewing explicit content.
          </p>
          <p className="text-zinc-400 text-xs">
            Our Terms may change. See the
            <a className="text-brand-orange underline ml-1" href="https://www.pornhub.com/information/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>.
          </p>
        </div>
        <div className="mt-5 flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={close}
            className="px-4 h-10 rounded-md bg-brand-orange hover:bg-brand-orange-hover text-black font-semibold"
          >
            I am 18 or older — Enter
          </button>
          <a
            href="https://www.rtalabel.org/" target="_blank" rel="noopener noreferrer"
            className="px-4 h-10 rounded-md bg-zinc-900 border border-zinc-700 text-white hover:bg-zinc-800 inline-flex items-center justify-center"
          >
            Parental controls
          </a>
        </div>
        <div className="mt-6 flex items-center justify-center gap-3 text-zinc-500 text-xs">
          <span>© 2025</span>
          <img src="https://cdn1-smallimg.phncdn.com/n172nWs1UEcnquuObA5x52osw51230gH/rta-1.gif" alt="RTA" width={88} height={31} />
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
