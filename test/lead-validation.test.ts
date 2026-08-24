import assert from "node:assert/strict";
import test from "node:test";
import { leadFormSchema } from "../lib/lead-validation.ts";

const validLead = {
  fullName: "Swaraj JD",
  businessName: "TAG Agency",
  phone: "9876543210",
  email: "hello@tagagency.in",
  industry: "Real Estate",
  monthlyBudget: "Below ₹25,000",
  primaryRequirement: "Lead Generation",
  message: "We need more qualified real estate enquiries.",
  consent: true
};

test("accepts a 10-digit Indian mobile number without +91", () => {
  const result = leadFormSchema.safeParse(validLead);

  assert.equal(result.success, true);
});

test("accepts an optional +91 prefix and stores the 10-digit mobile number", () => {
  const result = leadFormSchema.safeParse({ ...validLead, phone: "+919876543210" });

  assert.equal(result.success, true);
  if (result.success) assert.equal(result.data.phone, "9876543210");
});

test("rejects letters in a phone number", () => {
  const result = leadFormSchema.safeParse({ ...validLead, phone: "98765abcde" });

  assert.equal(result.success, false);
});

test("rejects non-Indian and junk phone formats at the shared validation boundary", () => {
  for (const phone of ["abc9876543210", "09876543210", "987-654-3210", "5123456789"]) {
    assert.equal(leadFormSchema.safeParse({ ...validLead, phone }).success, false);
  }
});

test("rejects values outside the form's select options", () => {
  const result = leadFormSchema.safeParse({ ...validLead, industry: "Definitely not an industry" });

  assert.equal(result.success, false);
});

test("rejects data that does not match the remaining field labels", () => {
  const invalidFields = [
    { fullName: "12345" },
    { businessName: "12345" },
    { email: "not-an-email" },
    { monthlyBudget: "A very large amount" },
    { primaryRequirement: "Anything at all" },
    { message: "short" },
    { consent: false }
  ];

  for (const invalidField of invalidFields) {
    assert.equal(leadFormSchema.safeParse({ ...validLead, ...invalidField }).success, false);
  }
});
