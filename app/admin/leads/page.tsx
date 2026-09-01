import { LeadExportForm } from "@/components/LeadExportForm";

export const metadata = {
  title: "Lead downloads | TAG Agency",
  robots: { index: false, follow: false }
};

export default function LeadDownloadsPage() {
  return (
    <main className="min-h-screen bg-[#09111A] px-5 py-16 text-[#F7F5F0] md:px-8">
      <section className="mx-auto max-w-xl rounded-xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl md:p-8">
        <p className="eyebrow">Private owner area</p>
        <h1 className="mt-4 font-[var(--font-manrope)] text-3xl font-extrabold leading-tight md:text-4xl">
          Download daily leads
        </h1>
        <p className="mt-4 leading-7 text-[#AFBAC7]">
          Select a date and download the leads captured through the TAG Agency website as a CSV file for Excel.
        </p>
        <LeadExportForm />
      </section>
    </main>
  );
}
