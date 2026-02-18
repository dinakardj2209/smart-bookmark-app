export default function AuthCodeErrorPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-16">
      <div className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-balance text-2xl font-semibold tracking-tight text-zinc-900">
          Sign-in failed
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Something went wrong while finishing Google sign-in. Please try again.
        </p>
        <a
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          href="/"
        >
          Back to home
        </a>
      </div>
    </div>
  );
}

