"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  budgetOptions,
  industryOptions,
  leadFormSchema,
  sanitizeIndianMobileInput,
  type LeadFormValues
} from "@/lib/lead-validation";
import { ScrollReveal } from "./ScrollReveal";
import { TypingHeadline } from "./TypingHeadline";
import { CityAutocomplete } from "./CityAutocomplete";

export function StrategyCallForm() {
  const [tracking, setTracking] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<LeadFormValues>({ resolver: zodResolver(leadFormSchema) });

  const fullNameField = register("fullName");
  const businessNameField = register("businessName");
  const phoneField = register("phone");
  const cityField = register("city");
  const city = watch("city");

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

  async function onSubmit(values: LeadFormValues) {
    setSubmitError("");

    const payload = {
      ...values,
      ...tracking
    };

    let timeout: number | undefined;

    try {
      const controller = new AbortController();
      timeout = window.setTimeout(() => controller.abort(), 15000);

      console.info("Submitting lead request to /api/leads");
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      const result = (await response.json().catch(() => null)) as { success?: boolean; message?: string } | null;

      console.info("Lead request completed before redirect", {
        ok: response.ok,
        status: response.status
      });

      if (!response.ok || result?.success !== true) {
        throw new Error(result?.message || `Lead submission failed with status ${response.status}`);
      }

      reset();
      window.location.assign("/thank-you");
    } catch (error) {
      console.error("Lead submission failed before redirect:", error);
      setSubmitError("We could not submit your enquiry right now. Please try again.");
    } finally {
      if (timeout !== undefined) {
        window.clearTimeout(timeout);
      }
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
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="rounded-lg bg-[#F7F5F0] p-5 text-[#14202B] shadow-2xl md:p-8">
          <div className="mb-7">
            <h3 className="font-[var(--font-manrope)] text-3xl font-extrabold">Get a Free Ad account Audit</h3>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Full Name" error={errors.fullName?.message}>
              <input
                {...fullNameField}
                className="form-input"
                autoComplete="name"
                inputMode="text"
                maxLength={80}
                onChange={(event) => {
                  event.currentTarget.value = event.currentTarget.value.replace(/[^\p{L}\p{M} .'-]/gu, "").slice(0, 80);
                  fullNameField.onChange(event);
                }}
                placeholder="Your full name"
                required
              />
            </Field>
            <Field label="Business Name" error={errors.businessName?.message}>
              <input
                {...businessNameField}
                className="form-input"
                autoComplete="organization"
                maxLength={120}
                onChange={(event) => {
                  event.currentTarget.value = event.currentTarget.value
                    .replace(/[^\p{L}\p{M}\p{N} &.,'()/-]/gu, "")
                    .slice(0, 120);
                  businessNameField.onChange(event);
                }}
                placeholder="Your business name"
                required
              />
            </Field>
            <Field label="City" error={errors.city?.message}>
              <CityAutocomplete
                value={city || ""}
                onBlur={cityField.onBlur}
                onChange={(value) => setValue("city", value, { shouldValidate: true })}
              />
            </Field>
            <Field label="Phone Number" error={errors.phone?.message}>
              <input
                {...phoneField}
                className="form-input"
                autoComplete="tel-national"
                inputMode="numeric"
                maxLength={13}
                onChange={(event) => {
                  event.currentTarget.value = sanitizeIndianMobileInput(event.currentTarget.value);
                  phoneField.onChange(event);
                }}
                placeholder="98765 43210"
                required
              />
            </Field>
            <Field label="Email Address" error={errors.email?.message}>
              <input
                {...register("email")}
                className="form-input"
                autoComplete="email"
                inputMode="email"
                maxLength={254}
                placeholder="you@business.com"
                required
                type="email"
              />
            </Field>
            <Field label="Industry" error={errors.industry?.message}>
              <select {...register("industry")} className="form-input" required>
                <option value="">Select industry</option>
                {industryOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>
            <Field label="Monthly Advertising Budget" error={errors.monthlyBudget?.message}>
              <select {...register("monthlyBudget")} className="form-input" required>
                <option value="">Select budget</option>
                {budgetOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>
          </div>

          <button type="submit" className="button button-dark mt-6 w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Get My Free Ad account Audit"} <Send size={18} />
          </button>
          <p className="mt-3 text-center text-xs text-[#465464]">
            Your information is kept private and used only to respond to your enquiry.
          </p>
          <div className="mt-4 min-h-6 text-center text-sm font-bold text-[#C35A4A]" aria-live="polite">
            {submitError}
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
