"use client";

import { useEffect, useState } from "react";

type Props = {
  text: string;
  className?: string;
};

export function TypingHeadline({ text, className }: Props) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let timer: number | undefined;
    let restartTimer: number | undefined;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setDisplayed(text);
      return;
    }

    const runTyping = () => {
      setDisplayed(text.slice(0, 1));
      let index = 1;
      timer = window.setInterval(() => {
        index += 1;
        setDisplayed(text.slice(0, index));
        if (index >= text.length && timer) {
          window.clearInterval(timer);
          restartTimer = window.setTimeout(runTyping, 3200);
        }
      }, 38);
    };

    runTyping();

    return () => {
      if (timer) window.clearInterval(timer);
      if (restartTimer) window.clearTimeout(restartTimer);
    };
  }, [text]);

  return (
    <h2 className={className} aria-label={text}>
      <span aria-hidden="true">{displayed}</span>
      <span className="typing-caret" aria-hidden="true" />
    </h2>
  );
}
