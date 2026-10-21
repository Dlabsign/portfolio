import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[100dvh] bg-[#FAFAFA] text-[#2d2d2a] flex flex-col justify-center px-6 sm:px-12 md:px-24 selection:bg-[#bfe100] selection:text-[#2d2d2a]">
      <div className="max-w-xl">
        <span className="type-caption !font-bold text-[#e50319] tracking-tight">(404 // ERROR)</span>
        <h1 className="mt-3 type-h1 text-[#2d2d2a]">
          Page Not Found
        </h1>
        <p className="mt-4 type-body text-[#6e6e69]">
          The requested page could not be located in this editorial archive.
        </p>
        <div className="mt-8 pt-4 border-t border-[#E5E4E0]">
          <Link
            href="/"
            data-cursor="read"
            data-cursor-badge="Return"
            className="type-button text-[#2d2d2a] hover:text-[#e50319] transition-colors duration-200 uppercase focus:outline-none focus-visible:ring-1 focus-visible:ring-[#e50319] rounded-sm"
          >
            ← Return to Index (Home)
          </Link>
        </div>
      </div>
    </main>
  );
}
