import { ImgHTMLAttributes } from "react";

import { useSafeMode } from "@/shared/lib/contexts/SafeModeContext";

type Props = ImgHTMLAttributes<HTMLImageElement> & { pixelate?: boolean };

const SafeImage = ({ pixelate = true, className = "", ...imgProps }: Props) => {
  const { safeMode } = useSafeMode();
  const { src, ...rest } = imgProps;
  const pixelatedSrc = typeof src === "string" ? src : undefined;

  return (
    <div className={`relative h-full w-full ${className}`}>
      <img {...rest} src={src} className={`h-full w-full object-cover ${safeMode ? "blur-[18px]" : ""}`} />
      {safeMode && (
        <div className="pointer-events-none absolute inset-0">
          {pixelate && (
            <div
              className="h-full w-full opacity-40"
              style={{
                imageRendering: "pixelated",
                backgroundImage: pixelatedSrc ? `url(${pixelatedSrc})` : undefined,
                backgroundSize: "12px 12px",
              }}
            />
          )}
          <div className="absolute bottom-2 left-2 rounded bg-black/80 px-2 py-1 text-[10px] font-semibold tracking-wide text-white">
            SAFE MODE
          </div>
          <div className="absolute -left-10 top-6 rotate-[-20deg] bg-brand-orange px-3 py-1 text-xs font-bold text-black">
            CENSORED
          </div>
        </div>
      )}
    </div>
  );
};

export default SafeImage;

