import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { PageMagazine } from "@/components/pr/layout";
import { Etiquette, NumeroDePage, Rubrique } from "@/components/pr/bits";
import {
  categoriesQuery,
  toutesFichesQuery,
  type Prestataire,
  type Statut,
} from "@/lib/pages-roses";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Rédaction — Les Pages Roses" },
      { name: "description", content: "Gestion des fiches et des demandes de référencement." },
      { property: "og:title", content: "Rédaction — Les Pages Roses" },
      { property: "og:description", content: "Espace de gestion de l'annuaire des Kumi." },
    ],
  }),
  component: Admin,
});

const STATUTS: { valeur: Statut; label: string }[] = [
  { valeur: "en_attente", label: "En attente" },
  { valeur: "publiee", label: "Publiées" },
  { valeur: "refusee", label: "Refusées" },
];

function Admin() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [onglet, setOnglet] = useState<Statut>("en_attente");
  const { data: fiches = [], isLoading, error } = useQuery(toutesFichesQuery);
  const { data: categories = [] } = useQuery(categoriesQuery);

  const invalider = () => {
    qc.invalidateQueries({ queryKey: ["prestataires"] });
  };

  const majStatut = useMutation({
    mutationFn: async ({ id, statut }: { id: string; statut: Statut }) => {
      const { error: err } = await supabase.from("prestataires").update({ statut }).eq("id", id);
      if (err) throw err;
    },
    onSuccess: invalider,
  });

  const modifier = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Prestataire> }) => {
      const { error: err } = await supabase.from("prestataires").update(patch).eq("id", id);
      if (err) throw err;
    },
    onSuccess: invalider,
  });

  const supprimer = useMutation({
    mutationFn: async (id: string) => {
      const { error: err } = await supabase.from("prestataires").delete().eq("id", id);
      if (err) throw err;
    },
    onSuccess: invalider,
  });

  const liste = fiches.filter((f) => f.statut === onglet);

  return (
    <PageMagazine>
      <div className="flex items-start justify-between gap-3">
        <Rubrique sur="Coulisses" titre="La rédaction" sous="Valide, corrige, publie." />
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            qc.clear();
            navigate({ to: "/" });
          }}
          className="label-annonce shrink-0 border border-border bg-papier px-3 py-2"
        >
          Déconnexion
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUTS.map((s) => (
          <button
            key={s.valeur}
            onClick={() => setOnglet(s.valeur)}
            className={`rubrique border border-border px-3 py-2 ${
              onglet === s.valeur ? "bg-rose text-rose-foreground" : "bg-papier"
            }`}
          >
            {s.label} ({fiches.filter((f) => f.statut === s.valeur).length})
          </button>
        ))}
      </div>

      {error ? (
        <p className="encart mt-5 p-4 text-sm">
          Accès refusé : ton compte n'a pas encore le rôle administratrice. Demande à une
          administratrice de te l'attribuer.
        </p>
      ) : null}

      {isLoading ? <p className="label-annonce mt-5">Chargement…</p> : null}

      <div className="mt-5 grid gap-4">
        {liste.map((f) => (
          <article key={f.id} className="encart p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold">{f.nom}</h3>
                <p className="rubrique text-rose">{f.activite}</p>
                <p className="label-annonce mt-1 text-muted-foreground">
                  {f.ville}
                  {f.quartier ? ` · ${f.quartier}` : ""} · {f.categorie_slug}
                </p>
              </div>
              <Etiquette ton={f.statut === "publiee" ? "rose" : f.statut === "refusee" ? "encre" : "jaune"}>
                {f.statut.replace("_", " ")}
              </Etiquette>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <label className="label-annonce">
                Rubrique
                <select
                  value={f.categorie_slug}
                  onChange={(e) =>
                    modifier.mutate({ id: f.id, patch: { categorie_slug: e.target.value } })
                  }
                  className="mt-1 w-full border border-border bg-papier px-2 py-1.5 text-sm normal-case"
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.nom}
                    </option>
                  ))}
                </select>
              </label>
              <label className="label-annonce">
                Déplacement
                <select
                  value={f.deplacement}
                  onChange={(e) =>
                    modifier.mutate({
                      id: f.id,
                      patch: { deplacement: e.target.value as Prestataire["deplacement"] },
                    })
                  }
                  className="mt-1 w-full border border-border bg-papier px-2 py-1.5 text-sm normal-case"
                >
                  <option value="se_deplace">Se déplace</option>
                  <option value="sur_place">Sur place</option>
                  <option value="sur_demande">Sur demande</option>
                </select>
              </label>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
              {f.statut !== "publiee" ? (
                <button
                  onClick={() => majStatut.mutate({ id: f.id, statut: "publiee" })}
                  className="label-annonce border border-border bg-rose px-3 py-1.5 text-rose-foreground"
                >
                  ✓ Publier
                </button>
              ) : (
                <button
                  onClick={() => majStatut.mutate({ id: f.id, statut: "en_attente" })}
                  className="label-annonce border border-border bg-jaune px-3 py-1.5"
                >
                  ⏸ Dépublier
                </button>
              )}
              {f.statut !== "refusee" ? (
                <button
                  onClick={() => majStatut.mutate({ id: f.id, statut: "refusee" })}
                  className="label-annonce border border-border bg-papier px-3 py-1.5"
                >
                  ✕ Refuser
                </button>
              ) : null}
              <button
                onClick={() => {
                  if (confirm(`Supprimer définitivement la fiche de ${f.nom} ?`)) {
                    supprimer.mutate(f.id);
                  }
                }}
                className="label-annonce border border-border bg-destructive px-3 py-1.5 text-destructive-foreground"
              >
                Supprimer
              </button>
            </div>
          </article>
        ))}
        {!isLoading && liste.length === 0 ? (
          <p className="encart p-4 text-sm text-muted-foreground">Aucune fiche dans cet onglet.</p>
        ) : null}
      </div>

      <NumeroDePage n={99} mention="Rédaction" />
    </PageMagazine>
  );
}
