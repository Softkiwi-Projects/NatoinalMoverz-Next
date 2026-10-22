"use client";

import { useRef, useState } from "react";
import { site } from "@/data/site";

// Backend API endpoint for contact and quote submissions (Google SMTP + Rate Limiting)
const BACKEND_API_URL = process.env.NEXT_PUBLIC_CONTACT_API_URL || "http://localhost:5000/api/contact";
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

const MOVE_CATEGORIES = [
  { label: "Home / Flat", icon: "home" },
  { label: "Office", icon: "office" },
  { label: "Apartment", icon: "apartment" },
  { label: "Items Only", icon: "package" },
  { label: "Long Distance", icon: "map-pinned" },
  { label: "Senior Move", icon: "heart-handshake" },
  { label: "WINZ Move", icon: "file-check" },
  { label: "Backload", icon: "truck" },
];

const BEDROOM_OPTIONS = [
  "Studio / 1 Bedroom",
  "2 Bedrooms",
  "3 Bedrooms",
  "4 Bedrooms",
  "5+ Bedrooms",
];

const OFFICE_SIZE_OPTIONS = [
  "1–5 staff",
  "6–15 staff",
  "16–30 staff",
  "30+ staff",
];

const initialData = {
  category: "Home / Flat",
  pickup: "",
  dropoff: "",
  date: "",
  bedrooms: "",
  officeSize: "",
  items: "",
  name: "",
  email: "",
  phone: "",
  heavyItems: "",
  termsAccepted: true,
};

