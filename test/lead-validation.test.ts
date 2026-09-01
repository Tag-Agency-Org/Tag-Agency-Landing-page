import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { leadFormSchema } from "../lib/lead-validation.ts";

const validLead = {
  fullName: "Swaraj JD",
  businessName: "TAG Agency",
  phone: "9876543210",
  email: "hello@tagagency.in",
  industry: "Real Estate",
  monthlyBudget: "Below ₹25,000"
};

const completeLead = { ...validLead, city: "Bengaluru" };

const formSource = fs.readFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), "../components/StrategyCallForm.tsx"),
  "utf8"
);

test("accepts a 10-digit Indian mobile number without +91", () => {
  const result = leadFormSchema.safeParse(completeLead);

  assert.equal(result.success, true);
});

test("accepts an optional +91 prefix and stores the 10-digit mobile number", () => {
  const result = leadFormSchema.safeParse({ ...completeLead, phone: "+919876543210" });

  assert.equal(result.success, true);
  if (result.success) assert.equal(result.data.phone, "9876543210");
});

test("accepts an enquiry without the removed qualification inputs", () => {
  const result = leadFormSchema.safeParse(completeLead);

  assert.equal(result.success, true);
});

test("does not render the removed qualification copy, fields, or consent checkbox", () => {
  for (const removedText of [
    "Qualified enquiry",
    "Primary Requirement",
    "Message / Current Challenge",
    'register("primaryRequirement")',
    'register("message")',
    'register("consent")'
  ]) {
    assert.equal(formSource.includes(removedText), false, `Form must not include: ${removedText}`);
  }
});

test("rejects letters in a phone number", () => {
  const result = leadFormSchema.safeParse({ ...completeLead, phone: "98765abcde" });

  assert.equal(result.success, false);
});

test("rejects non-Indian and junk phone formats at the shared validation boundary", () => {
  for (const phone of ["abc9876543210", "09876543210", "987-654-3210", "5123456789"]) {
    assert.equal(leadFormSchema.safeParse({ ...completeLead, phone }).success, false);
  }
});

test("rejects values outside the form's select options", () => {
  const result = leadFormSchema.safeParse({ ...completeLead, industry: "Definitely not an industry" });

  assert.equal(result.success, false);
});

test("rejects data that does not match the remaining field labels", () => {
  const invalidFields = [
    { fullName: "12345" },
    { businessName: "12345" },
    { email: "not-an-email" },
    { monthlyBudget: "A very large amount" }
  ];

  for (const invalidField of invalidFields) {
    assert.equal(leadFormSchema.safeParse({ ...completeLead, ...invalidField }).success, false);
  }
});

test("requires a city in every new lead", () => {
  assert.equal(leadFormSchema.safeParse(validLead).success, false);
  assert.equal(leadFormSchema.safeParse({ ...validLead, city: "Bengaluru" }).success, true);
});
