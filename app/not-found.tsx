import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[100dvh] bg-[#000000] text-[#fafafa] flex flex-col justify-center px-6 sm:px-12 md:px-24 selection:bg-[#262626] selection:text-[#fafafa]">
      <div className="max-w-xl">
        <span className="type-caption !font-bold text-[#fafafa]/60 tracking-tight">(404 // ERROR)</span>
        <h1 className="mt-3 type-h1 text-[#fafafa]">
          Page Not Found
        </h1>
        <p className="mt-4 type-body text-[#fafafa]/80">
          The requested page could not be located in this editorial archive.
        </p>
        <div className="mt-8 pt-4 border-t border-[#262626]">
          <Link
            href="/"
            data-cursor="read"
            data-cursor-badge="Return"
            className="type-button text-[#fafafa]/80 hover:text-[#fafafa] !font-normal hover:!font-bold transition-all duration-200 uppercase focus:outline-none focus-visible:ring-1 focus-visible:ring-[#fafafa] rounded-sm"
          >
            ← Return to Index (Home)
          </Link>
        </div>
      </div>
    </main>
  );
}
