import { phoneHref } from "@/lib/site-data";

export function MobileStickyCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#09111A]/95 p-3 backdrop-blur md:hidden">
      <a href={phoneHref} className="button button-primary w-full" aria-label="Call TAG Agency to book a strategy call">
        Book a Strategy Call
      </a>
    </div>
  );
}
