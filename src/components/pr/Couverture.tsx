import { useEffect, useState } from "react";
import { CarnetLogo } from "@/components/pr/Logo";
import { Etoile, Fleur } from "@/components/pr/ornements";

/**
 * Couverture plein écran affichée à l'arrivée sur l'accueil.
 * Au clic, le carnet pivote comme une page qui s'ouvre et révèle le site.
 */
export function Couverture({ onFin }: { onFin: () => void }) {
  const [ouvre, setOuvre] = useState(false);

  const ouvrir = () => {
    if (ouvre) return;
    setOuvre(true);
  };

  useEffect(() => {
    if (!ouvre) return;
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(onFin, reduit ? 260 : 760);
    return () => window.clearTimeout(t);
  }, [ouvre, onFin]);

  return (
    <div
      className={`couverture aplat-rose ${ouvre ? "couverture-ouverte" : ""}`}
      role="dialog"
      aria-label="Couverture Les Pages Roses"
    >
      <button
        type="button"
        onClick={ouvrir}
        className="absolute right-5 top-5 oeil z-10 text-rose-foreground/70 transition-colors hover:text-rose-foreground"
      >
        Passer
      </button>

      <Fleur className="pointer-events-none absolute -left-10 top-10 w-40 text-rose-foreground/15" />
      <Etoile className="pointer-events-none absolute bottom-16 right-10 w-16 text-rose-foreground/25" />

      <button
        type="button"
        onClick={ouvrir}
        aria-label="Ouvrir l'annuaire"
        className="group flex w-full max-w-2xl flex-col items-center px-6 text-center"
      >
        <p className="oeil text-rose-foreground/70">Édition n° 01</p>
        <h1 className="titre-geant mt-5 text-[15vw] leading-[0.85] sm:text-7xl lg:text-8xl">
          Les Pages
          <br />
          <span className="mot-roses">Roses</span>
        </h1>
        <p className="oeil mt-5 text-rose-foreground/80">L'annuaire des Kumi</p>

        <CarnetLogo className="couverture-carnet mt-10 w-40 sm:w-52" />

        <span className="oeil mt-10 inline-block bg-encre px-6 py-3.5 text-background transition-transform group-hover:-translate-y-0.5">
          Ouvrir l'annuaire
        </span>
      </button>
    </div>
  );
}
