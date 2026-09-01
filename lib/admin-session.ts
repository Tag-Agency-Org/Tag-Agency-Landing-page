export interface AdminSecrets {
  LEADS_ADMIN_USERNAME?: string;
  LEADS_ADMIN_PASSWORD?: string;
  LEADS_ADMIN_SESSION_SECRET?: string;
}

export const ADMIN_SESSION_SECONDS = 8 * 60 * 60;

const SESSION_COOKIE = "tag_agency_leads_session";
const ADMIN_SESSION_MILLISECONDS = ADMIN_SESSION_SECONDS * 1_000;
const ADMIN_CREDENTIAL_CAPACITY = 256;
const HMAC_ALGORITHM = { name: "HMAC", hash: "SHA-256" } as const;
const BASE64_URL_PATTERN = /^[A-Za-z0-9_-]+$/;

type TimingSafeSubtleCrypto = SubtleCrypto & {
  timingSafeEqual?: (left: ArrayBufferView, right: ArrayBufferView) => boolean;
};

function constantTimeStringEqual(left: string, right: string) {
  const leftCodeUnits = new Uint16Array(ADMIN_CREDENTIAL_CAPACITY);
  const rightCodeUnits = new Uint16Array(ADMIN_CREDENTIAL_CAPACITY);

  for (let index = 0; index < ADMIN_CREDENTIAL_CAPACITY; index += 1) {
    leftCodeUnits[index] = left.charCodeAt(index) | 0;
    rightCodeUnits[index] = right.charCodeAt(index) | 0;
  }

  const subtle = crypto.subtle as TimingSafeSubtleCrypto;
  let contentsMatch: boolean;
  if (typeof subtle.timingSafeEqual === "function") {
    contentsMatch = subtle.timingSafeEqual(leftCodeUnits, rightCodeUnits);
  } else {
    let difference = 0;
    for (let index = 0; index < ADMIN_CREDENTIAL_CAPACITY; index += 1) {
      difference |= leftCodeUnits[index] ^ rightCodeUnits[index];
    }
    contentsMatch = difference === 0;
  }

  const lengthsMatch = left.length === right.length;
  const inputsAreWithinCapacity =
    left.length <= ADMIN_CREDENTIAL_CAPACITY && right.length <= ADMIN_CREDENTIAL_CAPACITY;
  return (
    (Number(contentsMatch) & Number(lengthsMatch) & Number(inputsAreWithinCapacity)) === 1
  );
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

export async function createAdminSession(issuedAt: number, secret: string) {
  if (!secret) throw new Error("Admin session secret is required");
  if (
    !Number.isSafeInteger(issuedAt) ||
    issuedAt <= 0 ||
    issuedAt > Number.MAX_SAFE_INTEGER - ADMIN_SESSION_MILLISECONDS
  ) {
    throw new Error("Admin session requires a valid issue time");
  }

  const expiresAt = issuedAt + ADMIN_SESSION_MILLISECONDS;
  const payload = bytesToBase64Url(
    new TextEncoder().encode(JSON.stringify({ v: 1, iat: issuedAt, exp: expiresAt }))
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
      Object.keys(session).length !== 3 ||
      session.v !== 1 ||
      !Number.isSafeInteger(session.iat) ||
      (session.iat as number) <= 0 ||
      !Number.isSafeInteger(session.exp) ||
      (session.exp as number) - (session.iat as number) !== ADMIN_SESSION_MILLISECONDS
    ) {
      return false;
    }

    return now >= (session.iat as number) && now < (session.exp as number);
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
