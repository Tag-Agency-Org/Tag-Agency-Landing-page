import { readdirSync } from "node:fs";
import path from "node:path";

export type ClientLogo = {
  filename: string;
  alt: string;
};

const clientLogoRoot = path.join(process.cwd(), "public", "client-logos");
const imageExtensionPattern = /\.(png|jpe?g|webp|svg)$/i;
const acronymWords = new Set(["bm", "ds", "kia", "rp", "svt", "tvs"]);

function toTitleWord(word: string) {
  if (acronymWords.has(word)) {
    return word.toUpperCase();
  }

  return word.charAt(0).toUpperCase() + word.slice(1);
}

function altTextFromFilename(filename: string) {
  const stem = filename
    .replace(imageExtensionPattern, "")
    .replace(/^client-logo-\d+-/, "")
    .replace(/^\d+-/, "");

  const label = stem
    .split("-")
    .filter(Boolean)
    .map(toTitleWord)
    .join(" ");

  return `${label || "Client"} client logo`;
}

export function getClientLogos(): ClientLogo[] {
  try {
    return readdirSync(clientLogoRoot)
      .filter((filename) => imageExtensionPattern.test(filename))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((filename) => ({
        filename,
        alt: altTextFromFilename(filename)
      }));
  } catch {
    return [];
  }
}
