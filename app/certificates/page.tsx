"use client";

import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  addedAt: string;
}

interface FormFields {
  name: string;
  issuer: string;
}

interface FormErrors {
  name?: string;
  issuer?: string;
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [form, setForm] = useState<FormFields>({ name: "", issuer: "" });
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): FormErrors {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = "Certificate name is required.";
    if (!form.issuer.trim()) newErrors.issuer = "Issuer is required.";
    return newErrors;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setCertificates((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: form.name.trim(),
        issuer: form.issuer.trim(),
        addedAt: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      },
    ]);
    setForm({ name: "", issuer: "" });
    setErrors({});
  }

  function handleDelete(id: string) {
    setCertificates((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="flex flex-col flex-1 items-center bg-gradient-to-b from-zinc-50 to-zinc-100 px-4 py-12 dark:from-zinc-950 dark:to-zinc-900">
      <div className="w-full max-w-xl">
        {/* Page Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.875V4.533zM12.75 20.625A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.092z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              My Certificates
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Track your professional certifications
            </p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            {certificates.length}
          </span>
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            {certificates.length === 1 ? "certificate added" : "certificates added"}
          </span>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="mb-5 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-zinc-500 dark:text-zinc-400">
              <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
            </svg>
            <h2 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
              Add New Certificate
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            <Input
              label="Certificate Name"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. AWS Certified Developer"
              error={errors.name}
              required
            />
            <Input
              label="Issuing Organization"
              id="issuer"
              name="issuer"
              value={form.issuer}
              onChange={handleChange}
              placeholder="e.g. Amazon Web Services"
              error={errors.issuer}
              required
            />
          </div>
          <div className="mt-6 flex gap-3">
            <Button type="submit">Add Certificate</Button>
            {(form.name || form.issuer) && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => { setForm({ name: "", issuer: "" }); setErrors({}); }}
              >
                Clear
              </Button>
            )}
          </div>
        </form>

        {/* Certificate List */}
        {certificates.length > 0 ? (
          <section className="mt-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              Your Certificates
            </h2>
            <ul className="flex flex-col gap-3">
              {certificates.map((cert) => (
                <li
                  key={cert.id}
                  className="group relative rounded-xl border border-zinc-200 bg-white px-5 py-4 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-zinc-600 dark:text-zinc-300">
                          <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-900 dark:text-zinc-50">{cert.name}</p>
                        <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                          {cert.issuer}
                        </p>
                        <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                          Added {cert.addedAt}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(cert.id)}
                      aria-label={`Remove ${cert.name}`}
                      className="mt-0.5 rounded-md p-1.5 text-zinc-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-950 dark:hover:text-red-400"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                        <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white/50 px-6 py-12 text-center dark:border-zinc-700 dark:bg-zinc-900/50">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-zinc-400">
                <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.875V4.533zM12.75 20.625A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.092z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">No certificates yet</p>
            <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">Add your first certificate using the form above</p>
          </div>
        )}
      </div>
    </div>
  );
}
