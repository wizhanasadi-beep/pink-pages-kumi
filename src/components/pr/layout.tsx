import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const LIENS = [
  { to: "/", label: "Accueil", emoji: "☎" },
  { to: "/annuaire", label: "Annuaire", emoji: "📖" },
  { to: "/carte", label: "Carte", emoji: "📍" },
  { to: "/categories", label: "Rubriques", emoji: "✦" },
] as const;

export function Masthead({ compact = false }: { compact?: boolean }) {
  return (
    <header className="border-b border-border bg-papier">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="group flex items-baseline gap-2">
          <span
            className={cn(
              "logo-pages-roses text-rose",
              compact ? "text-2xl" : "text-2xl sm:text-3xl",
            )}
          >
            Les Pages Roses
          </span>
          <span className="label-annonce hidden text-bordeaux sm:inline">L'annuaire des Kumi</span>
        </Link>
        <nav className="hidden items-center gap-4 sm:flex">
          {LIENS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="rubrique text-sm hover:text-rose"
              activeProps={{ className: "text-rose underline decoration-2 underline-offset-4" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/referencer"
            className="label-annonce border border-border bg-jaune px-3 py-1.5 shadow-sm transition-transform hover:-translate-y-0.5"
          >
            + Référencer
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-papier sm:hidden">
      <ul className="mx-auto flex max-w-lg items-stretch">
        {LIENS.map((l) => (
          <li key={l.to} className="flex-1">
            <Link
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="label-annonce flex flex-col items-center gap-0.5 py-2.5"
              activeProps={{ className: "bg-poudre text-bordeaux" }}
            >
              <span aria-hidden className="text-base">
                {l.emoji}
              </span>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function FabReferencer() {
  return (
    <Link
      to="/referencer"
      className="label-annonce fixed bottom-20 right-4 z-40 flex items-center gap-1 border border-border bg-rose px-3 py-2 text-rose-foreground shadow-sm sm:hidden"
    >
      + Référencer
    </Link>
  );
}

export function PiedDePage() {
  return (
    <footer className="mt-14 border-t border-border bg-poudre">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <p className="logo-pages-roses text-xl text-bordeaux">Les Pages Roses</p>
        <p className="label-annonce mt-1">L'annuaire des Kumi · Édition {new Date().getFullYear()}</p>
        <p className="mt-4 max-w-md text-sm">
          Les bonnes adresses des Kumi, réunies au même endroit. Aucune adresse personnelle n'est
          publiée : seules les villes, quartiers et zones de déplacement apparaissent. 💗
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/annuaire"
            search={{ q: "", cat: "", dep: "", ville: "" }}
            className="rubrique text-sm underline decoration-2 underline-offset-4">
            Feuilleter l'annuaire
          </Link>
          <Link to="/referencer" className="rubrique text-sm underline decoration-2 underline-offset-4">
            Référencer mon activité
          </Link>
          <Link to="/admin" className="rubrique text-sm underline decoration-2 underline-offset-4">
            Espace rédaction
          </Link>
        </div>
      </div>
    </footer>
  );
}

export function PageMagazine({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Masthead />
      <main className={cn("mx-auto w-full max-w-5xl flex-1 px-4 pb-28 pt-6 sm:pb-10", className)}>
        {children}
      </main>
      <PiedDePage />
      <div className="h-14 sm:hidden" />
      <BottomNav />
      <FabReferencer />
    </div>
  );
}
