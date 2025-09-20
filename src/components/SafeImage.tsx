import { ImgHTMLAttributes } from "react";
import { useSafeMode } from "@/context/SafeModeContext";

type Props = ImgHTMLAttributes<HTMLImageElement> & { pixelate?: boolean };

const SafeImage = ({ pixelate = true, className = "", ...imgProps }: Props) => {
  const { safeMode } = useSafeMode();

  return (
    <div className={`relative w-full h-full ${className}`}>
      <img
        {...imgProps}
        className={`w-full h-full object-cover ${safeMode ? "blur-[18px]" : ""}`}
      />
      {safeMode && (
        <div className="absolute inset-0 pointer-events-none">
          {pixelate && (
            <div
              className="w-full h-full opacity-40"
              style={{
                imageRendering: "pixelated",
                backgroundImage: `url(${(imgProps as any).src})`,
                backgroundSize: "12px 12px",
              }}
            />
          )}
          <div className="absolute bottom-2 left-2 bg-black/80 text-white text-[10px] px-2 py-1 rounded font-semibold tracking-wide">
            SAFE MODE
          </div>
          <div className="absolute -left-10 top-6 rotate-[-20deg] bg-brand-orange text-black font-bold text-xs px-3 py-1">
            CENSORED
          </div>
        </div>
      )}
    </div>
  );
};

export default SafeImage;

