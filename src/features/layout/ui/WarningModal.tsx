import { useEffect, useState } from "react";

const SESSION_KEY = "warning-modal-shown";

const WarningModal = () => {
  const [open, setOpen] = useState(false);

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
      <div className="relative w-[92vw] max-w-2xl rounded-md border border-zinc-700 bg-black p-6 text-white shadow-xl">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="logoWrapper flex items-center">
            <img title="YouHub" alt="YouHub logo" width="150" height="26" src="/logo.svg" />
          </div>
          <h3 className="text-xl font-extrabold">This is a 6+ website</h3>
          <p className="text-sm leading-relaxed text-zinc-300">
            This website contains age-restricted materials. By entering, you affirm that you are at least 6 years of age or the
            age of majority in your jurisdiction and you consent to viewing explicit content.
          </p>
          <p className="text-xs text-zinc-400">
            Our Terms may change. See the
            <a className="ml-1 text-brand-orange underline" href="" target="_blank" rel="noopener noreferrer">
              Terms of Service
            </a>
            .
          </p>
        </div>
        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={close}
            className="h-10 px-4 rounded-md bg-brand-orange text-black font-semibold hover:bg-brand-orange-hover"
          >
            I am 6 or older — Enter
          </button>
          <a
            href="https://www.rtalabel.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 px-4 text-white hover:bg-zinc-800"
          >
            Parental controls
          </a>
        </div>
        <div className="mt-6 flex items-center justify-center gap-3 text-xs text-zinc-500">
          <span>AC 2025</span>
          <img src="https://cdn1-smallimg.phncdn.com/n172nWs1UEcnquuObA5x52osw51230gH/rta-1.gif" alt="RTA" width={88} height={31} />
        </div>
      </div>
    </div>
  );
};

export default WarningModal;

