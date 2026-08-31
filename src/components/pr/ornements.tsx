import { cn } from "@/lib/utils";

/** Petite fleur girly, tracé plein. */
export function Fleur({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={cn("h-auto w-full", className)} aria-hidden>
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <ellipse
          key={a}
          cx="50"
          cy="27"
          rx="15"
          ry="24"
          fill="currentColor"
          transform={`rotate(${a} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="12" fill="var(--papier)" />
    </svg>
  );
}

/** Étoile à quatre branches, style sparkle. */
export function Etoile({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={cn("h-auto w-full", className)} aria-hidden>
      <path
        d="M50 2c4 28 20 44 48 48-28 4-44 20-48 48-4-28-20-44-48-48 28-4 44-20 48-48Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Arche : forme de base des pavés et des vignettes. */
export function Arche({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 120" className={cn("h-auto w-full", className)} aria-hidden>
      <path d="M50 4c25 0 46 20 46 46v70H4V50C4 24 25 4 50 4Z" fill="currentColor" />
    </svg>
  );
}

/** Ruban ondulé pour marquer une bascule d'aplat. */
export function Vague({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 40"
      preserveAspectRatio="none"
      className={cn("h-6 w-full", className)}
      aria-hidden
    >
      <path
        d="M0 20c60-24 120-24 180 0s120 24 180 0 120-24 180 0 120 24 180 0 120-24 180 0 120 24 180 0v20H0Z"
        fill="currentColor"
      />
    </svg>
  );
}

const PICTOS: Record<string, "fleur" | "etoile" | "combine" | "coeur" | "arche" | "soleil"> = {
  beaute: "fleur",
  mode: "arche",
  evenementiel: "etoile",
  creation: "soleil",
  food: "coeur",
  autres: "combine",
};

export function PictoRubrique({ slug, className }: { slug: string; className?: string }) {
  const kind = PICTOS[slug] ?? "etoile";
  if (kind === "fleur") return <Fleur className={className} />;
  if (kind === "arche") return <Arche className={className} />;
  if (kind === "etoile") return <Etoile className={className} />;
  if (kind === "coeur")
    return (
      <svg viewBox="0 0 100 100" className={cn("h-auto w-full", className)} aria-hidden>
        <path
          d="M50 86C22 66 8 52 8 36 8 23 18 13 31 13c8 0 15 4 19 11 4-7 11-11 19-11 13 0 23 10 23 23 0 16-14 30-42 50Z"
          fill="currentColor"
        />
      </svg>
    );
  if (kind === "soleil")
    return (
      <svg viewBox="0 0 100 100" className={cn("h-auto w-full", className)} aria-hidden>
        <circle cx="50" cy="50" r="22" fill="currentColor" />
        {Array.from({ length: 12 }).map((_, i) => (
          <rect
            key={i}
            x="47"
            y="4"
            width="6"
            height="16"
            rx="3"
            fill="currentColor"
            transform={`rotate(${i * 30} 50 50)`}
          />
        ))}
      </svg>
    );
  return (
    <svg viewBox="0 0 120 72" className={cn("h-auto w-full", className)} aria-hidden fill="none" stroke="currentColor" strokeWidth={9} strokeLinecap="round">
      <path d="M22 46C22 24 38 10 60 10s38 14 38 36" />
      <rect x="6" y="40" width="32" height="24" rx="12" />
      <rect x="82" y="40" width="32" height="24" rx="12" />
    </svg>
  );
}
