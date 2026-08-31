import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { avisQuery, envoyerAvis, moyenne } from "@/lib/pages-roses";
import { cn } from "@/lib/utils";

function Etoiles({
  note,
  taille = "text-lg",
  className,
}: {
  note: number;
  taille?: string;
  className?: string;
}) {
  return (
    <span aria-hidden className={cn("tracking-[0.15em] text-rose", taille, className)}>
      {"★★★★★".slice(0, Math.round(note))}
      <span className="text-muted-foreground/40">{"★★★★★".slice(Math.round(note))}</span>
    </span>
  );
}

export function NoteMoyenne({ prestataireId }: { prestataireId: string }) {
  const { data: avis = [] } = useQuery(avisQuery(prestataireId));
  const moy = moyenne(avis);
  if (moy === null) return <p className="oeil text-muted-foreground">Pas encore d'avis</p>;
  return (
    <div className="flex items-center gap-2">
      <Etoiles note={moy} />
      <span className="oeil text-muted-foreground">
        {moy.toFixed(1)} / 5 · {avis.length} avis
      </span>
    </div>
  );
}

export function SectionAvis({ prestataireId }: { prestataireId: string }) {
  const qc = useQueryClient();
  const { data: avis = [], isLoading } = useQuery(avisQuery(prestataireId));
  const [autrice, setAutrice] = useState("");
  const [note, setNote] = useState(0);
  const [commentaire, setCommentaire] = useState("");
  const [survol, setSurvol] = useState(0);

  const mutation = useMutation({
    mutationFn: () =>
      envoyerAvis({ prestataire_id: prestataireId, autrice: autrice.trim(), note, commentaire: commentaire.trim() }),
    onSuccess: async () => {
      setAutrice("");
      setNote(0);
      setCommentaire("");
      await qc.invalidateQueries({ queryKey: ["avis", prestataireId] });
    },
  });

  const valide = autrice.trim().length > 0 && note >= 1;

  return (
    <section className="mt-10">
      <h2 className="text-3xl leading-none sm:text-4xl">Les avis des Kumi</h2>
      <div className="mt-3 mb-5">
        <NoteMoyenne prestataireId={prestataireId} />
      </div>

      <form
        className="encart space-y-3 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (valide) mutation.mutate();
        }}
      >
        <p className="oeil text-rose">Laisser un avis</p>

        <div className="flex items-center gap-1" onMouseLeave={() => setSurvol(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`Noter ${n} sur 5`}
              onMouseEnter={() => setSurvol(n)}
              onClick={() => setNote(n)}
              className={cn(
                "px-0.5 text-2xl leading-none transition-transform hover:scale-110",
                (survol || note) >= n ? "text-rose" : "text-muted-foreground/40",
              )}
            >
              ★
            </button>
          ))}
          <span className="oeil ml-2 text-muted-foreground">
            {note ? `${note} / 5` : "Choisis une note"}
          </span>
        </div>

        <input
          value={autrice}
          onChange={(e) => setAutrice(e.target.value)}
          maxLength={60}
          placeholder="Ton prénom"
          className="w-full border border-border bg-papier px-4 py-2.5 text-sm text-encre placeholder:text-muted-foreground"
        />
        <textarea
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          maxLength={1000}
          rows={3}
          placeholder="Ton expérience avec cette prestataire (facultatif)"
          className="w-full rounded-2xl border border-border bg-papier px-4 py-2.5 text-sm text-encre placeholder:text-muted-foreground"
        />

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={!valide || mutation.isPending}
            className="bg-rose px-5 py-2.5 text-sm font-medium text-rose-foreground shadow-sm disabled:opacity-50"
          >
            {mutation.isPending ? "Envoi…" : "Publier mon avis"}
          </button>
          {mutation.isSuccess ? (
            <span className="text-sm text-rose">Merci, ton avis est en ligne.</span>
          ) : null}
          {mutation.isError ? (
            <span className="text-sm text-destructive">
              Oups, l'avis n'a pas pu être envoyé. Réessaie.
            </span>
          ) : null}
        </div>
      </form>

      <div className="mt-5 space-y-3">
        {isLoading ? <p className="oeil text-muted-foreground">Chargement des avis…</p> : null}
        {!isLoading && avis.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Sois la première à partager ton expérience.
          </p>
        ) : null}
        {avis.map((a) => (
          <article key={a.id} className="fiche p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-lg leading-none">{a.autrice}</p>
              <Etoiles note={a.note} taille="text-base" />
            </div>
            {a.commentaire ? (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.commentaire}</p>
            ) : null}
            <p className="oeil mt-2 text-muted-foreground/70">
              {new Date(a.created_at).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
