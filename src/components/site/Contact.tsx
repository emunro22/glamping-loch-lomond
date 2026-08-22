"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { site, pods } from "@/data/site";
import { cn } from "@/lib/utils";
import { LocationMap } from "./LocationMap";

type Status = "idle" | "sending" | "sent" | "error";

const inputClass =
  "w-full rounded-xl border border-oat-50/20 bg-oat-50/5 px-4 py-3 text-sm text-oat-50 placeholder:text-oat-100/35 outline-none transition-colors focus:border-lamp-400 [color-scheme:dark]";

const labelClass = "eyebrow mb-2 block text-oat-100/50";

export function Contact({ heading, body }: { heading: string; body: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error ?? "That didn't send. Try again in a moment.");
      }

      form.reset();
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <section id="contact" className="on-dark relative overflow-hidden bg-loch-900 py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-lamp-500/10 blur-[110px]"
      />

      <div className="container-page relative grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <p className="eyebrow mb-4 text-lamp-400">Get in touch</p>
          <h2 className="text-balance text-3xl leading-[1.1] text-oat-50 sm:text-4xl md:text-5xl">
            {heading}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-oat-100/70">{body}</p>

          <dl className="mt-10 space-y-6">
            <div>
              <dt className="eyebrow mb-2 text-oat-100/45">Call or text</dt>
              <dd>
                <a
                  href={site.phoneHref}
                  className="font-display text-2xl text-oat-50 transition-colors hover:text-lamp-400"
                >
                  {site.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow mb-2 text-oat-100/45">Email</dt>
              <dd>
                <a
                  href={`mailto:${site.email}`}
                  className="text-oat-100/80 transition-colors hover:text-lamp-400"
                >
                  {site.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow mb-2 text-oat-100/45">Find us</dt>
              <dd className="text-oat-100/80">
                {site.address.line1}, {site.address.line2}
                <br />
                {site.address.region}, {site.address.postcode}
              </dd>
            </div>
          </dl>

          <LocationMap tone="dark" className="mt-10" />
        </div>

        <div className="rounded-[2rem] border border-oat-50/12 bg-loch-950/40 p-6 backdrop-blur-md sm:p-8">
          <AnimatePresence mode="wait">
            {status === "sent" ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid min-h-[26rem] place-items-center text-center"
              >
                <div>
                  <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full bg-lamp-500/15 text-lamp-400">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M4 12.5l5 5L20 6.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl text-oat-50">Message sent</h3>
                  <p className="mt-3 text-oat-100/70">
                    We&rsquo;ll come back to you within a day. If it&rsquo;s
                    urgent, give us a ring on {site.phone}.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="mt-8 text-sm text-lamp-400 underline underline-offset-4"
                  >
                    Send another message
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={onSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-5"
              >
                {/* Honeypot — bots fill it, people never see it */}
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute h-0 w-0 opacity-0"
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor="name">
                      Your name
                    </label>
                    <input
                      id="name"
                      name="name"
                      required
                      maxLength={80}
                      className={inputClass}
                      placeholder="Jane MacLeod"
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className={inputClass}
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor="phone">
                      Phone <span className="normal-case tracking-normal">(optional)</span>
                    </label>
                    <input id="phone" name="phone" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="pod">
                      Pod
                    </label>
                    <select id="pod" name="pod" className={cn(inputClass, "appearance-none")}>
                      <option value="">Not sure yet</option>
                      {pods.map((p) => (
                        <option key={p.slug} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  <div>
                    <label className={labelClass} htmlFor="arrival">
                      Arriving
                    </label>
                    <input id="arrival" name="arrival" type="date" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="departure">
                      Leaving
                    </label>
                    <input id="departure" name="departure" type="date" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="guests">
                      Guests
                    </label>
                    <input
                      id="guests"
                      name="guests"
                      type="number"
                      min={1}
                      max={4}
                      defaultValue={2}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass} htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    maxLength={2000}
                    className={cn(inputClass, "resize-none")}
                    placeholder="Anything you'd like to ask — the BBQ hut, bringing a dog, arrival times."
                  />
                </div>

                {status === "error" ? (
                  <p className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full rounded-full bg-lamp-500 px-6 py-4 text-sm font-semibold text-loch-950 transition-all hover:bg-lamp-400 hover:shadow-glow disabled:opacity-60"
                >
                  {status === "sending" ? "Sending…" : "Send message"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
