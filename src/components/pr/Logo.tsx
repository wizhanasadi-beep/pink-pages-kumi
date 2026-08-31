import { cn } from "@/lib/utils";

/**
 * Glyphe de marque : combiné téléphonique stylisé, tracé fin, sans skeuomorphisme.
 * Utilisé seul (favicon, fiches) ou intégré au lettrage.
 */
export function Combine({
  className,
  strokeWidth = 5,
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
      {/* arc du combiné */}
      <path d="M22 46C22 24 38 10 60 10s38 14 38 36" />
      {/* écouteurs */}
      <rect x="6" y="40" width="32" height="24" rx="12" />
      <rect x="82" y="40" width="32" height="24" rx="12" />
    </svg>
  );
}

/** Version compacte pour la navbar, les puces et les fiches. */
export function Glyphe({ className }: { className?: string }) {
  return <Combine className={cn("w-6", className)} strokeWidth={7} />;
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
      <Glyphe className="w-7 shrink-0 text-rose" />
      <span className="flex flex-col leading-none">
        <span className="logo-pages-roses text-xl">
          Les Pages <span className="mot-roses">Roses</span>
        </span>
        {baseline ? (
          <span className="oeil mt-1 text-muted-foreground">L'annuaire des Kumi</span>
        ) : null}
      </span>
    </span>
  );
}

/** Lettrage éditorial géant : le combiné traverse le mot ROSES. */
export function LettrageHero({ className }: { className?: string }) {
  return (
    <div className={cn("select-none", className)}>
      <p className="titre-geant text-[18vw] sm:text-[13vw] lg:text-[9.5rem]">Les</p>
      <p className="titre-geant -mt-[0.12em] text-[18vw] sm:text-[13vw] lg:text-[9.5rem]">Pages</p>
      <div className="relative -mt-[0.12em]">
        <p className="mot-roses text-[19vw] leading-[0.85] sm:text-[14vw] lg:text-[10.5rem]">
          Roses
        </p>
        <Combine
          className="pointer-events-none absolute left-[6%] top-[38%] w-[62%] text-rose mix-blend-multiply sm:w-[54%]"
          strokeWidth={4}
        />
      </div>
    </div>
  );
}
