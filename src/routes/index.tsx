import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageAplats } from "@/components/pr/layout";
import { LettrageHero } from "@/components/pr/Logo";
import { Couverture } from "@/components/pr/Couverture";
import { Reveal } from "@/components/pr/Reveal";
import { Etoile, PictoRubrique, Vague } from "@/components/pr/ornements";
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

const TONS = ["pave-rose", "pave-creme", "pave-poudre", "pave-encre", "pave-creme", "pave-rose"];

function Accueil() {
  const navigate = useNavigate();
  const [couverture, setCouverture] = useState(true);
  const [besoin, setBesoin] = useState("");
  const [ville, setVille] = useState("");
  const { data: categories = [] } = useQuery(categoriesQuery);
  const { data: fiches = [] } = useQuery(prestatairesQuery);
  const aLaUne = fiches.slice(0, 3);
  const villes = Array.from(new Set(fiches.map((f) => f.ville))).sort();
  const compte = (slug: string) => fiches.filter((f) => f.categorie_slug === slug).length;

  const lancer = () => {
    const cat = categories.find((c) => c.slug === besoin);
    pister({ type: "recherche", cible: [besoin, ville].filter(Boolean).join(" · ") || "vide" });
    navigate({
      to: "/annuaire",
      search: { q: cat ? "" : besoin, cat: cat ? cat.slug : "", dep: "", ville },
    });
  };



  return (
    <>
      {couverture ? <Couverture onFin={() => setCouverture(false)} /> : null}

      <PageAplats>
        {/* —— HERO —— */}
        <section className="aplat-rose relative overflow-hidden">

          <div className="mx-auto max-w-6xl px-5 pb-12 pt-8 sm:pb-20 sm:pt-16">
            <div className="flex items-center justify-between">
              <p className="oeil">Édition n° 01</p>
              <p className="oeil">L'annuaire des Kumi</p>
            </div>

            <LettrageHero className="mt-6 sm:mt-8" />

            <p className="mt-6 max-w-lg text-xl leading-snug sm:mt-8 sm:text-3xl">
              À la recherche d'une prestataire&nbsp;? On sait où chercher.
            </p>


            {/* Recherche épurée : quoi + où */}
            <div className="mt-7 w-full max-w-2xl rounded-[2rem] bg-background p-3 shadow-[0_18px_50px_-20px_oklch(0.44_0.16_12/35%)] sm:mt-9 sm:p-4">
              <p className="oeil px-2 pt-1 text-encre/70 sm:px-3">Trouver une prestataire</p>
              <form
                className="mt-2 flex w-full flex-col gap-2 sm:flex-row sm:items-center"
                onSubmit={(e) => {
                  e.preventDefault();
                  lancer();
                }}
              >
                <input
                  id="besoin"
                  list="suggestions"
                  value={besoin}
                  onChange={(e) => setBesoin(e.target.value)}
                  placeholder="Je cherche… MUA, coiffeuse, makeup"
                  aria-label="Que cherches-tu ?"
                  className="min-w-0 flex-1 rounded-full border border-encre/20 bg-papier px-5 py-3.5 text-base outline-none placeholder:text-muted-foreground focus:border-rose focus:ring-2 focus:ring-rose/20"
                />
                <datalist id="suggestions">
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.nom}
                    </option>
                  ))}
                  {Object.values(SOUS_RUBRIQUES)
                    .flat()
                    .map((s) => (
                      <option key={s} value={s} />
                    ))}
                </datalist>

                <select
                  value={ville}
                  onChange={(e) => setVille(e.target.value)}
                  aria-label="Où ?"
                  className="rounded-full border border-encre/20 bg-papier px-5 py-3.5 text-base outline-none focus:border-rose focus:ring-2 focus:ring-rose/20 sm:w-44"
                >
                  <option value="">Partout</option>
                  {villes.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="oeil shrink-0 rounded-full bg-encre px-7 py-3.5 text-background shadow-sm transition-transform hover:-translate-y-0.5"
                >
                  Chercher
                </button>
              </form>
            </div>



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
          <Vague className="text-background" />
        </section>

        {/* —— RUBRIQUES EN PAVÉS —— */}
        <section className="mx-auto max-w-6xl px-5 py-12 sm:py-24">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="oeil text-rose">Sommaire</p>
              <h2 className="mt-3 text-3xl leading-none sm:text-5xl">Les rubriques</h2>
            </div>
            <p className="max-w-sm text-sm text-muted-foreground">
              Six rubriques, une seule adresse. Beauté, mode, événementiel, création, food et le
              reste.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 lg:grid-cols-3">
            {categories.map((c, i) => (
              <Reveal key={c.id} delay={i * 60}>
                <Link
                  to="/annuaire"
                  search={{ q: "", cat: c.slug, dep: "", ville: "" }}
                  className={`pave ${TONS[i % TONS.length]} group flex h-full flex-col justify-between p-4 sm:p-6 hover:-translate-y-1 hover:shadow-[var(--shadow-encart-rose)]`}
                >
                  <PictoRubrique
                    slug={c.slug}
                    className="w-9 opacity-80 transition-transform duration-300 group-hover:scale-110 sm:w-12"
                  />
                  <div className="mt-5 sm:mt-8">
                    <h3 className="text-xl leading-none sm:text-3xl">{c.nom}</h3>
                    <p className="oeil mt-2 opacity-70 sm:mt-3">
                      {compte(c.slug)} fiche{compte(c.slug) > 1 ? "s" : ""}
                    </p>
                    <ul className="mt-3 hidden flex-wrap gap-x-3 gap-y-1 text-sm opacity-80 sm:flex">
                      {(SOUS_RUBRIQUES[c.slug] ?? []).slice(0, 4).map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

        </section>

        {/* —— CITATION —— */}
        <section className="aplat-poudre relative overflow-hidden">
          <div className="mx-auto max-w-4xl px-5 py-14 text-center sm:py-24">
            <Etoile className="mx-auto w-10 text-rose" />
            <p className="mt-6 font-display text-2xl leading-tight sm:text-5xl">
              « Une coiffure pour ton prochain événement&nbsp;? On a ce qu'il te faut. »
            </p>
            <Link
              to="/annuaire"
              search={{ q: "", cat: "beaute", dep: "", ville: "" }}
              className="oeil mt-10 inline-block bg-encre px-6 py-3.5 text-background transition-transform hover:-translate-y-0.5 rounded-full"
            >
              Voir la rubrique Beauté
            </Link>
          </div>
        </section>

        {/* —— À LA UNE —— */}
        <section className="mx-auto max-w-6xl px-5 py-12 sm:py-24">
          <div className="flex items-end justify-between">
            <div>
              <p className="oeil text-rose">À la une</p>
              <h2 className="mt-3 text-3xl leading-none sm:text-5xl">Elles ouvrent le bal</h2>
            </div>
            <Link
              to="/annuaire"
              search={{ q: "", cat: "", dep: "", ville: "" }}
              className="oeil hidden border-b border-rose pb-0.5 sm:block"
            >
              Tout voir
            </Link>
          </div>
          <div className="mt-10 grid gap-6">
            {aLaUne.map((f, i) => (
              <Reveal key={f.id} delay={i * 80}>
                <FicheCard
                  fiche={f}
                  categorie={categories.find((c) => c.slug === f.categorie_slug)}
                />
              </Reveal>
            ))}
          </div>
        </section>

        {/* —— APPEL PRESTATAIRES —— */}
        <section className="aplat-encre">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-14 sm:flex-row sm:items-end sm:justify-between sm:py-24">
            <div className="max-w-xl">
              <p className="oeil text-rose">Tu es prestataire ?</p>
              <h2 className="mt-3 text-4xl leading-none text-background sm:text-5xl">
                Référence ton activité
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-background/70">
                Ta fiche est vérifiée par la rédaction avant d'être publiée dans les Pages Roses.
              </p>
            </div>
            <Link
              to="/referencer"
              className="oeil shrink-0 bg-rose px-6 py-3.5 text-rose-foreground transition-transform hover:-translate-y-0.5 rounded-full"
            >
              Remplir ma fiche
            </Link>
          </div>
        </section>
      </PageAplats>
    </>
  );
}
