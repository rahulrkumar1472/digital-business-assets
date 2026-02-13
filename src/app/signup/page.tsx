import { SignupForm } from "@/components/auth/signup-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ path: "/signup" });

export default function SignupPage() {
  return (
    <section className="mx-auto w-full max-w-2xl px-6 py-24 lg:px-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/45 p-6 md:p-8">
        <p className="text-xs font-semibold tracking-[0.15em] text-cyan-300 uppercase">Sign Up</p>
        <h1 className="mt-2 text-4xl font-semibold text-white md:text-5xl">Create your Business OS account</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-300">
          Choose your subscription tier and unlock dashboard access.
        </p>
        <SignupForm />
      </div>
    </section>
  );
}

