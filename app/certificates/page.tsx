"use client";

import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";

interface Certificate {
  id: string;
  name: string;
  issuer: string;
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
      { id: crypto.randomUUID(), name: form.name.trim(), issuer: form.issuer.trim() },
    ]);
    setForm({ name: "", issuer: "" });
    setErrors({});
  }

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950">
      <div className="w-full max-w-lg">
        <h1 className="mb-8 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          My Certificates
        </h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          <h2 className="mb-5 text-lg font-medium text-zinc-800 dark:text-zinc-200">
            Add Certificate
          </h2>
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
              label="Issuer"
              id="issuer"
              name="issuer"
              value={form.issuer}
              onChange={handleChange}
              placeholder="e.g. Amazon Web Services"
              error={errors.issuer}
              required
            />
          </div>
          <div className="mt-6">
            <Button type="submit">Add Certificate</Button>
          </div>
        </form>

        {/* Certificate List */}
        {certificates.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-4 text-lg font-medium text-zinc-800 dark:text-zinc-200">
              Your Certificates ({certificates.length})
            </h2>
            <ul className="flex flex-col gap-3">
              {certificates.map((cert) => (
                <li
                  key={cert.id}
                  className="rounded-xl border border-zinc-200 bg-white px-5 py-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">{cert.name}</p>
                  <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                    Issued by {cert.issuer}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
