export interface AdminSecrets {
  LEADS_ADMIN_USERNAME?: string;
  LEADS_ADMIN_PASSWORD?: string;
  LEADS_ADMIN_SESSION_SECRET?: string;
}

export const ADMIN_SESSION_SECONDS = 8 * 60 * 60;

const SESSION_COOKIE = "tag_agency_leads_session";
const HMAC_ALGORITHM = { name: "HMAC", hash: "SHA-256" } as const;
const BASE64_URL_PATTERN = /^[A-Za-z0-9_-]+$/;

type TimingSafeSubtleCrypto = SubtleCrypto & {
  timingSafeEqual?: (left: ArrayBufferView, right: ArrayBufferView) => boolean;
};

function constantTimeStringEqual(left: string, right: string) {
  const comparisonLength = Math.max(left.length, right.length, 1);
  const leftCodeUnits = new Uint16Array(comparisonLength);
  const rightCodeUnits = new Uint16Array(comparisonLength);

  for (let index = 0; index < comparisonLength; index += 1) {
    leftCodeUnits[index] = left.charCodeAt(index) | 0;
    rightCodeUnits[index] = right.charCodeAt(index) | 0;
  }

  const subtle = crypto.subtle as TimingSafeSubtleCrypto;
  if (typeof subtle.timingSafeEqual === "function") {
    const contentsMatch = subtle.timingSafeEqual(leftCodeUnits, rightCodeUnits);
    return (Number(contentsMatch) & Number(left.length === right.length)) === 1;
  }

  let difference = left.length ^ right.length;
  for (let index = 0; index < comparisonLength; index += 1) {
    difference |= leftCodeUnits[index] ^ rightCodeUnits[index];
  }
  return difference === 0;
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/u, "");
}

function base64UrlToBytes(value: string) {
  if (!BASE64_URL_PATTERN.test(value) || value.length % 4 === 1) return undefined;

  try {
    const padding = "=".repeat((4 - (value.length % 4)) % 4);
    const binary = atob(value.replace(/-/g, "+").replace(/_/g, "/") + padding);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return bytesToBase64Url(bytes) === value ? bytes : undefined;
  } catch {
    return undefined;
  }
}

async function importHmacKey(secret: string, usage: "sign" | "verify") {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    HMAC_ALGORITHM,
    false,
    [usage]
  );
}

export function hasValidAdminCredentials(userId: string, password: string, secrets: AdminSecrets) {
  const expectedUserId = secrets.LEADS_ADMIN_USERNAME ?? "";
  const expectedPassword = secrets.LEADS_ADMIN_PASSWORD ?? "";
  const userIdMatches = constantTimeStringEqual(userId, expectedUserId);
  const passwordMatches = constantTimeStringEqual(password, expectedPassword);
  const credentialsAreConfigured = expectedUserId.length > 0 && expectedPassword.length > 0;

  return (
    (Number(credentialsAreConfigured) & Number(userIdMatches) & Number(passwordMatches)) === 1
  );
}

export async function createAdminSession(expiresAt: number, secret: string) {
  if (!secret) throw new Error("Admin session secret is required");
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= 0) {
    throw new Error("Admin session requires a valid expiry");
  }

  const payload = bytesToBase64Url(
    new TextEncoder().encode(JSON.stringify({ v: 1, exp: expiresAt }))
  );
  const key = await importHmacKey(secret, "sign");
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));

  return `${payload}.${bytesToBase64Url(new Uint8Array(signature))}`;
}

export async function isValidAdminSession(
  token: string | null | undefined,
  secret: string | undefined,
  now: number
) {
  if (!token || !secret || !Number.isFinite(now)) return false;

  const segments = token.split(".");
  if (segments.length !== 2) return false;
  const [encodedPayload, encodedSignature] = segments;
  if (!encodedPayload || !encodedSignature) return false;

  const signature = base64UrlToBytes(encodedSignature);
  if (!signature) return false;

  try {
    const key = await importHmacKey(secret, "verify");
    const signatureIsValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signature,
      new TextEncoder().encode(encodedPayload)
    );
    if (!signatureIsValid) return false;

    const payloadBytes = base64UrlToBytes(encodedPayload);
    if (!payloadBytes) return false;
    const payload: unknown = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(payloadBytes));
    if (typeof payload !== "object" || payload === null || Array.isArray(payload)) return false;

    const session = payload as Record<string, unknown>;
    if (
      Object.keys(session).length !== 2 ||
      session.v !== 1 ||
      !Number.isSafeInteger(session.exp) ||
      (session.exp as number) <= 0
    ) {
      return false;
    }

    return now < (session.exp as number);
  } catch {
    return false;
  }
}

export function adminSessionCookie(token: string) {
  return (
    `${SESSION_COOKIE}=${token}; Path=/; Max-Age=${ADMIN_SESSION_SECONDS}` +
    "; HttpOnly; Secure; SameSite=Strict"
  );
}

export function clearAdminSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`;
}
