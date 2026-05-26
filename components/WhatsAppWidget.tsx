import { MessageCircle } from "lucide-react";
import { phoneNumber, whatsAppHref } from "@/lib/site-data";

export function WhatsAppWidget() {
  return (
    <a
      href={whatsAppHref}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-24 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition hover:translate-y-[-1px] md:bottom-6"
      aria-label={`Chat with TAG Agency on WhatsApp at ${phoneNumber}`}
    >
      <MessageCircle size={27} aria-hidden="true" />
    </a>
  );
}
