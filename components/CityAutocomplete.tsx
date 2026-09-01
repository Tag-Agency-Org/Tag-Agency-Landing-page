"use client";

import { useEffect, useId, useState, type FocusEventHandler } from "react";

type CitySuggestion = { name: string; state: string };

type CityAutocompleteProps = {
  value: string;
  onChange(value: string): void;
  onBlur: FocusEventHandler<HTMLInputElement>;
  error?: string;
};

export function CityAutocomplete({ value, onChange, onBlur, error }: CityAutocompleteProps) {
  const listId = useId();
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const query = value.trim();
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/cities?q=" + encodeURIComponent(query), { signal: controller.signal });
        const result = (await response.json()) as CitySuggestion[];
        setSuggestions(response.ok && Array.isArray(result) ? result : []);
      } catch (fetchError) {
        if ((fetchError as Error).name !== "AbortError") setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 150);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [value]);

  return (
    <div className="relative">
      <input
        className="form-input"
        autoComplete="address-level2"
        aria-autocomplete="list"
        aria-controls={suggestions.length ? listId : undefined}
        aria-expanded={suggestions.length > 0}
        maxLength={100}
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Start typing your city"
        required
        value={value}
      />
      {suggestions.length > 0 ? (
        <ul id={listId} role="listbox" className="absolute z-20 mt-1 max-h-52 w-full overflow-auto rounded-md border border-[#D9D4CB] bg-white py-1 shadow-xl">
          {suggestions.map((city) => (
            <li key={city.name} role="option" aria-selected={city.name === value}>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm font-semibold hover:bg-[#F7F5F0]"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  onChange(city.name);
                  setSuggestions([]);
                }}
              >
                {city.name}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <span className="sr-only" aria-live="polite">{isLoading ? "Finding cities" : ""}</span>
      {error ? <span className="mt-2 block text-xs font-bold text-[#C35A4A]">{error}</span> : null}
    </div>
  );
}