export default function QuoteForm({
  title = "Get Your Free Quote",
  className = "",
  variant = "card",
  showHeader,
  defaultCategory,
}) {
  const botRef = useRef(null);
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    ...initialData,
    category: defaultCategory || initialData.category,
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // If showHeader is not explicitly passed, hide it when rendered inside an existing parent title (e.g. yellow hero card)
  const isEmbedded = variant === "yellow" || variant === "panel" || variant === "hero";
  const shouldShowHeader = showHeader !== undefined ? showHeader : !isEmbedded;

  const update = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const isOffice = data.category === "Office";
  const isItemsOnly = data.category === "Items Only";
  const isStandardBedrooms = !isOffice && !isItemsOnly;

  // Validate Step 2 before advancing
  const validateStep2 = () => {
    const newErrors = {};
    if (!data.pickup.trim()) {
      newErrors.pickup = "Please enter your pickup location";
    }
    if (!data.dropoff.trim()) {
      newErrors.dropoff = "Please enter your drop location";
    }
    if (!data.date) {
      newErrors.date = "Please select your move date";
    }
    if (isStandardBedrooms && !data.bedrooms) {
      newErrors.bedrooms = "Please select number of bedrooms";
    }
    if (isOffice && !data.officeSize) {
      newErrors.officeSize = "Please select office size";
    }
    if (isItemsOnly && !data.items.trim()) {
      newErrors.items = "Please enter what you are moving";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate Step 3 before submission
  const validateStep3 = () => {
    const newErrors = {};
    if (!data.name.trim()) {
      newErrors.name = "Please enter your name";
    } else if (data.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!data.email.trim()) {
      newErrors.email = "Please enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (!data.phone.trim()) {
      newErrors.phone = "Please enter your phone number";
    } else if (!/^[0-9+()\s-]{6,}$/.test(data.phone.trim())) {
      newErrors.phone = "Enter a valid phone number";
    }

    if (!data.termsAccepted) {
      newErrors.terms = "Please accept the Booking Terms & Conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep1 = () => {
    setErrors({});
    setStep(2);
  };

  const handleNextStep2 = () => {
    if (validateStep2()) {
      setErrors({});
      setStep(3);
    }
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;

    if (!validateStep3()) {
      return;
    }

    // Bot honeypot check
    if (botRef.current?.checked) {
      setSubmitted(true);
      return;
    }

    setSending(true);
    setErrors({});

    const formattedMessage = [
      `Category: ${data.category}`,
      isOffice
        ? `Office Size: ${data.officeSize}`
        : isItemsOnly
          ? `Items: ${data.items}`
          : `Bedrooms: ${data.bedrooms}`,
      `Pickup Date: ${data.date}`,
      `Pickup Location: ${data.pickup}`,
      `Drop Location: ${data.dropoff}`,
      data.heavyItems ? `Extra Heavy Items: ${data.heavyItems}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const payload = {
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      category: data.category,
      moveType: data.category,
      pickup: data.pickup.trim(),
      dropoff: data.dropoff.trim(),
      date: data.date,
      bedrooms: isStandardBedrooms ? data.bedrooms : null,
      officeSize: isOffice ? data.officeSize : null,
      items: isItemsOnly ? data.items.trim() : null,
      heavyItems: data.heavyItems.trim() || null,
      termsAccepted: data.termsAccepted,
      message: formattedMessage,
      botcheck: false,
    };

    try {
      const res = await fetch(BACKEND_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json().catch(() => ({}));

      if (res.status === 429) {
        throw new Error(result.error || "Too many requests. Please wait a few minutes before trying again.");
      }

      if (!res.ok || !result.success) {
        const errMsg =
          result.error ||
          result.message ||
          (result.details && result.details[0]?.message) ||
          `Request failed (${res.status})`;
        throw new Error(errMsg);
      }

      setSubmitted(true);
    } catch (err) {
      // Fallback to Web3Forms if configured and fetch failed
      if (WEB3FORMS_KEY && err.message?.includes("fetch")) {
        try {
          const fallbackRes = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
              access_key: WEB3FORMS_KEY,
              subject: `New quote request — ${data.category} (${data.name})`,
              from_name: `${site.name} website`,
              replyto: data.email,
              Name: data.name,
              Email: data.email,
              Phone: data.phone,
              Category: data.category,
              "Move Details": isOffice ? data.officeSize : isItemsOnly ? data.items : data.bedrooms,
              "Pickup Location": data.pickup,
              "Drop Location": data.dropoff,
              "Move Date": data.date,
              "Extra Heavy Items": data.heavyItems || "None",
              "Terms Accepted": data.termsAccepted ? "Yes" : "No",
            }),
          });
          const fbResult = await fallbackRes.json().catch(() => ({}));
          if (fallbackRes.ok && fbResult.success) {
            setSubmitted(true);
            return;
          }
        } catch {
          // Fall through to display error
        }
      }

      setErrors({
        form:
          err.message ||
          `Sorry — we couldn't send your request just now. Please try again or call 0800 600 003.`,
      });
    } finally {
      setSending(false);
    }
  };

  const resetForm = () => {
    setData({
      ...initialData,
      category: defaultCategory || initialData.category,
    });
    setErrors({});
    setStep(1);
    setSubmitted(false);
  };

  const progressPercent = (step / 3) * 100;

  return (
    <div
      className={`overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 ${className}`}
    >
      {/* Top Header Strip */}
      {shouldShowHeader ? (
        <div className="bg-[#0b1f4d] px-5 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-white">{title}</h2>
            <span className="shrink-0 rounded-full bg-[#e11d2e] px-2.5 py-1 text-xs font-semibold text-white">
              3 quick steps
            </span>
          </div>
          <p className="mt-1 text-sm text-white/70">
            60 seconds · No obligation · Response within 2 hours
          </p>

          {/* Progress Bar Track & Fill */}
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-[#e11d2e] transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="mt-2 text-xs font-medium text-white/60">
            Step {step} of 3
          </p>
        </div>
      ) : (
        <div className="border-b border-slate-100 px-5 pt-5 pb-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
            <span>Step {step} of 3</span>
            <span className="text-[#e11d2e] font-extrabold">{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#e11d2e] transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {submitted ? (
        <div className="flex flex-col items-center justify-center p-8 text-center" role="status">
          <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <svg
              className="size-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-[#0b1f4d]">Quote request received!</h3>
          <p className="mt-2 text-pretty text-slate-600">
            Thanks{data.name ? `, ${data.name}` : ""} — our Tauranga team will be in touch shortly, usually within 2 hours.
          </p>
          <button
            type="button"
            onClick={resetForm}
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#e11d2e] px-6 text-sm font-bold text-white hover:bg-[#c71827] transition-colors shadow-sm"
          >
            Submit another request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="p-5 sm:p-6">
          {/* Honeypot for bots */}
          <input
            ref={botRef}
            type="checkbox"
            name="botcheck"
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          {/* ================= STEP 1: WHAT ARE YOU MOVING? ================= */}
          {step === 1 && (
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                What are you moving?
              </p>

              <div className="grid grid-cols-3 gap-2.5">
                {MOVE_CATEGORIES.map((cat) => {
                  const isSelected = data.category === cat.label;
                  return (
                    <button
                      key={cat.label}
                      type="button"
                      onClick={() => setData((prev) => ({ ...prev, category: cat.label }))}
                      className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 text-center transition-all ${
                        isSelected
                          ? "border-[#e11d2e] bg-[#fef2f2] text-[#0b1f4d] shadow-sm ring-1 ring-[#e11d2e]/30"
                          : "border-slate-200 bg-white text-slate-700 hover:border-[#e11d2e]/40 hover:bg-slate-50/80"
                      }`}
                      aria-pressed={isSelected}
                    >
                      <CategoryIcon
                        name={cat.icon}
                        className={`size-5 transition-colors ${
                          isSelected ? "text-[#e11d2e]" : "text-[#0b1f4d]"
                        }`}
                      />
                      <span className="text-xs font-semibold leading-tight text-[#0b1f4d]">
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleNextStep1}
                className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#e11d2e] text-base font-bold text-white shadow-sm hover:bg-[#c71827] transition-colors"
              >
                <span>Next — Moving Details</span>
                <ArrowRightIcon className="size-4" />
              </button>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-slate-500">
                <LockIcon className="size-3.5 text-slate-400" />
                <span>Your details are private & never shared</span>
              </div>
            </div>
          )}

          {/* ================= STEP 2: MOVE DETAILS ================= */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                {isOffice
                  ? "Office move details"
                  : isItemsOnly
                    ? "Item move details"
                    : "Move details"}
              </p>

              <div className="flex flex-col gap-3">
                {/* Pickup Location */}
                <FormField label="Pickup location" required error={errors.pickup}>
                  <input
                    type="text"
                    name="pickup"
                    value={data.pickup}
                    onChange={update("pickup")}
                    placeholder="e.g. Tauranga Central"
                    className={`h-12 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:ring-2 ${
                      errors.pickup
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-200 focus:border-[#e11d2e] focus:ring-[#e11d2e]/20"
                    }`}
                  />
                </FormField>

                {/* Drop Location */}
                <FormField label="Drop location" required error={errors.dropoff}>
                  <input
                    type="text"
                    name="dropoff"
                    value={data.dropoff}
                    onChange={update("dropoff")}
                    placeholder="e.g. Mount Maunganui"
                    className={`h-12 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:ring-2 ${
                      errors.dropoff
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-200 focus:border-[#e11d2e] focus:ring-[#e11d2e]/20"
                    }`}
                  />
                </FormField>
              </div>

              {/* Move Date & Category Specific Field */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Move Date */}
                <FormField label="Move date" required error={errors.date}>
                  <input
                    type="date"
                    name="date"
                    value={data.date}
                    onChange={update("date")}
                    className={`h-12 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900 outline-none transition-all focus:ring-2 ${
                      errors.date
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-200 focus:border-[#e11d2e] focus:ring-[#e11d2e]/20"
                    }`}
                  />
                </FormField>

                {/* Dynamic Field: Bedrooms / Office Size / Items */}
                {isStandardBedrooms && (
                  <FormField label="Number of bedrooms" required error={errors.bedrooms}>
                    <select
                      name="bedrooms"
                      value={data.bedrooms}
                      onChange={update("bedrooms")}
                      className={`h-12 w-full rounded-xl border bg-white px-3 text-sm text-slate-900 outline-none transition-all focus:ring-2 ${
                        errors.bedrooms
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "border-slate-200 focus:border-[#e11d2e] focus:ring-[#e11d2e]/20"
                      }`}
                    >
                      <option value="" disabled>
                        Select...
                      </option>
                      {BEDROOM_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </FormField>
                )}

                {isOffice && (
                  <FormField label="Office size" required error={errors.officeSize}>
                    <select
                      name="officeSize"
                      value={data.officeSize}
                      onChange={update("officeSize")}
                      className={`h-12 w-full rounded-xl border bg-white px-3 text-sm text-slate-900 outline-none transition-all focus:ring-2 ${
                        errors.officeSize
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "border-slate-200 focus:border-[#e11d2e] focus:ring-[#e11d2e]/20"
                      }`}
                    >
                      <option value="" disabled>
                        Select...
                      </option>
                      {OFFICE_SIZE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </FormField>
                )}

                {isItemsOnly && (
                  <FormField label="What are you moving?" required error={errors.items}>
                    <input
                      type="text"
                      name="items"
                      value={data.items}
                      onChange={update("items")}
                      placeholder="e.g. fridge, sofa, 10 boxes"
                      className={`h-12 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:ring-2 ${
                        errors.items
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "border-slate-200 focus:border-[#e11d2e] focus:ring-[#e11d2e]/20"
                      }`}
                    />
                  </FormField>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-1 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <ArrowLeftIcon className="size-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextStep2}
                  className="flex h-12 flex-[2] items-center justify-center gap-2 rounded-xl bg-[#e11d2e] text-base font-bold text-white shadow-sm hover:bg-[#c71827] transition-colors"
                >
                  <span>Next — Personal</span>
                  <ArrowRightIcon className="size-4" />
                </button>
              </div>

              <div className="mt-2 flex items-center justify-center gap-1.5 text-center text-xs text-slate-500">
                <LockIcon className="size-3.5 text-slate-400" />
                <span>Your details are private & never shared</span>
              </div>
            </div>
          )}

          {/* ================= STEP 3: PERSONAL DETAILS ================= */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              {/* Name & Email Row */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FormField label="Name" required error={errors.name}>
                  <input
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={update("name")}
                    placeholder="Your full name"
                    autoComplete="name"
                    className={`h-12 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:ring-2 ${
                      errors.name
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-200 focus:border-[#e11d2e] focus:ring-[#e11d2e]/20"
                    }`}
                  />
                </FormField>

                <FormField label="Email" required error={errors.email}>
                  <input
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={update("email")}
                    placeholder="your@email.com"
                    autoComplete="email"
                    className={`h-12 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:ring-2 ${
                      errors.email
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-200 focus:border-[#e11d2e] focus:ring-[#e11d2e]/20"
                    }`}
                  />
                </FormField>
              </div>

              {/* Phone */}
              <FormField label="Phone no." required error={errors.phone}>
                <input
                  type="tel"
                  name="phone"
                  value={data.phone}
                  onChange={update("phone")}
                  placeholder="Your phone number"
                  autoComplete="tel"
                  className={`h-12 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:ring-2 ${
                    errors.phone
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-200 focus:border-[#e11d2e] focus:ring-[#e11d2e]/20"
                  }`}
                />
              </FormField>

              {/* Extra Heavy Items */}
              <FormField label="Extra heavy items" optional>
                <input
                  type="text"
                  name="heavyItems"
                  value={data.heavyItems}
                  onChange={update("heavyItems")}
                  placeholder="e.g. Piano, Spa pool"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-[#e11d2e] focus:ring-2 focus:ring-[#e11d2e]/20"
                />
              </FormField>

              {/* Terms Checkbox */}
              <div className="flex flex-col gap-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={data.termsAccepted}
                    onChange={update("termsAccepted")}
                    className="mt-0.5 size-4 rounded border-slate-300 accent-[#e11d2e] text-[#e11d2e] focus:ring-[#e11d2e]"
                  />
                  <span className="text-xs leading-relaxed text-slate-600">
                    I accept the{" "}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowTermsModal(true);
                      }}
                      className="font-semibold text-[#0b1f4d] underline-offset-2 hover:underline"
                    >
                      Booking Terms & Conditions
                    </button>
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-xs text-red-600">{errors.terms}</p>
                )}
              </div>

              {/* General Form Error Banner */}
              {errors.form && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-800"
                >
                  {errors.form}
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-1 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={sending}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <ArrowLeftIcon className="size-4" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="flex h-12 flex-[2] items-center justify-center gap-2 rounded-xl bg-[#e11d2e] text-base font-bold text-white shadow-sm hover:bg-[#c71827] transition-colors disabled:cursor-not-allowed disabled:opacity-75"
                >
                  {sending ? (
                    <>
                      <Spinner />
                      <span>Sending…</span>
                    </>
                  ) : (
                    <span>Get My Free Quote</span>
                  )}
                </button>
              </div>

              <div className="mt-2 flex items-center justify-center gap-1.5 text-center text-xs text-slate-500">
                <LockIcon className="size-3.5 text-slate-400" />
                <span>Your details are private & never shared</span>
              </div>
            </div>
          )}
        </form>
      )}

      {/* Booking Terms & Conditions Modal */}
      {showTermsModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setShowTermsModal(false)}
        >
          <div
            className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-[#0b1f4d]">
                Booking Terms & Conditions
              </h3>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                <CloseIcon className="size-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs leading-relaxed text-slate-600">
              <p>
                <strong>1. Quotes & Pricing:</strong> All estimates provided are based on the move details and inventory supplied. Unforeseen access difficulties or heavy item additions may require adjustment.
              </p>
              <p>
                <strong>2. Care & Transit:</strong> Our professional team uses specialized blankets, ties, and equipment to secure and safeguard your furniture throughout the move.
              </p>
              <p>
                <strong>3. Heavy & Delicate Items:</strong> Pianos, spa pools, billiard tables, and extra-heavy goods require advance notice to ensure proper vehicle allocation and specialized equipment.
              </p>
              <p>
                <strong>4. Cancellations:</strong> We kindly request at least 48 hours notice for schedule changes or cancellations to accommodate all clients efficiently.
              </p>
              <p>
                <strong>5. Privacy Commitment:</strong> Your personal contact information is kept strictly confidential and used solely to fulfill your moving quotation.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowTermsModal(false)}
              className="mt-6 w-full rounded-xl bg-[#0b1f4d] py-2.5 text-xs font-bold text-white hover:bg-[#14285c] transition-colors"
            >
              Close & Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FormField({ label, required, optional, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold uppercase tracking-wide text-slate-600">
        {label}
        {required && <span className="text-[#e11d2e]"> *</span>}
        {optional && <span className="font-normal lowercase text-slate-400"> (optional)</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="size-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function ArrowRightIcon({ className = "size-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function ArrowLeftIcon({ className = "size-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function LockIcon({ className = "size-3.5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function CloseIcon({ className = "size-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function CategoryIcon({ name, className = "size-5" }) {
  switch (name) {
    case "home":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
          <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </svg>
      );
    case "office":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          <rect width="20" height="14" x="2" y="6" rx="2" />
        </svg>
      );
    case "apartment":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
          <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
          <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
          <path d="M10 6h4" />
          <path d="M10 10h4" />
          <path d="M10 14h4" />
          <path d="M10 18h4" />
        </svg>
      );
    case "package":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
          <path d="M12 22V12" />
          <polyline points="3.29 7 12 12 20.71 7" />
          <path d="m7.5 4.27 9 5.15" />
        </svg>
      );
    case "map-pinned":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 8c0 3.613-3.8 7.428-5.35 8.82a1 1 0 0 1-1.3 0C9.8 15.428 6 11.613 6 8a6 6 0 0 1 12 0" />
          <circle cx="12" cy="8" r="2" />
          <path d="M8.7 14A8.051 8.051 0 0 0 4 20" />
          <path d="M15.3 14A8.051 8.051 0 0 1 20 20" />
        </svg>
      );
    case "heart-handshake":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      );
    case "file-check":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          <path d="m3 15 2 2 4-4" />
        </svg>
      );
    case "truck":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
          <path d="M15 18H9" />
          <path d="M19 18h2a1 1 0 0 0 1-1v-5l-4-4h-3v10h1" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="17" cy="18" r="2" />
        </svg>
      );
    default:
      return null;
  }
}
