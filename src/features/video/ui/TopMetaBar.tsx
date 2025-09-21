const itemsLeft = ["SPICEVIDS", "FANCENTRO", "SEXUAL WELLNESS", "INSIGHTS", "SITES", "SHOP", "TRUST & SAFETY"];
const itemsRight = ["EN"];

const TopMetaBar = () => {
  return (
    <div className="w-full bg-zinc-950 text-zinc-400 text-[11px] border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 h-8 flex items-center justify-between">
        <div className="flex gap-4">
          {itemsLeft.map((t) => (
            <a key={t} href="#" className="uppercase tracking-wide hover:text-white/90">
              {t}
            </a>
          ))}
        </div>
        <div className="flex gap-4">
          {itemsRight.map((t) => (
            <a key={t} href="#" className="uppercase tracking-wide hover:text-white/90">
              {t}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopMetaBar;

