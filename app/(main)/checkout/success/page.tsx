import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-6 py-20">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-10 text-center shadow-xl">
        <span className="text-primary mb-4 block text-xs font-bold tracking-[0.2em] uppercase">
          Booking Complete
        </span>
        <h1 className="font-headline text-on-surface text-4xl font-extrabold tracking-tight md:text-5xl">
          Your order has been created successfully
        </h1>
        <p className="text-outline mx-auto mt-6 max-w-xl text-base leading-7">
          We have received your booking request. You can continue browsing services or head back
          to the home page while we take it from here.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="bg-primary text-white inline-flex min-w-40 justify-center rounded-full px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
          >
            Go home
          </Link>
          <Link
            href="/services"
            className="text-on-surface inline-flex min-w-40 justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold transition-colors hover:bg-slate-50"
          >
            View services
          </Link>
        </div>
      </div>
    </section>
  );
}
