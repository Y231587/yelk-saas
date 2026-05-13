import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Prijzen", href: "/pricing" },
    { label: "Functies", href: "/#functies" },
    { label: "FAQ", href: "/faq" },
  ],
  bedrijf: [
    { label: "Over ons", href: "/over-ons" },
    { label: "Contact", href: "/contact" },
  ],
  juridisch: [
    { label: "Privacybeleid", href: "/privacy" },
    { label: "Algemene voorwaarden", href: "/voorwaarden" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="page-container py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-yelk-gradient">
                <span className="text-white font-bold text-sm">Y</span>
              </div>
              <span className="font-bold text-xl text-white">
                Yelk <span className="text-yelk-400">Finance</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Modern digitaal boekhoudplatform voor Nederlandse ondernemers.
              Veilig, schaalbaar en altijd inzicht in uw cijfers.
            </p>
            <div className="mt-6 space-y-2">
              <a
                href="mailto:info@yelkfinance.nl"
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4" />
                info@yelkfinance.nl
              </a>
              <a
                href="tel:+31000000000"
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4" />
                +31 (0)00 000 0000
              </a>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <MapPin className="h-4 w-4" />
                Nederland
              </div>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Bedrijf */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Bedrijf</h3>
            <ul className="space-y-3">
              {footerLinks.bedrijf.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Juridisch */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Juridisch</h3>
            <ul className="space-y-3">
              {footerLinks.juridisch.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Yelk Finance. Alle rechten voorbehouden.
          </p>
          <p className="text-xs text-slate-500">
            KvK: 00000000 · BTW: NL000000000B01
          </p>
        </div>
      </div>
    </footer>
  );
}
