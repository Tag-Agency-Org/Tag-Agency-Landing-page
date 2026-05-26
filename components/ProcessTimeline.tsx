"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const steps = [
  ["Understand", "We study your business, audience, margins, current lead challenges and sales process before recommending a direction."],
  ["Strategise", "We identify the right platforms, campaign structure, creative direction and conversion journey for your objective."],
  ["Launch", "Campaigns begin with measurable conversion actions, controlled testing and a clear performance foundation."],
  ["Optimise", "We review campaign patterns and lead quality signals to make practical, evidence-led improvements."],
  ["Scale", "When a campaign system demonstrates consistency, we expand the strongest opportunities responsibly."]
];

export function ProcessTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [phase, setPhase] = useState<"title" | "copy" | "complete">("title");
  const [typedTitles, setTypedTitles] = useState(() => steps.map(() => ""));
  const [typedCopies, setTypedCopies] = useState(() => steps.map(() => ""));

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPlayed) {
          setTypedTitles(steps.map(() => ""));
          setTypedCopies(steps.map(() => ""));
          setActiveStep(0);
          setPhase("title");
          setStarted(true);
          setHasPlayed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -22% 0px", threshold: 0.28 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [hasPlayed]);

  useEffect(() => {
    if (!started) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setTypedTitles(steps.map(([title]) => title));
      setTypedCopies(steps.map(([, copy]) => copy));
      setActiveStep(steps.length - 1);
      setPhase("complete");
      return;
    }

    if (activeStep >= steps.length) return;

    const [title, copy] = steps[activeStep];
    let timer: number | undefined;

    if (phase === "title") {
      const current = typedTitles[activeStep] || "";
      if (current.length < title.length) {
        timer = window.setTimeout(() => {
          setTypedTitles((items) => items.map((item, index) => (index === activeStep ? title.slice(0, current.length + 1) : item)));
        }, 34);
      } else {
        timer = window.setTimeout(() => setPhase("copy"), 120);
      }
    }

    if (phase === "copy") {
      const current = typedCopies[activeStep] || "";
      if (current.length < copy.length) {
        timer = window.setTimeout(() => {
          setTypedCopies((items) => items.map((item, index) => (index === activeStep ? copy.slice(0, current.length + 1) : item)));
        }, 7);
      } else {
        timer = window.setTimeout(() => {
          if (activeStep < steps.length - 1) {
            setActiveStep((step) => step + 1);
            setPhase("title");
          } else {
            setPhase("complete");
          }
        }, 260);
      }
    }

    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [activeStep, phase, started, typedCopies, typedTitles]);

  return (
    <section ref={sectionRef} id="process" className="section bg-[#F7F5F0] text-[#14202B]">
      <div className="container">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="eyebrow">Decision system</p>
            <h2 className="mt-4 font-[var(--font-manrope)] text-4xl font-extrabold leading-tight md:text-5xl">
              A Clear Process Built Around Better Decisions
            </h2>
          </div>
          <a href="#contact" className="button button-dark">
            Start With a Strategy Discussion <ArrowRight size={18} />
          </a>
        </div>
        <div className="process-route relative mt-14 grid gap-5 lg:grid-cols-5">
          <div className="process-route-line hidden lg:block" aria-hidden="true">
            <span className="process-route-current" />
          </div>
          {steps.map(([title, copy], index) => {
            const isVisible = started && index <= activeStep;
            const isActive = isVisible && activeStep === index && phase !== "complete";

            return isVisible ? (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.18, duration: 0.48 }}
              className={`process-card relative rounded-md border bg-white p-6 ${
                isActive ? "process-card-active" : "border-[#14202B]/12"
              }`}
            >
              {index < steps.length - 1 ? (
                <span className="process-arrow hidden lg:flex" aria-hidden="true">
                  <ChevronRight size={18} />
                </span>
              ) : null}
              <span className="process-step-number flex h-16 w-16 items-center justify-center rounded-full border border-[#14202B]/14 bg-[#F7F5F0] font-[var(--font-manrope)] text-xl font-extrabold text-[#3E86F5]">
                0{index + 1}
              </span>
              <span className="signal-pulse mt-5 block h-px w-full origin-left bg-gradient-to-r from-[#3E86F5] via-[#D6A64F] to-transparent lg:hidden" />
              <h3 className="mt-8 min-h-7 font-[var(--font-manrope)] text-xl font-extrabold">
                {typedTitles[index]}
                {isActive && phase === "title" ? <span className="typing-caret" aria-hidden="true" /> : null}
              </h3>
              <p className="mt-3 min-h-[7.5rem] text-sm leading-6 text-[#465464]">
                {typedCopies[index]}
                {isActive && phase === "copy" ? <span className="typing-caret" aria-hidden="true" /> : null}
              </p>
            </motion.article>
            ) : null;
          })}
        </div>
      </div>
    </section>
  );
}
