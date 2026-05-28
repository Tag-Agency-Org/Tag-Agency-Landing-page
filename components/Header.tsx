"use client";

import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { phoneHref } from "@/lib/site-data";

const navItems = [
  ["Services", "#services"],
  ["Our Process", "#process"],
  ["Results", "#results"],
  ["About", "#about"],
  ["Contact", "#contact"]
];

type Props = {
  hasLogo: boolean;
};

export function Header({ hasLogo }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition ${
        scrolled || open ? "border-b border-white/10 bg-[#09111A]/95 backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="container flex h-20 items-center justify-between gap-6">
        <a href="#top" className="flex min-w-[132px] items-center" aria-label="TAG Agency home">
          {hasLogo ? (
            <span className="flex h-12 w-36 items-center justify-center rounded-md bg-[#F7F5F0] px-3">
              <Image
                src="/assets/tag-agency/tag-agency-logo-cropped.png"
                alt="TAG Agency"
                width={180}
                height={44}
                priority
                className="max-h-9 w-auto object-contain"
              />
            </span>
          ) : (
            <span className="font-[var(--font-manrope)] text-xl font-extrabold tracking-wide">TAG Agency</span>
          )}
        </a>
        <nav className="nav-dock hidden items-center gap-2 text-sm font-semibold text-[#AFBAC7] lg:flex" aria-label="Primary">
          {navItems.map(([label, href]) => (
            <a key={label} href={href} className="nav-dock-item">
              {label}
            </a>
          ))}
        </nav>
        <a href={phoneHref} className="button button-primary desktop-header-cta" aria-label="Call TAG Agency to book a strategy call">
          Book a Strategy Call
        </a>
        <button
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/15 lg:hidden"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-white/10 bg-[#09111A] px-4 pb-5 lg:hidden">
          <nav className="container grid gap-2 py-4" aria-label="Mobile primary">
            {navItems.map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="rounded-md px-2 py-3 text-base font-semibold text-[#F5F3EE]"
                onClick={() => setOpen(false)}
              >
                {label}
              </a>
            ))}
            <a href={phoneHref} className="button button-primary mt-2" onClick={() => setOpen(false)}>
              Book a Strategy Call
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
