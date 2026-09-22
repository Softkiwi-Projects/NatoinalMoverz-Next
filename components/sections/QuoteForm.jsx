"use client";

import { useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import { site } from "@/data/site";

// Web3Forms access key. Set NEXT_PUBLIC_WEB3FORMS_KEY in .env.local (see
// .env.example). It is a publishable, write-only key — it can only push
// submissions to the inbox it was registered against, so shipping it in the
// client bundle is by design. That also keeps the site a pure static export:
// the browser POSTs straight to Web3Forms, no server of ours involved.
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
const ENDPOINT = "https://api.web3forms.com/submit";

const moveTypes = [
  "1 Bedroom",
  "2 Bedrooms",
  "3 Bedrooms",
  "4 Bedrooms",
  "5+ Bedrooms",
  "Commercial Move",
  "Long Distance Move",
  "Office Move",
  "Single Item Move",
];

const initial = {
  name: "",
  email: "",
  phone: "",
  date: "",
  pickup: "",
  dropoff: "",
  moveType: "1 Bedroom",
};

export default function QuoteForm({ variant = "card" }) {
  // "yellow" = borderless white pill fields with dark accents, for use on a
  // brand-yellow card (the restyled Service Template hero). Behaves like
  // "hero" layout-wise (placeholders instead of labels, grid rows).
  const yellow = variant === "yellow";
  // "light" = white pill fields on a light/grey background (the quote-form
  // hero). Same layout as hero, but a grey progress track + dark fill/buttons.
  const light = variant === "light";
  const hero = variant === "hero" || yellow || light;
  // "bds" = stacked labelled fields with navy/yellow accents, for the homepage
  // quote cards (no self-wrapping card — the parent provides it).
  const bds = variant === "bds";
  // "panel" = card-style fields but no self-wrapping card (parent provides it).
  const wrapperCls = variant === "card" ? "rounded-2xl bg-white p-8 shadow-card" : "";
  const formRef = useRef(null);
  const botRef = useRef(null);
  const [step, setStep] = useState(1);
  const [data, setData] = useState(initial);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const update = (k) => (e) => setData((d) => ({ ...d, [k]: e.target.value }));
  const pct = [33, 66, 100][step - 1];
  // Only the current step's fields are mounted, so the form's native constraint
  // check covers exactly this step — a missing email is reported on step 1
  // where the visitor can still see the field, not at the final submit.
  const next = () => {
    if (formRef.current && !formRef.current.reportValidity()) return;
    setError("");
    setStep((s) => Math.min(3, s + 1));
  };
  const back = () => setStep((s) => Math.max(1, s - 1));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;
    // Honeypot: invisible to people, irresistible to bots. Show the normal
    // success screen without sending, so the bot gets no signal it was caught.
    if (botRef.current?.checked) {
      setSubmitted(true);
      return;
    }
    if (!ACCESS_KEY) {
      setError(`This form isn't configured yet. Please call us on ${site.phone.label}.`);
      return;
    }

    setSending(true);
    setError("");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `New quote request — ${data.moveType}`,
          from_name: `${site.name} website`,
          replyto: data.email,
          Name: data.name || "Not provided",
          Email: data.email,
          Phone: data.phone,
          "Move type": data.moveType,
          "Pickup date": data.date,
          "Pickup address": data.pickup,
          "Drop-off address": data.dropoff,
        }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok || !result.success) {
        throw new Error(result.message || `Request failed (${res.status})`);
      }
      setSubmitted(true);
    } catch {
      setError(
        `Sorry — we couldn't send your request just now. Please try again, or call us on ${site.phone.label}.`
      );
    } finally {
      setSending(false);
    }
  };

  const inputCls = hero
    ? `w-full rounded-full border-0 bg-white px-6 py-3.5 text-ink placeholder:text-ink-soft/70 focus:outline-none focus:ring-2 ${
        yellow || light
          ? "shadow-[0_2px_10px_-4px_rgba(20,33,42,0.25)] focus:ring-brand-dark/40"
          : "focus:ring-brand"
      }`
    : bds
      ? "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-navy placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
      : "w-full rounded-lg border border-surface-border bg-white px-4 py-3 text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30";

  if (submitted) {
    const doneWrap =
      variant === "card"
        ? "rounded-2xl bg-white p-8 text-center shadow-card"
        : variant === "hero"
          ? "rounded-2xl bg-white/95 p-8 text-center shadow-card"
          : "py-4 text-center";
    return (
      <div className={doneWrap}>
        <div
          className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
            bds ? "bg-success/15 text-success" : "bg-brand/20 text-ink-strong"
          }`}
        >
          <Icon name="check" size={34} strokeWidth={3} />
        </div>
        <h3 className="text-2xl font-extrabold text-ink-strong">Thank you, {data.name || "there"}!</h3>
        <p className="mt-2 text-ink-soft">
          Your quote request has been received. Our team will be in touch shortly with a tailored
          estimate.
        </p>
        <button
          onClick={() => {
            setData(initial);
            setStep(1);
            setSubmitted(false);
            setError("");
          }}
          className={`${bds ? "btn-yellow" : "btn-primary"} mt-6`}
        >
          Submit another request
        </button>
      </div>
    );
  }

  const submitBtn = (cls) => (
    <button
      type="submit"
      disabled={sending}
      className={`${cls} inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70`}
    >
      {sending && <Spinner />}
      {sending ? "Sending…" : "Request A Quote"}
    </button>
  );

  return (
    <div className={wrapperCls}>
      {/* Progress bar */}
      <div className="mb-5">
        <div
          className={`relative h-7 overflow-hidden rounded-full ${
            yellow ? "bg-black/10" : light ? "bg-surface-light" : hero ? "bg-white/40" : bds ? "bg-slate-100" : "bg-surface-light"
          }`}
        >
          <div
            className={`flex h-full items-center justify-end rounded-full pr-3 text-xs font-extrabold transition-all duration-300 ${
              yellow || light ? "bg-brand-dark text-white" : bds ? "bg-brand text-navy" : "bg-brand text-ink-strong"
            }`}
            style={{ width: `${pct}%` }}
          >
            {pct}%
          </div>
        </div>
      </div>

      <form ref={formRef} onSubmit={onSubmit}>
        {/* Spam honeypot — hidden from people and screen readers alike. */}
        <input
          ref={botRef}
          type="checkbox"
          name="botcheck"
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        {step === 1 && (
          <div className={hero ? "grid gap-4 sm:grid-cols-3" : "space-y-4"}>
            <Field hero={hero} bds={bds} cls={inputCls} label="Name" name="name" value={data.name} onChange={update("name")} placeholder="Name" />
            <Field hero={hero} bds={bds} cls={inputCls} label="Email" type="email" required name="email" value={data.email} onChange={update("email")} placeholder="Email*" />
            <Field hero={hero} bds={bds} cls={inputCls} label="Phone" type="tel" required name="phone" value={data.phone} onChange={update("phone")} placeholder="Phone*" pattern="[0-9+()\s.-]{6,}" title="Please enter a valid phone number." />
          </div>
        )}

        {step === 2 && (
          <div className={hero ? "grid gap-4 sm:grid-cols-3" : "space-y-4"}>
            <Field hero={hero} bds={bds} cls={inputCls} label="Pickup date" type="date" required name="date" value={data.date} onChange={update("date")} />
            <Field hero={hero} bds={bds} cls={inputCls} label="Pickup address" required name="pickup" value={data.pickup} onChange={update("pickup")} placeholder="Pickup Address*" />
            <Field hero={hero} bds={bds} cls={inputCls} label="Drop-off address" required name="dropoff" value={data.dropoff} onChange={update("dropoff")} placeholder="Drop-Off Address*" />
          </div>
        )}

        {step === 3 && (
          <div className={hero ? "grid items-end gap-4 sm:grid-cols-2" : "space-y-4"}>
            <div>
              {!hero && (
                <label className={`mb-1.5 block text-sm font-bold ${bds ? "text-navy" : "text-ink-strong"}`}>Move type</label>
              )}
              <select value={data.moveType} onChange={update("moveType")} className={inputCls} aria-label="Move type">
                {moveTypes.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            {hero && submitBtn(`${yellow || light ? "btn-dark" : "btn-primary"} w-full`)}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-left text-sm font-semibold text-red-800"
          >
            <Icon name="warning" size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Controls */}
        <div className={`mt-5 flex items-center gap-3 ${hero ? "justify-end" : ""}`}>
          {step > 1 && (
            <button
              type="button"
              onClick={back}
              disabled={sending}
              className={`${yellow || light ? "btn border-2 border-brand-dark bg-transparent text-brand-dark hover:bg-brand-dark hover:text-white" : hero ? "btn-dark" : bds ? "btn-navy-outline flex-1" : "btn-outline flex-1"} disabled:cursor-not-allowed disabled:opacity-70`}
            >
              Previous
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={next}
              className={yellow || light ? "btn-dark px-10" : hero ? "btn-primary px-10" : bds ? "btn-yellow flex-1" : "btn-primary flex-1"}
            >
              Next
            </button>
          ) : (
            !hero && submitBtn(`${bds ? "btn-yellow" : "btn-primary"} flex-1`)
          )}
        </div>
      </form>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function Field({ hero, bds, cls, label, type = "text", name, value, onChange, required, placeholder, pattern, title }) {
  return (
    <div>
      {!hero && (
        <label className={`mb-1.5 block text-sm font-bold ${bds ? "text-navy" : "text-ink-strong"}`}>{label}</label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        pattern={pattern}
        title={title}
        aria-label={label}
        className={cls}
      />
    </div>
  );
}
