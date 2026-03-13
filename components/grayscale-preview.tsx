"use client";

import { grayscaleToRgb, rgbToString, getAccessibleTextColor } from "@/lib/color-utils";

export function GrayscalePreview() {
  const stops = [0, 25, 50, 75, 100];

  return (
    <div className="flex items-center justify-center gap-1 px-4 py-2" aria-hidden="true">
      {stops.map((val) => {
        const bg = grayscaleToRgb(val);
        const bgStr = rgbToString(bg);
        const textStr = getAccessibleTextColor(bg);
        const needsBorder = val <= 10;
        return (
          <div
            key={val}
            className="flex h-7 w-10 items-center justify-center rounded text-[10px] font-medium"
            style={{
              backgroundColor: bgStr,
              color: textStr,
              border: needsBorder ? "1px solid rgb(200, 200, 200)" : "none",
            }}
          >
            {val}
          </div>
        );
      })}
    </div>
  );
}
