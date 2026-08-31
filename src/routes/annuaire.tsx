import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageMagazine } from "@/components/pr/layout";
import { Etiquette, NumeroDePage, Rubrique } from "@/components/pr/bits";
import { FicheCard } from "@/components/pr/FicheCard";
import { categoriesQuery, normalise, prestatairesQuery } from "@/lib/pages-roses";

type Recherche = { q?: string; cat?: string; dep?: string; ville?: string };

export const Route = createFileRoute("/annuaire")({
  validateSearch: (s: Record<string, unknown>): Recherche => ({
    q: typeof s["q"] === "string" ? (s["q"] as string) : "",
    cat: typeof s["cat"] === "string" ? (s["cat"] as string) : "",
    dep: typeof s["dep"] === "string" ? (s["dep"] as string) : "",
    ville: typeof s["ville"] === "string" ? (s["ville"] as string) : "",
  }),
  head: () => ({
    meta: [
      { title: "L'Annuaire — Les Pages Roses" },
      {
        name: "description",
        content:
          "Toutes les prestataires des Kumi réunies au même endroit : recherche, filtres par rubrique, ville et déplacement.",
      },
      { property: "og:title", content: "L'Annuaire — Les Pages Roses" },
      {
        property: "og:description",
        content: "Toutes les prestataires des Kumi, réunies au même endroit.",
      },
    ],
  }),
  component: Annuaire,
});

function Annuaire() {
  const raw = Route.useSearch();
  const search = {
    q: raw.q ?? "",
    cat: raw.cat ?? "",
    dep: raw.dep ?? "",
    ville: raw.ville ?? "",
  };
  const navigate = useNavigate({ from: Route.fullPath });
  const { data: categories = [] } = useQuery(categoriesQuery);
  const { data: fiches = [], isLoading } = useQuery(prestatairesQuery);

  const set = (patch: Partial<Recherche>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }) });

  const villes = Array.from(new Set(fiches.map((f) => f.ville))).sort();

  const resultats = fiches
    .filter((f) => (search.cat ? f.categorie_slug === search.cat : true))
    .filter((f) => (search.ville ? f.ville === search.ville : true))
    .filter((f) => (search.dep ? f.deplacement === search.dep : true))
    .filter((f) => {
      if (!search.q) return true;
      const hay = normalise(
        [f.nom, f.activite, f.sous_categorie, f.description, f.ville, f.quartier].join(" "),
      );
      return normalise(search.q)
        .split(/\s+/)
        .every((mot) => hay.includes(mot));
    });

  return (
    <PageMagazine>
      <Rubrique
        sur="Pages 12 à 48"
        titre="L'annuaire"
        sous="Toutes les prestataires des Kumi, réunies au même endroit."
      />

      {/* Bloc de recherche façon encart Pages Jaunes */}
      <section className="encart-jaune p-4">
        <label className="label-annonce mb-2 block">🔎 Que recherchez-vous ?</label>
        <input
          value={search.q}
          onChange={(e) => set({ q: e.target.value })}
          placeholder="MUA, coiffeuse, photographe…"
          className="w-full border border-border bg-papier px-3 py-3 text-base outline-none focus: shadow-[0_0_0_3px_oklch(0.53_0.185_12_/_12%)]"
        />

        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div>
            <label className="label-annonce mb-1 block">Rubrique</label>
            <select
              value={search.cat}
              onChange={(e) => set({ cat: e.target.value })}
              className="w-full border border-border bg-papier px-2 py-2 text-sm"
            >
              <option value="">Toutes</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.icone} {c.nom}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-annonce mb-1 block">Localisation</label>
            <select
              value={search.ville}
              onChange={(e) => set({ ville: e.target.value })}
              className="w-full border border-border bg-papier px-2 py-2 text-sm"
            >
              <option value="">Partout</option>
              {villes.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-annonce mb-1 block">Déplacement</label>
            <select
              value={search.dep}
              onChange={(e) => set({ dep: e.target.value })}
              className="w-full border border-border bg-papier px-2 py-2 text-sm"
            >
              <option value="">Peu importe</option>
              <option value="se_deplace">🩷 Se déplace</option>
              <option value="sur_place">🏠 Sur place</option>
              <option value="sur_demande">🟡 Sur demande</option>
            </select>
          </div>
        </div>

        {search.q || search.cat || search.ville || search.dep ? (
          <button
            onClick={() => navigate({ search: { q: "", cat: "", dep: "", ville: "" } })}
            className="label-annonce mt-3 border border-border bg-papier px-3 py-1.5"
          >
            ✕ Effacer les filtres
          </button>
        ) : null}
      </section>

      <div className="mt-6 flex items-center justify-between">
        <Etiquette ton="encre">
          {isLoading ? "Chargement…" : `${resultats.length} prestataire${resultats.length > 1 ? "s" : ""}`}
        </Etiquette>
        <p className="label-annonce text-muted-foreground">Classées par ordre alphabétique</p>
      </div>

      <div className="mt-5 grid gap-6">
        {resultats.map((f, i) => (
          <FicheCard
            key={f.id}
            fiche={f}
            numero={i + 1}
            categorie={categories.find((c) => c.slug === f.categorie_slug)}
          />
        ))}
      </div>

      {!isLoading && resultats.length === 0 ? (
        <div className="encart mt-6 p-6 text-center">
          <p className="font-display text-xl">Aucune fiche pour cette recherche.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Essaie un autre mot-clé, ou élargis la rubrique. 💗
          </p>
        </div>
      ) : null}

      <NumeroDePage n={12} mention="L'annuaire" />
    </PageMagazine>
  );
}
