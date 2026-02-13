"use client";

import { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type LeadFormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  message: string;
};

type LeadCaptureFormProps = {
  className?: string;
  compact?: boolean;
};

type LeadFormErrors = Partial<Record<keyof LeadFormState, string>>;

const initialFormState: LeadFormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  website: "",
  message: "",
};

function validate(values: LeadFormState): LeadFormErrors {
  const errors: LeadFormErrors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[+()\d\s-]{7,20}$/;

  if (!values.name.trim()) {
    errors.name = "Please enter your full name.";
  }

  if (!values.email.trim() || !emailPattern.test(values.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!values.phone.trim() || !phonePattern.test(values.phone)) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (!values.company.trim()) {
    errors.company = "Please enter your company name.";
  }

  if (values.website.trim() && !/^https?:\/\//.test(values.website.trim())) {
    errors.website = "Website URL must start with http:// or https://.";
  }

  if (values.message.trim().length < 20) {
    errors.message = "Please share at least 20 characters about your goals.";
  }

  return errors;
}

export function LeadCaptureForm({ className, compact = false }: LeadCaptureFormProps) {
  const [form, setForm] = useState<LeadFormState>(initialFormState);
  const [errors, setErrors] = useState<LeadFormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fields = useMemo(
    () => [
      { name: "name", label: "Full name", type: "text", placeholder: "Alex Smith" },
      {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "alex@company.co.uk",
      },
      {
        name: "phone",
        label: "Phone",
        type: "tel",
        placeholder: "+44 7700 900123",
      },
      {
        name: "company",
        label: "Company",
        type: "text",
        placeholder: "Company name",
      },
      {
        name: "website",
        label: "Website",
        type: "text",
        placeholder: "https://yourwebsite.co.uk",
      },
    ] as const,
    [],
  );

  const handleInputChange = (field: keyof LeadFormState, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log("Lead capture submission", {
      ...form,
      submittedAt: new Date().toISOString(),
    });

    setSubmitted(true);
    setIsSubmitting(false);
    setForm(initialFormState);
    setErrors({});
  };

  if (submitted) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-cyan-500/30 bg-slate-950/60 p-8 text-center backdrop-blur",
          className,
        )}
      >
        <CheckCircle2 className="mx-auto size-10 text-cyan-300" />
        <h3 className="mt-4 text-2xl font-semibold text-white">Thanks, we received your request.</h3>
        <p className="mt-2 text-sm text-slate-300">
          Our team will send your free build plan and next-step recommendations shortly.
        </p>
        <Button
          variant="outline"
          className="mt-6 border-slate-700 bg-slate-900/70 text-slate-200 hover:bg-slate-800"
          onClick={() => setSubmitted(false)}
        >
          Submit another request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)} noValidate>
      <div className={cn("grid gap-4", compact ? "md:grid-cols-1" : "md:grid-cols-2")}>
        {fields.map((field) => {
          const value = form[field.name];
          const error = errors[field.name];

          return (
            <div key={field.name} className="space-y-2">
              <label
                htmlFor={field.name}
                className="text-xs font-semibold tracking-[0.08em] text-slate-300 uppercase"
              >
                {field.label}
              </label>
              <Input
                id={field.name}
                type={field.type}
                value={value}
                onChange={(event) => handleInputChange(field.name, event.target.value)}
                placeholder={field.placeholder}
                className="border-slate-700 bg-slate-950/50 text-slate-100 placeholder:text-slate-500"
              />
              {error ? <p className="text-xs text-red-300">{error}</p> : null}
            </div>
          );
        })}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="message"
          className="text-xs font-semibold tracking-[0.08em] text-slate-300 uppercase"
        >
          What do you need help with?
        </label>
        <Textarea
          id="message"
          rows={compact ? 4 : 6}
          value={form.message}
          onChange={(event) => handleInputChange("message", event.target.value)}
          placeholder="Tell us your goals, timeline, and current blockers."
          className="border-slate-700 bg-slate-950/50 text-slate-100 placeholder:text-slate-500"
        />
        {errors.message ? <p className="text-xs text-red-300">{errors.message}</p> : null}
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full bg-cyan-300 text-slate-950 hover:bg-cyan-200"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Get My Free Build Plan"}
      </Button>
      <p className="text-center text-xs text-slate-400">
        We do not sell your data. This form only logs locally while backend integration is pending.
      </p>
    </form>
  );
}
