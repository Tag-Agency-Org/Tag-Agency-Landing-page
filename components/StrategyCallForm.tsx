"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ScrollReveal } from "./ScrollReveal";
import { TypingHeadline } from "./TypingHeadline";

const schema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  businessName: z.string().min(2, "Enter your business name"),
  phone: z.string().min(8, "Enter a valid phone number").max(20, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email address"),
  industry: z.string().min(1, "Select your industry"),
  monthlyBudget: z.string().min(1, "Select your monthly advertising budget"),
  primaryRequirement: z.string().min(1, "Select your primary requirement"),
  message: z.string().min(10, "Share a little more about your current challenge"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Consent is required before submitting" })
  })
});

type FormValues = z.infer<typeof schema>;

const industryOptions = [
  "Real Estate",
  "Automobile",
  "Education",
  "Healthcare",
  "D2C / Ecommerce",
  "Professional Services",
  "Other"
];

const budgetOptions = [
  "Not Started Yet",
  "Below ₹25,000",
  "₹25,000 to ₹50,000",
  "₹50,000 to ₹1,00,000",
  "₹1,00,000 to ₹3,00,000",
  "Above ₹3,00,000"
];

const requirementOptions = [
  "Meta Ads Management",
  "Google Ads Management",
  "Lead Generation",
  "Campaign Audit",
  "Landing Page / Funnel Strategy",
  "Creative Production",
  "Other"
];

export function StrategyCallForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [tracking, setTracking] = useState<Record<string, string>>({});
  const endpoint = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setTracking({
      submittedDate: new Date().toISOString(),
      pageUrl: window.location.href,
      utmSource: params.get("utm_source") || "",
      utmMedium: params.get("utm_medium") || "",
      utmCampaign: params.get("utm_campaign") || "",
      utmContent: params.get("utm_content") || "",
      utmTerm: params.get("utm_term") || "",
      referrerUrl: document.referrer || ""
    });
  }, []);

  async function onSubmit(values: FormValues) {
    setStatus("idle");
    if (!endpoint) {
      setStatus("error");
      return;
    }

    const payload = {
      ...values,
      ...tracking,
      consent: values.consent ? "Yes" : "No"
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || data?.success === false) {
        throw new Error("Lead submission failed");
      }

      reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="section bg-[#09111A]">
      <div className="container grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
        <ScrollReveal className="panel rounded-lg p-6 md:p-8">
          <p className="eyebrow">Strategy call</p>
          <TypingHeadline
            text="Ready to Build a Stronger Lead Generation System?"
            className="mt-4 min-h-[9.6rem] font-[var(--font-manrope)] text-4xl font-extrabold leading-tight md:min-h-[7.5rem] md:text-5xl"
          />
          <p className="mt-5 text-lg leading-8 text-[#AFBAC7]">
            Tell us about your business, current advertising activity and primary challenge. Our team will review your
            enquiry and connect with you for a focused strategy discussion.
          </p>
          <ul className="mt-8 grid gap-3 text-sm font-semibold">
            {[
              "Focused discussion around your advertising challenge",
              "No inflated promises or generic recommendations",
              "Your details are used only to respond to your enquiry"
            ].map((point) => (
              <li key={point} className="rounded-md border border-white/10 bg-white/[0.035] p-4">
                {point}
              </li>
            ))}
          </ul>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg bg-[#F7F5F0] p-5 text-[#14202B] shadow-2xl md:p-8">
          <div className="mb-7">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#3E86F5]">Qualified enquiry</p>
            <h3 className="mt-2 font-[var(--font-manrope)] text-3xl font-extrabold">Request a Strategy Call</h3>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Full Name" error={errors.fullName?.message}>
              <input {...register("fullName")} className="form-input" autoComplete="name" />
            </Field>
            <Field label="Business Name" error={errors.businessName?.message}>
              <input {...register("businessName")} className="form-input" autoComplete="organization" />
            </Field>
            <Field label="Phone Number" error={errors.phone?.message}>
              <input {...register("phone")} className="form-input" autoComplete="tel" inputMode="tel" />
            </Field>
            <Field label="Email Address" error={errors.email?.message}>
              <input {...register("email")} className="form-input" autoComplete="email" inputMode="email" />
            </Field>
            <Field label="Industry" error={errors.industry?.message}>
              <select {...register("industry")} className="form-input">
                <option value="">Select industry</option>
                {industryOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>
            <Field label="Monthly Advertising Budget" error={errors.monthlyBudget?.message}>
              <select {...register("monthlyBudget")} className="form-input">
                <option value="">Select budget</option>
                {budgetOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>
            <Field label="Primary Requirement" error={errors.primaryRequirement?.message} wide>
              <select {...register("primaryRequirement")} className="form-input">
                <option value="">Select requirement</option>
                {requirementOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>
            <Field label="Message / Current Challenge" error={errors.message?.message} wide>
              <textarea {...register("message")} className="form-input min-h-32 resize-y" />
            </Field>
          </div>

          <label className="mt-5 flex gap-3 text-sm font-semibold">
            <input type="checkbox" {...register("consent")} className="mt-1 h-5 w-5 accent-[#14202B]" />
            <span>I agree to be contacted by TAG Agency regarding my enquiry.</span>
          </label>
          {errors.consent?.message ? <p className="mt-2 text-sm font-bold text-[#C35A4A]">{errors.consent.message}</p> : null}

          <button type="submit" className="button button-dark mt-6 w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Request My Strategy Call"} <Send size={18} />
          </button>
          <p className="mt-3 text-center text-xs text-[#465464]">
            Your information is kept private and used only to respond to your enquiry.
          </p>
          <div className="mt-4 min-h-6 text-center text-sm font-bold" aria-live="polite">
            {status === "success" ? (
              <p className="text-[#269B71]">Thank you. Your enquiry has been received. Our team will contact you shortly.</p>
            ) : null}
            {status === "error" ? (
              <p className="text-[#C35A4A]">We could not submit your enquiry right now. Please review your details and try again.</p>
            ) : null}
          </div>
        </form>
        </ScrollReveal>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  children,
  wide = false
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={`grid gap-2 text-sm font-bold ${wide ? "md:col-span-2" : ""}`}>
      <span>{label}</span>
      {children}
      {error ? <span className="text-xs font-bold text-[#C35A4A]">{error}</span> : null}
    </label>
  );
}
