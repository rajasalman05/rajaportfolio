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

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
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

    // Template variables matching EmailJS
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
    <form onSubmit={handleSubmit} className="mt-10 space-y-5" noValidate>
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
  );
}