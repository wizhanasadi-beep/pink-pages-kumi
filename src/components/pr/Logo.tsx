import { cn } from "@/lib/utils";
import annuaireImg from "@/assets/annuaire-logo.png";

/**
 * Combiné téléphonique plein (glyphe de secours, très petites tailles).
 */
export function Combine({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={cn("h-auto w-full", className)} aria-hidden fill="none">
      <path
        d="M31 20c6-6 15-6 20 1l9 12c4 6 3 13-3 17l-6 4c3 9 11 17 20 20l4-6c4-6 11-7 17-3l12 9c7 5 7 14 1 20l-6 6c-8 8-21 8-33 2C46 94 26 74 19 55c-5-12-4-25 4-33l8-2z"
        fill="currentColor"
      />
    </svg>
  );
}

/** L'annuaire rose : illustration de marque. */
export function AnnuaireImage({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <img
      src={annuaireImg}
      alt="Annuaire Les Pages Roses"
      width={1024}
      height={1024}
      {...(priority ? {} : { loading: "lazy" as const })}
      className={cn("h-auto w-full select-none drop-shadow-[0_18px_30px_rgba(84,20,36,0.22)]", className)}
    />
  );
}

/** Alias conservé pour la couverture. */
export const CarnetLogo = AnnuaireImage;

/** Version compacte (footer, puces). */
export function Glyphe({ className }: { className?: string }) {
  return <Combine className={cn("w-6", className)} />;
}

/** Wordmark sur une seule ligne. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("logo-pages-roses whitespace-nowrap", className)}>
      Les Pages <span className="mot-roses text-rose">Roses</span>
    </span>
  );
}

/** Logo horizontal (navbar) : annuaire + nom sur une ligne. */
export function LogoHorizontal({
  className,
  baseline = false,
}: {
  className?: string;
  baseline?: boolean;
}) {
  return (
    <span className={cn("flex min-w-0 items-center gap-2.5", className)}>
      <AnnuaireImage className="w-8 shrink-0 sm:w-9" priority />
      <span className="flex min-w-0 flex-col leading-none">
        <Wordmark className="text-xl sm:text-2xl" />
        {baseline ? (
          <span className="oeil mt-1 text-muted-foreground">L'annuaire des Kumi</span>
        ) : null}
      </span>
    </span>
  );
}

/** Logo vertical : image d'annuaire puis nom sur une seule ligne. */
export function LogoVertical({
  className,
  tailleImage = "w-40 sm:w-48",
}: {
  className?: string;
  tailleImage?: string;
}) {
  return (
    <span className={cn("flex flex-col items-center gap-5 text-center", className)}>
      <AnnuaireImage className={cn("couverture-carnet", tailleImage)} priority />
      <span className="logo-pages-roses whitespace-nowrap text-[8vw] leading-none text-papier sm:text-5xl">
        Les Pages Roses
      </span>
    </span>
  );
}

/** Lettrage éditorial du hero : une seule ligne. */
export function LettrageHero({ className }: { className?: string }) {
  return (
    <div className={cn("select-none", className)}>
      <div className="flex items-center gap-[0.12em]">
        <p className="titre-geant whitespace-nowrap text-[8.6vw] leading-[0.95] lg:text-[6.5rem]">
          Les Pages <span className="mot-roses text-papier">Roses</span>
        </p>
        <AnnuaireImage className="w-[11vw] max-w-[6rem] shrink-0" priority />
      </div>
    </div>
  );
}

