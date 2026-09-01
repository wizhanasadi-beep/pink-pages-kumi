import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { PageMagazine } from "@/components/pr/layout";
import { Etiquette, Filet, NumeroDePage, Rubrique } from "@/components/pr/bits";
import {
  etatRedaction,
  exporterDemandes,
  fermerRedaction,
  fichesRedaction,
  majStatutFiche,
  ouvrirRedaction,
  statistiquesSite,
  supprimerFiche,
  type StatutFiche,
} from "@/lib/redaction.functions";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Espace rédaction — Les Pages Roses" },
      {
        name: "description",
        content: "Tableau de bord, demandes de référencement et export des Pages Roses.",
      },
      { property: "og:title", content: "Espace rédaction — Les Pages Roses" },
      { property: "og:description", content: "Accès réservé à la rédaction des Pages Roses." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Redaction,
});

function Redaction() {
  const qc = useQueryClient();
  const { data: etat, isLoading } = useQuery({
    queryKey: ["redaction", "etat"],
    queryFn: () => etatRedaction(),
  });

  if (isLoading) {
    return (
      <PageMagazine>
        <p className="label-annonce">Chargement…</p>
      </PageMagazine>
    );
  }

  if (!etat?.ouvert) return <PorteCode onOuvert={() => qc.invalidateQueries()} />;
  return <Tableau />;
}

function PorteCode({ onOuvert }: { onOuvert: () => void }) {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const entrer = useMutation({
    mutationFn: (valeur: string) => ouvrirRedaction({ data: { code: valeur } }),
    onSuccess: (res) => {
      if (res.ok) onOuvert();
      else setMessage(res.message);
    },
    onError: () => setMessage("Le code d'accès n'est pas configuré."),
  });

  return (
    <PageMagazine>
      <Rubrique sur="Réservé à la rédaction" titre="Code d'accès" sous="Un simple code suffit." />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setMessage(null);
          entrer.mutate(code);
        }}
        className="encart mx-auto max-w-md space-y-4 p-5"
      >
        <label className="label-annonce mb-1 block">Code rédaction</label>
        <input
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="current-password"
          aria-label="Code numérique rédaction"
          required
          autoFocus
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          className="w-full border border-border bg-papier px-4 py-3 text-center text-lg tracking-widest rounded-full"
        />
        <p className="text-center text-sm text-muted-foreground">Saisis uniquement les chiffres de ton code.</p>
        {message ? <p className="label-annonce text-bordeaux">{message}</p> : null}
        <button
          type="submit"
          disabled={entrer.isPending}
          className="rubrique w-full border border-border bg-rose px-4 py-3 text-lg text-rose-foreground shadow-sm disabled:opacity-60 rounded-full"
        >
          {entrer.isPending ? "Vérification…" : "Entrer"}
        </button>
      </form>
      <NumeroDePage n={99} mention="Rédaction" />
    </PageMagazine>
  );
}

const ONGLETS = [
  { cle: "dashboard", label: "Tableau de bord" },
  { cle: "demandes", label: "Demandes" },
] as const;

