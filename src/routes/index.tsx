import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageAplats } from "@/components/pr/layout";
import { LettrageHero, Glyphe } from "@/components/pr/Logo";
import { FicheCard } from "@/components/pr/FicheCard";
import { categoriesQuery, prestatairesQuery, SOUS_RUBRIQUES } from "@/lib/pages-roses";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Les Pages Roses — L'annuaire des Kumi" },
      {
        name: "description",
        content:
          "L'annuaire des prestataires féminines de la communauté Kumi : MUA, coiffeuses, photographes, pâtissières, wedding planners. Trouve la bonne adresse en quelques secondes.",
      },
      { property: "og:title", content: "Les Pages Roses — L'annuaire des Kumi" },
      {
        property: "og:description",
        content: "À la recherche d'une prestataire ? On sait où chercher.",
      },
    ],
  }),
  component: Accueil,
});

function Accueil() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const { data: categories = [] } = useQuery(categoriesQuery);
  const { data: fiches = [] } = useQuery(prestatairesQuery);
  const aLaUne = fiches.slice(0, 3);

  return (
    <PageAplats>
      {/* —— HERO : grand aplat rose + lettrage —— */}
      <section className="aplat-rose">
        <div className="mx-auto max-w-6xl px-5 pb-14 pt-14 sm:pb-20 sm:pt-20">
          <div className="flex items-center justify-between">
            <p className="oeil">Édition n° 01</p>
            <p className="oeil">L'annuaire des Kumi</p>
          </div>

          <LettrageHero className="mt-10 text-rose-foreground" />

          <p className="mt-10 max-w-lg font-display text-2xl leading-snug sm:text-3xl">
            À la recherche d'une prestataire ? On sait où chercher.
          </p>

          <form
            className="mt-8 max-w-2xl"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/annuaire", search: { q, cat: "", dep: "", ville: "" } });
            }}
          >
            <label htmlFor="recherche" className="oeil block">
              Rechercher
            </label>
            <div className="mt-3 flex items-center gap-4 border-b border-encre/40 pb-2">
              <input
                id="recherche"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="MUA, coiffeuse, photographe…"
                className="min-w-0 flex-1 bg-transparent font-display text-2xl outline-none placeholder:text-encre/45 sm:text-3xl"
              />
              <button type="submit" className="oeil shrink-0 bg-encre px-5 py-3 text-background">
                Chercher
              </button>
            </div>
          </form>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            <Link
              to="/annuaire"
              search={{ q: "", cat: "", dep: "", ville: "" }}
              className="oeil border-b border-encre pb-0.5"
            >
              Feuilleter l'annuaire
            </Link>
            <Link to="/carte" className="oeil border-b border-encre pb-0.5">
              Trouver près de moi
            </Link>
          </div>
        </div>
      </section>

      {/* —— RUBRIQUES —— */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="oeil text-rose">Sommaire</p>
            <h2 className="mt-3 text-4xl leading-none sm:text-6xl">Les rubriques</h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Six rubriques, une seule adresse. Beauté, mode, événementiel, création, food et le
            reste.
          </p>
        </div>

        <div className="mt-12 grid gap-x-10 gap-y-10 border-t border-border pt-10 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <Link
              key={c.id}
              to="/annuaire"
              search={{ q: "", cat: c.slug, dep: "", ville: "" }}
              className="group flex flex-col"
            >
              <div className="flex items-baseline justify-between">
                <span className="oeil text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Glyphe className="w-6 text-rose opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <h3 className="mt-3 text-3xl leading-none transition-colors group-hover:text-rose">
                {c.nom}
              </h3>
              <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
                {(SOUS_RUBRIQUES[c.slug] ?? []).map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </section>

      {/* —— CITATION / APLAT POUDRE —— */}
      <section className="aplat-poudre">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:py-28">
          <Glyphe className="mx-auto w-12 text-rose" />
          <p className="mt-8 font-display text-3xl leading-tight sm:text-5xl">
            « Une coiffure pour ton prochain événement&nbsp;? On a ce qu'il te faut. »
          </p>
          <Link
            to="/annuaire"
            search={{ q: "", cat: "beaute", dep: "", ville: "" }}
            className="oeil mt-10 inline-block bg-encre px-6 py-3.5 text-background"
          >
            Voir la rubrique Beauté
          </Link>
        </div>
      </section>

      {/* —— À LA UNE —— */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <div className="flex items-end justify-between">
          <div>
            <p className="oeil text-rose">À la une</p>
            <h2 className="mt-3 text-4xl leading-none sm:text-6xl">Elles ouvrent le bal</h2>
          </div>
          <Link
            to="/annuaire"
            search={{ q: "", cat: "", dep: "", ville: "" }}
            className="oeil hidden border-b border-rose pb-0.5 sm:block"
          >
            Tout voir
          </Link>
        </div>
        <div className="mt-12 grid gap-6">
          {aLaUne.map((f) => (
            <FicheCard
              key={f.id}
              fiche={f}
              categorie={categories.find((c) => c.slug === f.categorie_slug)}
            />
          ))}
        </div>
      </section>

      {/* —— APPEL PRESTATAIRES —— */}
      <section className="aplat-encre">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-20 sm:flex-row sm:items-end sm:justify-between sm:py-24">
          <div className="max-w-xl">
            <p className="oeil text-rose">Tu es prestataire ?</p>
            <h2 className="mt-3 text-4xl leading-none text-background sm:text-6xl">
              Référence ton activité
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-background/70">
              Ta fiche est vérifiée par la rédaction avant d'être publiée dans les Pages Roses.
            </p>
          </div>
          <Link
            to="/referencer"
            className="oeil shrink-0 bg-rose px-6 py-3.5 text-rose-foreground"
          >
            Remplir ma fiche
          </Link>
        </div>
      </section>
    </PageAplats>
  );
}
