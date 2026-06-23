"use client";

import { useState, type FormEvent } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { sendToN8n } from "@/lib/n8n";

type Status = "idle" | "submitting" | "success" | "error";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  privacy: false,
  website: "",
};

export default function ContactForm() {
  const [values, setValues] = useState(initialState);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateField = <K extends keyof typeof initialState>(
    key: K,
    value: (typeof initialState)[K]
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Honeypot triggered – pretend success.
    if (values.website.trim()) {
      setStatus("success");
      setValues(initialState);
      return;
    }

    if (!EMAIL_PATTERN.test(values.email.trim())) {
      setStatus("error");
      setErrorMessage("Bitte geben Sie eine gültige E-Mail-Adresse an.");
      return;
    }

    setStatus("submitting");
    setErrorMessage(null);

    const result = await sendToN8n({
      source: "movein2stay-website",
      form: "kontakt",
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      subject: values.subject,
      message: values.message.trim(),
      privacy: values.privacy,
      pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
    });

    if (!result.ok) {
      setStatus("error");
      setErrorMessage(
        result.error === "NEXT_PUBLIC_N8N_WEBHOOK_URL is not configured"
          ? "Das Kontaktformular ist derzeit nicht konfiguriert. Bitte kontaktieren Sie uns per E-Mail."
          : "Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut."
      );
      return;
    }

    setStatus("success");
    setValues(initialState);
  };

  const isSubmitting = status === "submitting";

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vorname *
          </label>
          <input
            type="text"
            required
            value={values.firstName}
            onChange={(e) => updateField("firstName", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            placeholder="Max"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nachname *
          </label>
          <input
            type="text"
            required
            value={values.lastName}
            onChange={(e) => updateField("lastName", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            placeholder="Mustermann"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          E-Mail *
        </label>
        <input
          type="email"
          required
          value={values.email}
          onChange={(e) => updateField("email", e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          placeholder="max@beispiel.de"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Telefon
        </label>
        <input
          type="tel"
          value={values.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          placeholder="+49 123 456789"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Betreff *
        </label>
        <select
          required
          value={values.subject}
          onChange={(e) => updateField("subject", e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
        >
          <option value="">Bitte wählen...</option>
          <option value="anfrage">Allgemeine Anfrage</option>
          <option value="buchung">Buchungsanfrage</option>
          <option value="verfuegbarkeit">Verfügbarkeit prüfen</option>
          <option value="langfristig">Langfristige Vermietung</option>
          <option value="sonstiges">Sonstiges</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nachricht *
        </label>
        <textarea
          required
          rows={4}
          value={values.message}
          onChange={(e) => updateField("message", e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
          placeholder="Ihre Nachricht an uns..."
        />
      </div>

      {/* Honeypot – versteckt vor Nutzern, sichtbar für Bots. */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.website}
            onChange={(e) => updateField("website", e.target.value)}
          />
        </label>
      </div>

      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="privacy"
          required
          checked={values.privacy}
          onChange={(e) => updateField("privacy", e.target.checked)}
          className="mt-1"
        />
        <label htmlFor="privacy" className="text-sm text-gray-600">
          Ich habe die Datenschutzerklärung gelesen und stimme der Verarbeitung meiner Daten zu. *
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Wird gesendet...
          </>
        ) : (
          <>
            <Send size={20} />
            Nachricht senden
          </>
        )}
      </button>

      {status === "success" && (
        <div
          role="status"
          className="flex items-start gap-2 rounded-lg bg-green-50 border border-green-200 p-4 text-green-800"
        >
          <CheckCircle2 size={20} className="flex-shrink-0 mt-0.5" />
          <p className="text-sm">
            Vielen Dank! Ihre Nachricht wurde gesendet. Wir melden uns in der Regel innerhalb von 24 Stunden.
          </p>
        </div>
      )}

      {status === "error" && errorMessage && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-4 text-red-800"
        >
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}
    </form>
  );
}
