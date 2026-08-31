import { cn } from "@/lib/utils";

/**
 * Combiné téléphonique stylisé : tracé graphique, sans skeuomorphisme.
 */
export function Combine({
  className,
  strokeWidth = 6,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 120 72"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      className={cn("h-auto w-full", className)}
      aria-hidden
    >
      <path d="M22 46C22 24 38 10 60 10s38 14 38 36" />
      <rect x="6" y="40" width="32" height="24" rx="12" />
      <rect x="82" y="40" width="32" height="24" rx="12" />
    </svg>
  );
}

/**
 * Logo principal : carnet d'annuaire à spirales, combiné au centre de la page.
 * Lisible de 16 px (favicon) à 400 px (couverture).
 */
export function CarnetLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={cn("h-auto w-full", className)}
      aria-hidden
      fill="none"
    >
      {/* page */}
      <rect
        x="28"
        y="12"
        width="84"
        height="96"
        rx="12"
        fill="var(--papier)"
        stroke="var(--encre)"
        strokeWidth="5"
      />
      {/* dos */}
      <rect x="10" y="12" width="26" height="96" rx="12" fill="var(--rose)" stroke="var(--encre)" strokeWidth="5" />
      {/* anneaux */}
      {[30, 52, 74, 96].map((y) => (
        <rect
          key={y}
          x="3"
          y={y - 7}
          width="34"
          height="14"
          rx="7"
          fill="var(--papier)"
          stroke="var(--encre)"
          strokeWidth="5"
        />
      ))}
      {/* combiné */}
      <g
        transform="translate(70 60) rotate(-32) scale(0.62) translate(-60 -36)"
        stroke="var(--encre)"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      >
        <path d="M22 46C22 24 38 10 60 10s38 14 38 36" />
        <rect x="6" y="40" width="32" height="24" rx="12" fill="var(--rose)" />
        <rect x="82" y="40" width="32" height="24" rx="12" fill="var(--rose)" />
      </g>
    </svg>
  );
}

/** Version compacte pour la navbar, les puces et les fiches. */
export function Glyphe({ className }: { className?: string }) {
  return <Combine className={cn("w-6", className)} strokeWidth={8} />;
}

/** Logo horizontal (navbar, footer). */
export function LogoHorizontal({
  className,
  baseline = true,
}: {
  className?: string;
  baseline?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <CarnetLogo className="w-8 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="logo-pages-roses text-lg">
          Les Pages <span className="mot-roses">Roses</span>
        </span>
        {baseline ? (
          <span className="oeil mt-1 text-muted-foreground">L'annuaire des Kumi</span>
        ) : null}
      </span>
    </span>
  );
}

/** Lettrage éditorial du hero. */
export function LettrageHero({ className }: { className?: string }) {
  return (
    <div className={cn("select-none", className)}>
      <p className="titre-geant text-[15vw] sm:text-[11vw] lg:text-[8rem]">Les Pages</p>
      <div className="-mt-[0.08em] flex items-end gap-[0.1em]">
        <p className="mot-roses text-[16vw] leading-[0.9] sm:text-[12vw] lg:text-[9rem]">Roses</p>
        <CarnetLogo className="mb-[0.12em] w-[18vw] max-w-[9rem] shrink-0 sm:w-[13vw]" />
      </div>
    </div>
  );
}
