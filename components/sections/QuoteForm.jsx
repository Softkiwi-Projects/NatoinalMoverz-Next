"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";

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
  // "panel" = card-style fields but no self-wrapping card (parent provides it).
  const wrapperCls = variant === "card" ? "rounded-2xl bg-white p-8 shadow-card" : "";
  const [step, setStep] = useState(1);
  const [data, setData] = useState(initial);
  const [submitted, setSubmitted] = useState(false);

  const update = (k) => (e) => setData((d) => ({ ...d, [k]: e.target.value }));
  const pct = [33, 66, 100][step - 1];
  const next = () => setStep((s) => Math.min(3, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));
  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputCls = hero
    ? `w-full rounded-full border-0 bg-white px-6 py-3.5 text-ink placeholder:text-ink-soft/70 focus:outline-none focus:ring-2 ${
        yellow || light
          ? "shadow-[0_2px_10px_-4px_rgba(20,33,42,0.25)] focus:ring-brand-dark/40"
          : "focus:ring-brand"
      }`
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
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand/20 text-ink-strong">
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
          }}
          className="btn-primary mt-6"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <div className={wrapperCls}>
      {/* Progress bar */}
      <div className="mb-5">
        <div
          className={`relative h-7 overflow-hidden rounded-full ${
            yellow ? "bg-black/10" : light ? "bg-surface-light" : hero ? "bg-white/40" : "bg-surface-light"
          }`}
        >
          <div
            className={`flex h-full items-center justify-end rounded-full pr-3 text-xs font-extrabold transition-all duration-300 ${
              yellow || light ? "bg-brand-dark text-white" : "bg-brand text-ink-strong"
            }`}
            style={{ width: `${pct}%` }}
          >
            {pct}%
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit}>
        {step === 1 && (
          <div className={hero ? "grid gap-4 sm:grid-cols-3" : "space-y-4"}>
            <Field hero={hero} cls={inputCls} label="Name" name="name" value={data.name} onChange={update("name")} placeholder="Name" />
            <Field hero={hero} cls={inputCls} label="Email" type="email" required name="email" value={data.email} onChange={update("email")} placeholder="Email*" />
            <Field hero={hero} cls={inputCls} label="Phone" type="tel" required name="phone" value={data.phone} onChange={update("phone")} placeholder="Phone*" />
          </div>
        )}

        {step === 2 && (
          <div className={hero ? "grid gap-4 sm:grid-cols-3" : "space-y-4"}>
            <Field hero={hero} cls={inputCls} label="Pickup date" type="date" required name="date" value={data.date} onChange={update("date")} />
            <Field hero={hero} cls={inputCls} label="Pickup address" required name="pickup" value={data.pickup} onChange={update("pickup")} placeholder="Pickup Address*" />
            <Field hero={hero} cls={inputCls} label="Drop-off address" required name="dropoff" value={data.dropoff} onChange={update("dropoff")} placeholder="Drop-Off Address*" />
          </div>
        )}

        {step === 3 && (
          <div className={hero ? "grid items-end gap-4 sm:grid-cols-2" : "space-y-4"}>
            <div>
              {!hero && <label className="mb-1.5 block text-sm font-bold text-ink-strong">Move type</label>}
              <select value={data.moveType} onChange={update("moveType")} className={inputCls} aria-label="Move type">
                {moveTypes.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            {hero && (
              <button type="submit" className={`${yellow || light ? "btn-dark" : "btn-primary"} w-full`}>
                Request A Quote
              </button>
            )}
          </div>
        )}

        {/* Controls */}
        <div className={`mt-5 flex items-center gap-3 ${hero ? "justify-end" : ""}`}>
          {step > 1 && (
            <button
              type="button"
              onClick={back}
              className={yellow || light ? "btn border-2 border-brand-dark bg-transparent text-brand-dark hover:bg-brand-dark hover:text-white" : hero ? "btn-dark" : "btn-outline flex-1"}
            >
              Previous
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={next}
              className={yellow || light ? "btn-dark px-10" : hero ? "btn-primary px-10" : "btn-primary flex-1"}
            >
              Next
            </button>
          ) : (
            !hero && (
              <button type="submit" className="btn-primary flex-1">
                Request A Quote
              </button>
            )
          )}
        </div>
      </form>
    </div>
  );
}

function Field({ hero, cls, label, type = "text", name, value, onChange, required, placeholder }) {
  return (
    <div>
      {!hero && <label className="mb-1.5 block text-sm font-bold text-ink-strong">{label}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        aria-label={label}
        className={cls}
      />
    </div>
  );
}
