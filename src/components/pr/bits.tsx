import { DEPLACEMENT_LABEL, initiales, type Deplacement } from "@/lib/pages-roses";
import { cn } from "@/lib/utils";
import { Glyphe } from "@/components/pr/Logo";

export function Filet({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <span className="h-px flex-1 bg-border" />
      <Glyphe className="w-6 shrink-0 text-rose" />
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

export function Rubrique({
  titre,
  sur,
  sous,
  className,
}: {
  titre: string;
  sur?: string | undefined;
  sous?: string | undefined;
  className?: string | undefined;
}) {
  return (
    <header className={cn("mb-8", className)}>
      {sur ? <p className="oeil mb-3 text-rose">{sur}</p> : null}
      <h2 className="text-4xl leading-none sm:text-5xl">{titre}</h2>
      {sous ? (
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">{sous}</p>
      ) : null}
    </header>
  );
}

export function BadgeDeplacement({
  mode,
  className,
}: {
  mode: Deplacement;
  className?: string | undefined;
}) {
  const { texte } = DEPLACEMENT_LABEL[mode];
  return (
    <span
      className={cn(
        "oeil inline-flex items-center gap-1.5 border border-border px-2.5 py-1 text-muted-foreground",
        className,
      )}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-rose" />
      {texte}
    </span>
  );
}

export function Etiquette({
  children,
  ton = "poudre",
  className,
}: {
  children: React.ReactNode;
  ton?: "poudre" | "jaune" | "rose" | "encre";
  className?: string | undefined;
}) {
  const tons = {
    poudre: "bg-poudre text-encre border-transparent",
    jaune: "bg-poudre text-encre border-transparent",
    rose: "bg-rose text-rose-foreground border-transparent",
    encre: "bg-encre text-background border-transparent",
  } as const;
  return (
    <span
      className={cn("oeil inline-block border px-2.5 py-1", tons[ton], className)}
    >
      {children}
    </span>
  );
}

/** Photo de fiche : à défaut d'image, initiales sur aplat rose pâle. */
export function PhotoFiche({
  nom,
  url,
  className,
  ratio = "aspect-[4/5]",
}: {
  nom: string;
  url?: string | null | undefined;
  className?: string | undefined;
  ratio?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-poudre", ratio, className)}>
      {url ? (
        <img
          src={url}
          alt={`Photo de ${nom}`}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-poudre">
          <span className="logo-pages-roses text-3xl text-bordeaux/70">{initiales(nom)}</span>
        </div>
      )}
    </div>
  );
}

export function NumeroDePage({ mention }: { n?: number; mention?: string }) {
  return (
    <p className="oeil mt-16 flex items-center justify-between border-t border-border pt-5 text-muted-foreground">
      <span>{mention ?? "Les Pages Roses"}</span>
      <span>L'annuaire des Kumi</span>
    </p>
  );
}
