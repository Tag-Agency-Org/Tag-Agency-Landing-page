import { MessageCircle, PhoneCall } from "lucide-react";
import { phoneHref, phoneNumber, whatsAppHref } from "@/lib/site-data";

export function WhatsAppWidget() {
  return (
    <div className="fixed bottom-20 right-3 z-50 grid gap-2 md:bottom-6 md:right-4 md:gap-3">
      <a
        href={phoneHref}
        className="grid justify-items-center gap-1 text-center text-xs font-extrabold text-[#F5F3EE] transition hover:translate-y-[-1px]"
        aria-label={`Call TAG Agency at ${phoneNumber}`}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D6A64F] text-[#09111A] shadow-2xl md:h-14 md:w-14">
          <PhoneCall size={23} aria-hidden="true" />
        </span>
        <span className="rounded-full bg-[#09111A]/90 px-2 py-1 shadow-lg backdrop-blur">Call</span>
      </a>
      <a
        href={whatsAppHref}
        target="_blank"
        rel="noreferrer"
        className="grid justify-items-center gap-1 text-center text-xs font-extrabold text-[#F5F3EE] transition hover:translate-y-[-1px]"
        aria-label={`Chat with TAG Agency on WhatsApp at ${phoneNumber}`}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl md:h-14 md:w-14">
          <MessageCircle size={25} aria-hidden="true" />
        </span>
        <span className="rounded-full bg-[#09111A]/90 px-2 py-1 shadow-lg backdrop-blur">WhatsApp</span>
      </a>
    </div>
  );
}