function Tableau() {
  const qc = useQueryClient();
  const [onglet, setOnglet] = useState<(typeof ONGLETS)[number]["cle"]>("dashboard");

  return (
    <PageMagazine>
      <div className="flex items-start justify-between gap-3">
        <Rubrique sur="Coulisses" titre="La rédaction" sous="Audience, demandes, export." />
        <button
          onClick={async () => {
            await fermerRedaction();
            qc.clear();
            location.reload();
          }}
          className="label-annonce shrink-0 border border-border bg-papier px-3 py-2 rounded-full"
        >
          Quitter
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {ONGLETS.map((o) => (
          <button
            key={o.cle}
            onClick={() => setOnglet(o.cle)}
            className={`rubrique border border-border px-3 py-2 rounded-full ${
              onglet === o.cle ? "bg-rose text-rose-foreground" : "bg-papier"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      {onglet === "dashboard" ? <Dashboard /> : <Demandes />}
      <NumeroDePage n={99} mention="Rédaction" />
    </PageMagazine>
  );
}

function Chiffre({ valeur, libelle }: { valeur: number; libelle: string }) {
  return (
    <div className="encart p-4">
      <p className="text-3xl font-bold leading-none">{valeur.toLocaleString("fr-FR")}</p>
      <p className="label-annonce mt-2 text-muted-foreground">{libelle}</p>
    </div>
  );
}

function Dashboard() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["redaction", "stats"],
    queryFn: () => statistiquesSite(),
  });

  if (isLoading) return <p className="label-annonce mt-5">Chargement des statistiques…</p>;
  if (error || !stats)
    return <p className="encart mt-5 p-4 text-sm">Statistiques indisponibles pour le moment.</p>;

  const maxi = Math.max(1, ...stats.parJour.map((j) => j.visites + j.vues + j.clics));

  return (
    <div className="mt-5 space-y-6">
      <p className="label-annonce text-muted-foreground">Sur les 30 derniers jours</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Chiffre valeur={stats.visites} libelle="Visites de pages" />
        <Chiffre valeur={stats.vuesFiches} libelle="Fiches consultées" />
        <Chiffre valeur={stats.clicsLiens} libelle="Clics de contact" />
        <Chiffre valeur={stats.visites7j} libelle="Visites (7 derniers jours)" />
      </div>

      <div className="encart p-4">
        <h3 className="rubrique">Activité des 14 derniers jours</h3>
        <div className="mt-4 flex h-40 items-end gap-1">
          {stats.parJour.map((j) => {
            const total = j.visites + j.vues + j.clics;
            return (
              <div key={j.jour} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-rose"
                  style={{ height: `${(total / maxi) * 100}%`, minHeight: total ? 4 : 1 }}
                  title={`${j.jour} · ${total} événements`}
                />
                <span className="text-[0.55rem] text-muted-foreground">{j.jour.slice(8)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="encart p-4">
          <h3 className="rubrique">Fiches les plus vues</h3>
          <Filet />
          <ul className="space-y-2 text-sm">
            {stats.topFiches.length === 0 ? (
              <li className="text-muted-foreground">Aucune donnée encore.</li>
            ) : null}
            {stats.topFiches.map((f) => (
              <li key={f.id} className="flex justify-between gap-3">
                <span className="truncate">{f.nom}</span>
                <span className="label-annonce shrink-0 text-muted-foreground">
                  {f.vues} vues · {f.clics} clics
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="encart p-4">
          <h3 className="rubrique">Pages les plus visitées</h3>
          <Filet />
          <ul className="space-y-2 text-sm">
            {stats.topPages.length === 0 ? (
              <li className="text-muted-foreground">Aucune donnée encore.</li>
            ) : null}
            {stats.topPages.map((p) => (
              <li key={p.chemin} className="flex justify-between gap-3">
                <span className="truncate">{p.chemin}</span>
                <span className="label-annonce shrink-0 text-muted-foreground">{p.visites}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="encart p-4 sm:col-span-2">
          <h3 className="rubrique">Liens de contact les plus cliqués</h3>
          <Filet />
          <ul className="space-y-2 text-sm">
            {stats.topLiens.length === 0 ? (
              <li className="text-muted-foreground">Aucune donnée encore.</li>
            ) : null}
            {stats.topLiens.map((l) => (
              <li key={l.cible} className="flex justify-between gap-3">
                <span className="truncate">{l.cible}</span>
                <span className="label-annonce shrink-0 text-muted-foreground">{l.clics}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const STATUTS: { valeur: StatutFiche; label: string }[] = [
  { valeur: "en_attente", label: "En attente" },
  { valeur: "publiee", label: "Publiées" },
  { valeur: "refusee", label: "Refusées" },
];

function Demandes() {
  const qc = useQueryClient();
  const [filtre, setFiltre] = useState<StatutFiche | "toutes">("en_attente");
  const { data: fiches = [], isLoading } = useQuery({
    queryKey: ["redaction", "fiches"],
    queryFn: () => fichesRedaction(),
  });

  const rafraichir = () => qc.invalidateQueries({ queryKey: ["redaction"] });
  const statut = useMutation({
    mutationFn: (v: { id: string; statut: StatutFiche }) => majStatutFiche({ data: v }),
    onSuccess: rafraichir,
  });
  const suppression = useMutation({
    mutationFn: (id: string) => supprimerFiche({ data: { id } }),
    onSuccess: rafraichir,
  });

  const telecharger = useMutation({
    mutationFn: () => exporterDemandes(),
    onSuccess: (res) => {
      const url = URL.createObjectURL(
        new Blob([res.csv], { type: "text/csv;charset=utf-8;" }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = `pages-roses-referencements-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    },
  });

  const liste = filtre === "toutes" ? fiches : fiches.filter((f) => f.statut === filtre);

  return (
    <div className="mt-5 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {[...STATUTS, { valeur: "toutes" as const, label: "Toutes" }].map((s) => (
          <button
            key={s.valeur}
            onClick={() => setFiltre(s.valeur)}
            className={`label-annonce border border-border px-3 py-1.5 rounded-full ${
              filtre === s.valeur ? "bg-poudre" : "bg-papier"
            }`}
          >
            {s.label} (
            {s.valeur === "toutes"
              ? fiches.length
              : fiches.filter((f) => f.statut === s.valeur).length}
            )
          </button>
        ))}
        <button
          onClick={() => telecharger.mutate()}
          disabled={telecharger.isPending}
          className="label-annonce ml-auto border border-border bg-jaune px-3 py-1.5 rounded-full disabled:opacity-60"
        >
          {telecharger.isPending ? "Export…" : "⤓ Exporter pour Excel"}
        </button>
      </div>

      {isLoading ? <p className="label-annonce">Chargement…</p> : null}

      <div className="grid gap-4">
        {liste.map((f) => (
          <article key={f.id} className="encart p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold">{f.nom}</h3>
                <p className="rubrique text-rose">
                  {f.activite}
                  {f.prenom ? ` — par ${f.prenom}` : ""}
                </p>
                <p className="label-annonce mt-1 text-muted-foreground">
                  {f.ville}
                  {f.quartier ? ` · ${f.quartier}` : ""} · {f.categorie_slug} · {f.type_offre}
                </p>
                <p className="label-annonce mt-1 text-muted-foreground">
                  Reçue le {new Date(f.created_at).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <Etiquette
                ton={f.statut === "publiee" ? "rose" : f.statut === "refusee" ? "encre" : "jaune"}
              >
                {f.statut.replace("_", " ")}
              </Etiquette>
            </div>

            {f.description ? (
              <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
            ) : null}

            <ul className="mt-2 space-y-1 text-sm">
              {f.instagram ? <li>Instagram : {f.instagram}</li> : null}
              {f.site_web ? <li>Site : {f.site_web}</li> : null}
              {f.lien_reservation ? <li>Réservation : {f.lien_reservation}</li> : null}
              {f.telephone ? <li>Téléphone : {f.telephone}</li> : null}
            </ul>

            <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
              {f.statut !== "publiee" ? (
                <button
                  onClick={() => statut.mutate({ id: f.id, statut: "publiee" })}
                  className="label-annonce border border-border bg-rose px-3 py-1.5 text-rose-foreground rounded-full"
                >
                  ✓ Publier
                </button>
              ) : (
                <button
                  onClick={() => statut.mutate({ id: f.id, statut: "en_attente" })}
                  className="label-annonce border border-border bg-jaune px-3 py-1.5 rounded-full"
                >
                  ⏸ Dépublier
                </button>
              )}
              {f.statut !== "refusee" ? (
                <button
                  onClick={() => statut.mutate({ id: f.id, statut: "refusee" })}
                  className="label-annonce border border-border bg-papier px-3 py-1.5 rounded-full"
                >
                  ✕ Refuser
                </button>
              ) : null}
              <button
                onClick={() => {
                  if (confirm(`Supprimer définitivement la fiche de ${f.nom} ?`))
                    suppression.mutate(f.id);
                }}
                className="label-annonce border border-border bg-destructive px-3 py-1.5 text-destructive-foreground rounded-full"
              >
                Supprimer
              </button>
            </div>
          </article>
        ))}
        {!isLoading && liste.length === 0 ? (
          <p className="encart p-4 text-sm text-muted-foreground">Aucune fiche ici.</p>
        ) : null}
      </div>
    </div>
  );
}
