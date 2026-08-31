import { DEPLACEMENT_LABEL, initiales, type Deplacement } from "@/lib/pages-roses";
import { cn } from "@/lib/utils";

export function Filet({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="h-px flex-1 bg-encre" />
      <span className="text-rose text-xs">✦ ✦ ✦</span>
      <span className="h-px flex-1 bg-encre" />
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
    <header className={cn("mb-5", className)}>
      {sur ? <p className="label-annonce text-bordeaux mb-1">{sur}</p> : null}
      <h2 className="rubrique text-3xl sm:text-4xl">{titre}</h2>
      {sous ? <p className="mt-2 max-w-xl text-sm text-muted-foreground">{sous}</p> : null}
      <div className="filet mt-3" />
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
  const { emoji, texte } = DEPLACEMENT_LABEL[mode];
  const styles: Record<Deplacement, string> = {
    se_deplace: "bg-rose text-rose-foreground",
    sur_place: "bg-poudre text-encre",
    sur_demande: "bg-jaune text-jaune-foreground",
  };
  return (
    <span
      className={cn(
        "label-annonce inline-flex items-center gap-1 border border-border px-2 py-1",
        styles[mode],
        className,
      )}
    >
      <span aria-hidden>{emoji}</span> {texte}
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
    poudre: "bg-poudre text-encre",
    jaune: "bg-jaune text-jaune-foreground",
    rose: "bg-rose text-rose-foreground",
    encre: "bg-encre text-background",
  } as const;
  return (
    <span
      className={cn(
        "label-annonce inline-block border border-border px-2 py-0.5",
        tons[ton],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Photo de fiche : si pas d'image, on imprime les initiales façon vignette d'annuaire. */
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
    <div
      className={cn(
        "relative overflow-hidden border border-border bg-poudre",
        ratio,
        className,
      )}
    >
      {url ? (
        <img
          src={url}
          alt={`Photo de ${nom}`}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="rayures-jaunes flex h-full w-full items-center justify-center">
          <span className="logo-pages-roses flex h-16 w-16 items-center justify-center rounded-full border border-border bg-papier text-2xl">
            {initiales(nom)}
          </span>
        </div>
      )}
    </div>
  );
}

export function NumeroDePage({ n, mention }: { n: number; mention?: string }) {
  return (
    <p className="label-annonce mt-10 flex items-center justify-between text-muted-foreground">
      <span>{mention ?? "Les Pages Roses"}</span>
      <span className="flex items-center gap-2">
        <span className="text-rose">✦</span> page {n}
      </span>
    </p>
  );
}
