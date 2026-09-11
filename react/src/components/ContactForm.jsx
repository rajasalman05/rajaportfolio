import React, { useState } from "react";
import emailjs from "emailjs-com";

const SERVICE_OPTIONS = [
  { value: "Web Development", label: "Web Development" },
  { value: "UI/UX Design", label: "UI/UX Design" },
  { value: "E-commerce Solutions", label: "E-commerce Solutions" },
  { value: "Brand Identity", label: "Brand Identity" },
  { value: "Other", label: "Other" },
];

const initialForm = { name: "", email: "", service: "", message: "" };

export default function ContactSection() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.service) {
      setStatus("error");
      setErrorMsg("Please select a service.");
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    const SERVICE_ID = "service_17izr78";
    const TEMPLATE_ID = "template_2p7b588";
    const PUBLIC_KEY = "F-GytXONSKStqgc4n";

    const templateParams = {
      from_name: form.name,
      from_email: form.email,
      service: form.service,
      message: form.message,
    };

    emailjs
      .send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then(
        () => {
          setStatus("success");
          setForm(initialForm);
        },
        (err) => {
          console.error("EmailJS Error:", err);
          setStatus("error");
          setErrorMsg("Failed to send message. Please try again.");
        }
      );
  };

  return (
    <div className="grid lg:grid-cols-12 gap-10 items-start">
      {/* Left Column: Form */}
      <div className="lg:col-span-7">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="field">
              <label htmlFor="name" className="field-label">Name</label>
              <input
                id="name" name="name" type="text" required
                value={form.name} onChange={handleChange}
                className="field-input" placeholder="Your name"
              />
            </div>
            <div className="field">
              <label htmlFor="email" className="field-label">Email</label>
              <input
                id="email" name="email" type="email" required
                value={form.email} onChange={handleChange}
                className="field-input" placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="service" className="field-label">Service you need</label>
            <div className="relative">
              <select
                id="service" name="service" required
                value={form.service} onChange={handleChange}
                className="field-input appearance-none pr-10"
              >
                <option value="" disabled>Select a service</option>
                {SERVICE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-faint"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="field">
            <label htmlFor="message" className="field-label">Project details</label>
            <textarea
              id="message" name="message" rows="5" required
              value={form.message} onChange={handleChange}
              className="field-input resize-none"
              placeholder="What are you building, and what's your timeline?"
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="btn-magnetic w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full
                       bg-grad-primary text-ink font-semibold px-8 py-3.5 text-sm shadow-glow-teal
                       hover:shadow-[0_0_55px_-6px_rgba(45,212,196,.6)] transition-all duration-300 disabled:opacity-60"
          >
            {status === "sending" ? "Sending…" : "Send message"}
          </button>

          {status === "success" && (
            <p className="text-sm mt-2 text-brand-teal">Message sent — I'll reply within a day.</p>
          )}
          {status === "error" && (
            <p className="text-sm mt-2 text-red-400">{errorMsg}</p>
          )}
        </form>
      </div>

      {/* Right Column: Information Cards */}
      <div className="lg:col-span-5 space-y-4">
        {/* Email Box */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
          <span className="text-xs text-slate-400 font-mono uppercase tracking-wider block mb-1">
            EMAIL
          </span>
          <a
            href="mailto:rajasalman044164@gmail.com"
            className="text-slate-100 hover:text-cyan-400 transition-colors font-medium text-base sm:text-lg block"
          >
            rajasalman044164@gmail.com
          </a>
        </div>

        {/* WhatsApp Box */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
          <span className="text-xs text-slate-400 font-mono uppercase tracking-wider block mb-1">
            WHATSAPP
          </span>
          <a
            href="https://wa.me/923710282405"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-100 hover:text-cyan-400 transition-colors font-medium text-base sm:text-lg block"
          >
            Chat directly
          </a>
        </div>

        {/* Elsewhere / Socials Box */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
          <span className="text-xs text-slate-400 font-mono uppercase tracking-wider block mb-3">
            ELSEWHERE
          </span>
          <div className="flex items-center gap-5">
            {/* GitHub Button */}
            <a
              href="https://github.com/rajasalman05"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-800/80 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition-all text-xl"
              aria-label="GitHub Profile"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>

            {/* LinkedIn Button */}
            <a
              href="https://www.linkedin.com/in/rajasalmannadeem/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-800/80 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition-all text-xl"
              aria-label="LinkedIn Profile"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}