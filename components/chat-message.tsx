"use client";

import {
  grayscaleToRgb,
  rgbToString,
  getAccessibleTextColor,
  getGrayscaleLabel,
  contrastRatio,
} from "@/lib/color-utils";

interface ChatMessageProps {
  type: "user" | "bot";
  content: string;
  grayscaleValue?: number;
}

export function ChatMessage({ type, content, grayscaleValue }: ChatMessageProps) {
  if (type === "user") {
    return (
      <div className="flex justify-end" role="listitem">
        <div className="max-w-xs rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-primary-foreground sm:max-w-sm">
          <p className="text-sm leading-relaxed">{content}</p>
        </div>
      </div>
    );
  }

  // Bot message with grayscale coloring
  const value = grayscaleValue ?? 0;
  const bgRgb = grayscaleToRgb(value);
  const bgColor = rgbToString(bgRgb);
  const textColor = getAccessibleTextColor(bgRgb);
  const label = getGrayscaleLabel(value);

  // Calculate actual contrast ratio for display
  const textRgb = textColor === "rgb(0, 0, 0)" ? { r: 0, g: 0, b: 0 } : { r: 255, g: 255, b: 255 };
  const ratio = contrastRatio(bgRgb, textRgb);

  // Determine border color for when the bubble is close to the page background
  const needsBorder = value <= 10;
  const borderStyle = needsBorder ? "1px solid rgb(200, 200, 200)" : "none";

  return (
    <div className="flex justify-start" role="listitem">
      <div
        className="max-w-xs rounded-2xl rounded-bl-sm px-4 py-2.5 sm:max-w-sm"
        style={{
          backgroundColor: bgColor,
          color: textColor,
          border: borderStyle,
        }}
        aria-label={`Acknowledgment: shade is ${label} (${value}% darkness). Contrast ratio: ${ratio.toFixed(1)}:1`}
      >
        <p className="text-sm font-medium leading-relaxed">
          {"Received: "}{content}
        </p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="text-xs opacity-80">
            {label} ({value}%)
          </span>
          <span className="text-xs opacity-60" aria-hidden="true">
            {ratio.toFixed(1)}:1
          </span>
        </div>
      </div>
    </div>
  );
}
