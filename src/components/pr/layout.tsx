import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Glyphe, LogoHorizontal } from "@/components/pr/Logo";

const LIENS = [
  { to: "/", label: "Accueil" },
  { to: "/annuaire", label: "Annuaire" },
  { to: "/carte", label: "Carte" },
  { to: "/categories", label: "Rubriques" },
] as const;

export function Masthead() {
  const [ouvert, setOuvert] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-papier/95 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3.5 sm:flex sm:justify-between">
        <Link to="/" className="min-w-0" onClick={() => setOuvert(false)}>
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
            className="oeil rounded-full bg-encre px-4 py-2.5 text-background transition-opacity hover:opacity-85"
          >
            Référencer
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOuvert((v) => !v)}
          aria-label={ouvert ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={ouvert}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-papier text-bordeaux sm:hidden"
        >
          {ouvert ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {ouvert ? (
        <nav className="border-t border-border bg-papier px-5 pb-6 pt-2 sm:hidden">
          <ul className="flex flex-col">
            {LIENS.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  activeOptions={{ exact: l.to === "/" }}
                  onClick={() => setOuvert(false)}
                  className="block border-b border-border py-4 font-display text-2xl text-encre"
                  activeProps={{ className: "text-rose" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to="/referencer"
            onClick={() => setOuvert(false)}
            className="oeil mt-5 block rounded-full bg-encre px-5 py-3.5 text-center text-background"
          >
            Référencer mon activité
          </Link>
        </nav>
      ) : null}
    </header>
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
            <Link to="/departements" className="oeil text-bordeaux">
              Annuaires par département
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
      <div className="h-16 sm:hidden" />
      <BottomNav />
      <FabReferencer />
    </div>
  );
}
