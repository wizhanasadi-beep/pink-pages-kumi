import { useEffect, useState } from "react";
import { LogoVertical } from "@/components/pr/Logo";
import { Etoile } from "@/components/pr/ornements";
import { jouerJingle } from "@/lib/jingle";

/**
 * Couverture plein écran affichée à l'arrivée sur l'accueil.
 * Au clic, le rideau se lève (translation verticale) et révèle le site,
 * accompagné du jingle de la marque.
 */
export function Couverture({ onFin }: { onFin: () => void }) {
  const [ouvre, setOuvre] = useState(false);
  const [son, setSon] = useState(true);

  const ouvrir = () => {
    if (ouvre) return;
    if (son) jouerJingle();
    setOuvre(true);
  };

  useEffect(() => {
    if (!ouvre) return;
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(onFin, reduit ? 260 : 880);
    return () => window.clearTimeout(t);
  }, [ouvre, onFin]);

  return (
    <div
      className={`couverture bg-background ${ouvre ? "couverture-ouverte" : ""}`}
      role="dialog"
      aria-label="Couverture Les Pages Roses"
    >
      <div className="absolute right-5 top-6 z-10 flex items-center gap-4">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSon((s) => !s);
          }}
          aria-pressed={son}
          className="oeil text-encre/60 transition-colors hover:text-encre"
        >
          {son ? "Son activé" : "Son coupé"}
        </button>
        <button
          type="button"
          onClick={ouvrir}
          className="oeil text-encre/60 transition-colors hover:text-encre"
        >
          Passer
        </button>
      </div>

      <Etoile className="pointer-events-none absolute -bottom-2 -right-4 w-24 text-rose/30" />

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
