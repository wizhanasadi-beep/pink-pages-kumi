import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageMagazine } from "@/components/pr/layout";
import { NumeroDePage, Rubrique } from "@/components/pr/bits";
import { FicheCard } from "@/components/pr/FicheCard";
import { categoriesQuery, normalise, prestatairesQuery } from "@/lib/pages-roses";

type Recherche = { q?: string; cat?: string; dep?: string; ville?: string; type?: string };

export const Route = createFileRoute("/annuaire")({
  validateSearch: (s: Record<string, unknown>): Recherche => ({
    q: typeof s["q"] === "string" ? (s["q"] as string) : "",
    cat: typeof s["cat"] === "string" ? (s["cat"] as string) : "",
    dep: typeof s["dep"] === "string" ? (s["dep"] as string) : "",
    ville: typeof s["ville"] === "string" ? (s["ville"] as string) : "",
    type: typeof s["type"] === "string" ? (s["type"] as string) : "",
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

  const nbFiltres = [search.cat, search.ville, search.dep].filter(Boolean).length;
  const [filtresOuverts, setFiltresOuverts] = useState(nbFiltres > 0);


  return (
    <PageMagazine>
      <Rubrique
        sur="Annuaire"
        titre="Toutes les prestataires"
        sous="Recherche par nom, activité, rubrique, ville ou zone de déplacement."
      />

      {/* Barre de recherche & filtres */}
      <section className="border-y border-border py-5">
        <label htmlFor="q" className="oeil block text-muted-foreground">
          Rechercher
        </label>
        <input
          id="q"
          value={search.q}
          onChange={(e) => set({ q: e.target.value })}
          placeholder="MUA, coiffeuse, photographe…"
          className="mt-2 w-full rounded-none border-0 border-b border-border bg-transparent pb-2.5 font-display text-xl outline-none placeholder:text-muted-foreground/60 focus:border-rose sm:text-3xl"
        />

        <button
          type="button"
          onClick={() => setFiltresOuverts((v) => !v)}
          className="oeil mt-4 flex w-full items-center justify-between py-2 text-bordeaux sm:hidden"
          aria-expanded={filtresOuverts}
        >
          <span>Filtrer{nbFiltres ? ` · ${nbFiltres}` : ""}</span>
          <span className={filtresOuverts ? "rotate-180" : ""}>▾</span>
        </button>

        <div className={filtresOuverts ? "block" : "hidden sm:block"}>
          <div className="mt-3 grid gap-4 sm:mt-6 sm:grid-cols-3 sm:gap-5">

            <div>
              <label className="oeil mb-2 block text-muted-foreground">Rubrique</label>
              <select
                value={search.cat}
                onChange={(e) => set({ cat: e.target.value })}
                className="w-full border border-border bg-papier px-3 py-2.5 text-sm rounded-full"
              >
                <option value="">Toutes</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.nom}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="oeil mb-2 block text-muted-foreground">Localisation</label>
              <select
                value={search.ville}
                onChange={(e) => set({ ville: e.target.value })}
                className="w-full border border-border bg-papier px-3 py-2.5 text-sm rounded-full"
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
              <label className="oeil mb-2 block text-muted-foreground">Déplacement</label>
              <select
                value={search.dep}
                onChange={(e) => set({ dep: e.target.value })}
                className="w-full border border-border bg-papier px-3 py-2.5 text-sm rounded-full"
              >
                <option value="">Peu importe</option>
                <option value="se_deplace">Se déplace</option>
                <option value="sur_place">Sur place</option>
                <option value="sur_demande">Sur demande</option>
              </select>
            </div>
          </div>

          {search.q || search.cat || search.ville || search.dep ? (
            <button
              onClick={() => navigate({ search: { q: "", cat: "", dep: "", ville: "" } })}
              className="oeil mt-4 border-b border-rose pb-0.5"
            >
              Effacer les filtres
            </button>
          ) : null}
        </div>
      </section>


      <div className="mt-8 flex items-center justify-between">
        <p className="oeil text-muted-foreground">
          {isLoading
            ? "Chargement…"
            : `${resultats.length} prestataire${resultats.length > 1 ? "s" : ""}`}
        </p>
        <p className="oeil text-muted-foreground">Ordre alphabétique</p>
      </div>

      <div className="mt-6 grid gap-6">
        {resultats.map((f) => (
          <FicheCard
            key={f.id}
            fiche={f}
            categorie={categories.find((c) => c.slug === f.categorie_slug)}
          />
        ))}
      </div>

      {!isLoading && resultats.length === 0 ? (
        <div className="fiche mt-8 p-10 text-center">
          <p className="font-display text-2xl">Aucune fiche pour cette recherche.</p>
          <p className="mt-3 text-sm text-muted-foreground">
            Essaie un autre mot-clé, ou élargis la rubrique.
          </p>
        </div>
      ) : null}

      <NumeroDePage mention="L'annuaire" />
    </PageMagazine>
  );
}
