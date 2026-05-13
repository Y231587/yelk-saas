import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="p-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-yelk-gradient">
            <span className="text-white font-bold text-sm">Y</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">
            Yelk <span className="text-yelk-500">Finance</span>
          </span>
        </Link>
      </header>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </div>
    </div>
  );
}
