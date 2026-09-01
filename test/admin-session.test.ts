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

test("rejects session tampering and expiry", async () => {
  const expiresAt = 1_800_000_000_000;
  const token = await createAdminSession(expiresAt, "signing-secret");

  assert.equal(await isValidAdminSession(token, "signing-secret", 1_799_000_000_000), true);
  assert.equal(await isValidAdminSession(token + "x", "signing-secret", 1_799_000_000_000), false);
  assert.equal(await isValidAdminSession(token, "wrong-signing-secret", 1_799_000_000_000), false);
  assert.equal(await isValidAdminSession(token, "signing-secret", expiresAt), false);
  assert.equal(await isValidAdminSession(token, "signing-secret", expiresAt + 1), false);
});

test("rejects malformed sessions and missing session secrets", async () => {
  const token = await createAdminSession(1_800_000_000_000, "signing-secret");

  assert.equal(await isValidAdminSession("not-a-session", "signing-secret", 1_799_000_000_000), false);
  assert.equal(await isValidAdminSession(token, "", 1_799_000_000_000), false);
  assert.equal(await isValidAdminSession(token, "signing-secret", Number.NaN), false);
  await assert.rejects(createAdminSession(1_800_000_000_000, ""), /session secret is required/i);
  await assert.rejects(createAdminSession(Number.NaN, "signing-secret"), /valid expiry/i);
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
