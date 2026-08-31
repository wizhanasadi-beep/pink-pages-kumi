import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Glyphe, LogoHorizontal } from "@/components/pr/Logo";

const LIENS = [
  { to: "/", label: "Accueil" },
  { to: "/annuaire", label: "Annuaire" },
  { to: "/carte", label: "Carte" },
  { to: "/categories", label: "Rubriques" },
] as const;

export function Masthead() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-papier/95 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3.5 sm:flex sm:justify-between">
        <Link to="/" className="min-w-0">
          <LogoHorizontal />
        </Link>
        <nav className="hidden items-center gap-7 sm:flex">
          {LIENS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="oeil text-muted-foreground transition-colors hover:text-bordeaux"
              activeProps={{ className: "text-bordeaux border-b border-rose pb-0.5" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/referencer"
            className="oeil bg-encre px-4 py-2.5 text-background transition-opacity hover:opacity-85"
          >
            Référencer
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function BottomNav() {
  return (
    <nav className="nav-safe fixed inset-x-0 bottom-0 z-40 border-t border-border bg-papier/97 backdrop-blur sm:hidden">
      <ul className="mx-auto flex max-w-lg items-stretch">
        {LIENS.map((l) => (
          <li key={l.to} className="flex-1">
            <Link
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="oeil flex min-h-[3rem] flex-col items-center justify-center gap-1 py-3 text-[0.6rem] text-muted-foreground"
              activeProps={{ className: "text-bordeaux bg-poudre/70" }}
            >
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
      className="oeil fixed bottom-[5.25rem] right-4 z-40 rounded-full bg-encre px-5 py-3.5 text-background shadow-[0_10px_24px_rgba(84,20,36,0.28)] sm:hidden"
    >
      Référencer
    </Link>
  );
}


export function PiedDePage() {
  return (
    <footer className="mt-24 border-t border-border bg-poudre">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-md">
            <p className="logo-pages-roses text-3xl">
              Les Pages <span className="mot-roses">Roses</span>
            </p>
            <p className="oeil mt-3 text-bordeaux/70">
              L'annuaire des Kumi · Édition {new Date().getFullYear()}
            </p>
            <p className="mt-5 text-sm leading-relaxed">
              Les bonnes adresses des Kumi, réunies au même endroit. Aucune adresse personnelle
              n'est publiée : seules les villes, quartiers et zones de déplacement apparaissent.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              to="/annuaire"
              search={{ q: "", cat: "", dep: "", ville: "" }}
              className="oeil text-bordeaux"
            >
              Feuilleter l'annuaire
            </Link>
            <Link to="/referencer" className="oeil text-bordeaux">
              Référencer mon activité
            </Link>
            <Link to="/admin" className="oeil text-bordeaux/60">
              Espace rédaction
            </Link>
          </div>
        </div>
        <Glyphe className="mt-12 w-10 text-rose" />
      </div>
    </footer>
  );
}

/** Gabarit standard : contenu contenu dans une colonne lisible. */
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
      <main className={cn("mx-auto w-full max-w-6xl flex-1 px-5 pb-32 pt-8 sm:pb-16 sm:pt-10", className)}>
        {children}
      </main>
      <PiedDePage />
      <div className="h-16 sm:hidden" />
      <BottomNav />
      <FabReferencer />
    </div>

  );
}

/** Gabarit pleine largeur : pour les pages construites en aplats successifs. */
export function PageAplats({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Masthead />
      <main className="flex-1 pb-24 sm:pb-0">{children}</main>
      <PiedDePage />
      <div className="h-14 sm:hidden" />
      <BottomNav />
      <FabReferencer />
    </div>
  );
}
