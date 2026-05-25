import { existsSync } from "node:fs";
import path from "node:path";

const assetRoot = path.join(process.cwd(), "public", "assets", "tag-agency");

export function assetExists(filename: string) {
  return existsSync(path.join(assetRoot, filename));
}

export function collectAssetStatus(filenames: string[]) {
  return Object.fromEntries(filenames.map((filename) => [filename, assetExists(filename)]));
}
