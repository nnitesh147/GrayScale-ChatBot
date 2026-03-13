/**
 * Extracts the last two digits of a number string and returns a value 0–100.
 * "00" → 0 (white), "50" → 50 (grey), "100" or "00" from 100 → 100 (black, via special handling).
 *
 * We treat the raw input as a 0-100 scale:
 *  - If the number itself is 0–100, we use it directly.
 *  - Otherwise, we take the last two digits (00–99) and scale them.
 */
export function extractGrayscaleValue(input: string): number {
  const cleaned = input.replace(/[^0-9]/g, "");
  if (cleaned === "") return 0;

  const num = parseInt(cleaned, 10);

  // If the number is in the 0-100 range, use it directly for the most intuitive UX
  if (num >= 0 && num <= 100) {
    return num;
  }

  // Otherwise, extract last two digits and map 00-99 to 0-99
  const lastTwo = cleaned.slice(-2);
  return parseInt(lastTwo, 10);
}

/**
 * Converts a 0-100 grayscale value to an RGB gray color.
 * 0 = white (255,255,255), 100 = black (0,0,0)
 */
export function grayscaleToRgb(value: number): { r: number; g: number; b: number } {
  const clamped = Math.max(0, Math.min(100, value));
  const channel = Math.round(255 * (1 - clamped / 100));
  return { r: channel, g: channel, b: channel };
}

/**
 * Converts an RGB color to a CSS rgb() string.
 */
export function rgbToString(rgb: { r: number; g: number; b: number }): string {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

/**
 * Calculates the relative luminance of an sRGB color per WCAG 2.0.
 * https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
export function relativeLuminance(rgb: { r: number; g: number; b: number }): number {
  const [rs, gs, bs] = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculates the WCAG 2.0 contrast ratio between two colors.
 * https://www.w3.org/TR/WCAG20/#contrast-ratiodef
 */
export function contrastRatio(
  c1: { r: number; g: number; b: number },
  c2: { r: number; g: number; b: number }
): number {
  const l1 = relativeLuminance(c1);
  const l2 = relativeLuminance(c2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Returns the best text color (black or white) for a given background
 * that meets WCAG 2.0 AA contrast ratio of 4.5:1.
 */
export function getAccessibleTextColor(bg: { r: number; g: number; b: number }): string {
  const white = { r: 255, g: 255, b: 255 };
  const black = { r: 0, g: 0, b: 0 };

  const whiteContrast = contrastRatio(bg, white);
  const blackContrast = contrastRatio(bg, black);

  return blackContrast >= whiteContrast ? "rgb(0, 0, 0)" : "rgb(255, 255, 255)";
}

/**
 * Returns a human-readable label for the grayscale value.
 */
export function getGrayscaleLabel(value: number): string {
  if (value <= 5) return "White";
  if (value <= 20) return "Very Light Gray";
  if (value <= 40) return "Light Gray";
  if (value <= 60) return "Medium Gray";
  if (value <= 80) return "Dark Gray";
  if (value <= 95) return "Very Dark Gray";
  return "Black";
}
