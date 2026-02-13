import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ path: "/login" });

export default function LoginPage() {
  return (
    <section className="mx-auto w-full max-w-2xl px-6 py-24 lg:px-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/45 p-6 md:p-8">
        <p className="text-xs font-semibold tracking-[0.15em] text-cyan-300 uppercase">Login</p>
        <h1 className="mt-2 text-4xl font-semibold text-white md:text-5xl">Access your Business OS dashboard</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-300">
          Log in to view reports, leads, and your next deployment actions.
        </p>
        <LoginForm />
        <p className="mt-4 text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-cyan-300 hover:text-cyan-200">
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
}

