"use client";

import { useState } from "react";

// "Leave a Reply" form, mirroring the original WordPress comment form.
// Static site: submissions are acknowledged locally (no backend yet).
export default function CommentForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="rounded-2xl bg-surface-muted p-8 text-center" role="status">
        <h3 className="text-xl font-extrabold text-ink-strong">Thanks for your comment!</h3>
        <p className="mt-2 text-ink-soft">It has been received and is awaiting moderation.</p>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-lg border border-surface-border bg-white px-4 py-3 text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <h2 className="text-2xl font-extrabold text-ink-strong">Leave a Reply</h2>
      <p className="mb-6 mt-2 text-sm text-ink-soft">
        Your email address will not be published. Required fields are marked *
      </p>

      <div className="space-y-5">
        <textarea
          name="comment"
          rows={6}
          required
          placeholder="Comment*"
          aria-label="Comment"
          className={inputCls}
        />
        <div className="grid gap-5 sm:grid-cols-3">
          <input type="text" name="name" required placeholder="Name*" aria-label="Name" className={inputCls} />
          <input type="email" name="email" required placeholder="Email*" aria-label="Email" className={inputCls} />
          <input type="url" name="website" placeholder="Website" aria-label="Website" className={inputCls} />
        </div>
        <label className="flex items-start gap-3 text-sm text-ink-soft">
          <input type="checkbox" name="save" className="mt-1 h-4 w-4 accent-brand" />
          Save my name, email, and website in this browser for the next time I comment.
        </label>
        <button type="submit" className="btn-primary">
          Post Comment
        </button>
      </div>
    </form>
  );
}
