"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { StrategyCallForm } from "./StrategyCallForm";

export function StrategyCallPopup() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed || open) return;

    let animationFrame = 0;

    const checkHeroPassed = () => {
      const heroSection = document.getElementById("top");
      if (!heroSection) return;

      const triggerPoint = heroSection.offsetTop + heroSection.offsetHeight;
      if (window.scrollY > triggerPoint) {
        setOpen(true);
      }
    };

    const scheduleCheck = () => {
      if (animationFrame) return;

      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0;
        checkHeroPassed();
      });
    };

    const initialCheckTimeout = window.setTimeout(scheduleCheck, 250);

    scheduleCheck();
    window.addEventListener("scroll", scheduleCheck, { passive: true });
    return () => {
      window.clearTimeout(initialCheckTimeout);
      window.removeEventListener("scroll", scheduleCheck);
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [dismissed, open]);

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setDismissed(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-[#09111A]/82 px-3 py-3 backdrop-blur-md md:px-4 md:py-8" role="dialog" aria-modal="true" aria-label="Request a strategy call">
      <div className="relative mx-auto max-h-full max-w-6xl overflow-y-auto rounded-lg border border-white/12 bg-[#09111A] shadow-2xl">
        <button
          type="button"
          className="sticky left-full top-3 z-10 mr-3 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-[#09111A]/90 text-[#F5F3EE] transition hover:border-[#D6A64F]/50 hover:text-[#D6A64F]"
          aria-label="Close strategy call form"
          onClick={() => {
            setOpen(false);
            setDismissed(true);
          }}
        >
          <X size={22} aria-hidden="true" />
        </button>
        <div className="strategy-popup-form">
          <StrategyCallForm />
        </div>
      </div>
    </div>
  );
}
