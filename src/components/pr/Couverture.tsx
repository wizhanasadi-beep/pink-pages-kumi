import { useEffect, useState } from "react";
import { AnnuaireImage } from "@/components/pr/Logo";
import { Etoile } from "@/components/pr/ornements";

/**
 * Couverture plein écran affichée à l'arrivée sur l'accueil.
 * Au clic, la page pivote et révèle le site.
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
      className={`couverture aplat-creme ${ouvre ? "couverture-ouverte" : ""}`}
      role="dialog"
      aria-label="Couverture Les Pages Roses"
    >
      <button
        type="button"
        onClick={ouvrir}
        className="oeil absolute right-5 top-6 z-10 text-encre/70 transition-colors hover:text-encre"
      >
        Passer
      </button>

      <Etoile className="pointer-events-none absolute -bottom-2 -right-4 w-24 text-encre/18" />


      <button
        type="button"
        onClick={ouvrir}
        aria-label="Ouvrir l'annuaire"
        className="group flex w-full max-w-md flex-col items-center gap-8 px-7 text-center"
      >
        <p className="oeil text-encre/70">Édition n° 01 · L'annuaire des Kumi</p>

        <span className="flex flex-col items-center gap-5 text-center">
          <AnnuaireImage className="couverture-carnet w-[46vw] max-w-[15rem] sm:w-56" priority />
          <span className="logo-pages-roses whitespace-nowrap text-[8vw] leading-none text-encre sm:text-5xl">
            Les Pages Roses
          </span>
        </span>

        <span className="oeil inline-block w-full max-w-xs bg-encre px-6 py-4 text-background transition-transform group-hover:-translate-y-0.5 rounded-full">
          Ouvrir l'annuaire
        </span>
      </button>
    </div>
  );
}

