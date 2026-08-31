import { useEffect, useState } from "react";
import { LogoVertical } from "@/components/pr/Logo";
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
      className={`couverture bg-papier ${ouvre ? "couverture-ouverte" : ""}`}
      role="dialog"
      aria-label="Couverture Les Pages Roses"
    >
      <button
        type="button"
        onClick={ouvrir}
        className="oeil absolute right-5 top-6 z-10 text-encre/60 transition-colors hover:text-encre"
      >
        Passer
      </button>

      <Etoile className="pointer-events-none absolute -bottom-2 -right-4 w-24 text-rose/20" />

      <button
        type="button"
        onClick={ouvrir}
        aria-label="Ouvrir l'annuaire"
        className="group flex w-full max-w-md flex-col items-center gap-8 px-7 text-center"
      >
        <p className="oeil text-encre/60">Édition n° 01 · L'annuaire des Kumi</p>

        <LogoVertical tailleImage="w-[46vw] max-w-[15rem] sm:w-56" />

        <span className="oeil inline-block w-full max-w-xs bg-rose px-6 py-4 text-rose-foreground transition-transform group-hover:-translate-y-0.5 rounded-full">
          Ouvrir l'annuaire
        </span>
      </button>
    </div>
  );
}
