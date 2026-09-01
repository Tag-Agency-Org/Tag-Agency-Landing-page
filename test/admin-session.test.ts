import assert from "node:assert/strict";
import test from "node:test";
import {
  ADMIN_SESSION_SECONDS,
  adminSessionCookie,
  clearAdminSessionCookie,
  createAdminSession,
  hasValidAdminCredentials,
  isValidAdminSession
} from "../lib/admin-session.ts";

test("accepts only exact owner credentials", () => {
  const secrets = {
    LEADS_ADMIN_USERNAME: "tagagency-admin",
    LEADS_ADMIN_PASSWORD: "correct"
  };

  assert.equal(hasValidAdminCredentials("tagagency-admin", "correct", secrets), true);
  assert.equal(hasValidAdminCredentials("tagagency-admin", "wrong", secrets), false);
  assert.equal(hasValidAdminCredentials("tagagency-admin-extra", "correct", secrets), false);
  assert.equal(hasValidAdminCredentials("tagagency-admin", "correct-extra", secrets), false);
  assert.equal(hasValidAdminCredentials("", "", {}), false);
});

test("compares exact credentials at the fixed-capacity boundary", () => {
  const maximumCredential = "a".repeat(256);
  const secrets = {
    LEADS_ADMIN_USERNAME: maximumCredential,
    LEADS_ADMIN_PASSWORD: maximumCredential
  };

  assert.equal(hasValidAdminCredentials(maximumCredential, maximumCredential, secrets), true);
  assert.equal(
    hasValidAdminCredentials(maximumCredential.slice(0, -1), maximumCredential, secrets),
    false
  );
  assert.equal(
    hasValidAdminCredentials(`${maximumCredential.slice(0, -1)}b`, maximumCredential, secrets),
    false
  );
});

test("rejects credentials beyond the fixed-capacity boundary", () => {
  const oversizedCredential = "a".repeat(257);
  const secrets = {
    LEADS_ADMIN_USERNAME: oversizedCredential,
    LEADS_ADMIN_PASSWORD: oversizedCredential
  };

  assert.equal(hasValidAdminCredentials(oversizedCredential, oversizedCredential, secrets), false);
});

test("rejects session tampering", async () => {
  const issuedAt = 1_800_000_000_000;
  const token = await createAdminSession(issuedAt, "signing-secret");

  assert.equal(await isValidAdminSession(token, "signing-secret", issuedAt + 1), true);
  assert.equal(await isValidAdminSession(token + "x", "signing-secret", issuedAt + 1), false);
  assert.equal(await isValidAdminSession(token, "wrong-signing-secret", issuedAt + 1), false);
});

test("enforces an exact eight-hour signed lifetime", async () => {
  const issuedAt = 1_800_000_000_000;
  const expiresAt = 1_800_028_800_000;
  const token = await createAdminSession(issuedAt, "signing-secret");

  assert.equal(await isValidAdminSession(token, "signing-secret", issuedAt - 1), false);
  assert.equal(await isValidAdminSession(token, "signing-secret", issuedAt), true);
  assert.equal(await isValidAdminSession(token, "signing-secret", expiresAt - 1), true);
  assert.equal(await isValidAdminSession(token, "signing-secret", expiresAt), false);
  assert.equal(await isValidAdminSession(token, "signing-secret", expiresAt + 1), false);
});

test("rejects malformed sessions and missing session secrets", async () => {
  const issuedAt = 1_800_000_000_000;
  const token = await createAdminSession(issuedAt, "signing-secret");

  assert.equal(await isValidAdminSession("not-a-session", "signing-secret", issuedAt), false);
  assert.equal(await isValidAdminSession(token, "", issuedAt), false);
  assert.equal(await isValidAdminSession(token, "signing-secret", Number.NaN), false);
  await assert.rejects(createAdminSession(1_800_000_000_000, ""), /session secret is required/i);
  await assert.rejects(createAdminSession(Number.NaN, "signing-secret"), /valid issue time/i);
});

test("creates cookie-safe sessions with an eight-hour hardened cookie", async () => {
  const token = await createAdminSession(1_800_000_000_000, "signing-secret");

  assert.match(token, /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/);
  assert.equal(ADMIN_SESSION_SECONDS, 8 * 60 * 60);
  assert.equal(
    adminSessionCookie(token),
    `tag_agency_leads_session=${token}; Path=/; Max-Age=28800; HttpOnly; Secure; SameSite=Strict`
  );
  assert.equal(
    clearAdminSessionCookie(),
    "tag_agency_leads_session=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict"
  );
});
