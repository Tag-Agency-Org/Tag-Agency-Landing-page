import { z } from "zod";

export const industryOptions = [
  "Real Estate",
  "Automobile",
  "Education",
  "Healthcare",
  "D2C / Ecommerce",
  "Professional Services",
  "Other"
] as const;

export const budgetOptions = [
  "Not Started Yet",
  "Below ₹25,000",
  "₹25,000 to ₹50,000",
  "₹50,000 to ₹1,00,000",
  "₹1,00,000 to ₹3,00,000",
  "Above ₹3,00,000"
] as const;

export function normalizeIndianMobile(value: string) {
  return value.trim().replace(/^\+91\s?/, "");
}

export function sanitizeIndianMobileInput(value: string) {
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, "");

  if (trimmed.startsWith("+")) {
    const valueWithPrefix = `+${digits.slice(0, 12)}`;
    return /^\+91[6-9]\d{9}$/.test(valueWithPrefix) ? valueWithPrefix.slice(3) : valueWithPrefix;
  }

  return digits.slice(0, 10);
}

const fullNameSchema = z
  .string()
  .trim()
  .min(2, "Enter your full name")
  .max(80, "Enter a shorter full name")
  .regex(/^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u, "Use letters and spaces only for your full name");

const businessNameSchema = z
  .string()
  .trim()
  .min(2, "Enter your business name")
  .max(120, "Enter a shorter business name")
  .regex(/[\p{L}\p{M}]/u, "Enter a business name with at least one letter")
  .regex(/^[\p{L}\p{M}\p{N}][\p{L}\p{M}\p{N} &.,'()/-]*$/u, "Use a valid business name");

const phoneSchema = z
  .string()
  .trim()
  .refine((value) => /^(?:\+91\s?)?[6-9]\d{9}$/.test(value), "Enter a valid 10-digit Indian mobile number")
  .transform(normalizeIndianMobile);

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, "Enter a shorter email address")
  .email("Enter a valid email address");

const citySchema = z
  .string()
  .trim()
  .min(2, "Enter your city")
  .max(100, "Enter a shorter city name");

export const leadFormSchema = z.object({
  fullName: fullNameSchema,
  businessName: businessNameSchema,
  phone: phoneSchema,
  email: emailSchema,
  city: citySchema,
  industry: z.enum(industryOptions, { errorMap: () => ({ message: "Select your industry" }) }),
  monthlyBudget: z.enum(budgetOptions, { errorMap: () => ({ message: "Select your monthly advertising budget" }) })
});

export const leadSubmissionSchema = leadFormSchema;

export type LeadFormValues = z.infer<typeof leadFormSchema>;
