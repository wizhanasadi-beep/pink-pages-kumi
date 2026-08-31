import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import collage from "@/assets/cover-collage.png";
import { PageMagazine } from "@/components/pr/layout";
import { Etiquette, Filet, NumeroDePage, Rubrique } from "@/components/pr/bits";
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
        content: "À la recherche d'une prestataire ? On sait où chercher. 💗",
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
    <PageMagazine>
      {/* —— COUVERTURE —— */}
      <section className="cadre-double bg-papier px-4 py-6 sm:px-8 sm:py-10">
        <div className="flex items-center justify-between">
          <Etiquette ton="jaune">Édition n° 01</Etiquette>
          <Etiquette ton="rose">Gratuit</Etiquette>
        </div>

        <h1 className="logo-pages-roses mt-5 text-5xl text-rose sm:text-7xl">
          Les
          <br />
          Pages
          <br />
          Roses
        </h1>
        <p className="rubrique mt-3 text-xl text-bordeaux sm:text-2xl">L'annuaire des Kumi</p>

        <img
          src={collage}
          alt="Illustration rétro : téléphone rose, fleurs, rouge à lèvres, part de gâteau et appareil photo"
          width={1024}
          height={1024}
          className="mx-auto mt-4 w-full max-w-sm"
        />

        <Filet className="my-5" />

        <p className="font-display text-lg sm:text-xl">
          À la recherche d'une prestataire ? On sait où chercher. 💗
        </p>

        <form
          className="mt-5"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/annuaire", search: { q, cat: "", dep: "", ville: "" } });
          }}
        >
          <label className="label-annonce mb-2 block">🔎 Que recherchez-vous ?</label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="MUA, coiffeuse, photographe…"
              className="flex-1 border border-border bg-background px-3 py-3 text-base outline-none placeholder:text-muted-foreground focus: shadow-[0_0_0_3px_oklch(0.53_0.185_12_/_12%)]"
            />
            <button
              type="submit"
              className="rubrique border border-border bg-rose px-5 py-3 text-lg text-rose-foreground shadow-sm"
            >
              Chercher
            </button>
          </div>
        </form>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link
            to="/annuaire"
            search={{ q: "", cat: "", dep: "", ville: "" }}
            className="rubrique border border-border bg-jaune px-4 py-4 text-center text-lg shadow-sm"
          >
            📖 Feuilleter l'annuaire
          </Link>
          <Link
            to="/carte"
            className="rubrique border border-border bg-poudre px-4 py-4 text-center text-lg shadow-sm"
          >
            📍 Trouver près de moi
          </Link>
        </div>
      </section>

      {/* —— SOMMAIRE / RUBRIQUES —— */}
      <section className="mt-12">
        <Rubrique
          sur="Sommaire"
          titre="Les rubriques"
          sous="Tu cherches une MUA ? On sait où regarder. 💄"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <Link
              key={c.id}
              to="/annuaire"
              search={{ q: "", cat: c.slug, dep: "", ville: "" }}
              className="encart-rose flex flex-col p-4 transition-transform hover:-translate-y-0.5"
            >
              <div className="flex items-baseline justify-between">
                <span className="text-3xl" aria-hidden>
                  {c.icone}
                </span>
                <span className="label-annonce text-muted-foreground">
                  p. {String((i + 1) * 12).padStart(2, "0")}
                </span>
              </div>
              <h3 className="rubrique mt-2 text-2xl">{c.nom}</h3>
              <ul className="mt-2 space-y-0.5 text-sm">
                {(SOUS_RUBRIQUES[c.slug] ?? []).map((s) => (
                  <li key={s} className="flex items-center gap-2">
                    <span className="text-rose">✦</span> {s}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </section>

      {/* —— ENCART PAGES JAUNES —— */}
      <section className="encart-jaune mt-12 p-5 text-center">
        <p className="label-annonce">Petite annonce</p>
        <p className="font-display mt-2 text-2xl leading-tight">
          « Une coiffure pour ton prochain événement ? On a ce qu'il te faut. »
        </p>
        <Link
          to="/annuaire"
          search={{ q: "", cat: "beaute", dep: "", ville: "" }}
          className="rubrique mt-4 inline-block border border-border bg-papier px-4 py-2 text-lg shadow-sm"
        >
          Voir la rubrique Beauté
        </Link>
      </section>

      {/* —— À LA UNE —— */}
      <section className="mt-12">
        <Rubrique sur="À la une" titre="Elles ouvrent le bal" sous="Trois fiches choisies dans l'annuaire." />
        <div className="grid gap-5">
          {aLaUne.map((f, i) => (
            <FicheCard
              key={f.id}
              fiche={f}
              numero={i + 1}
              categorie={categories.find((c) => c.slug === f.categorie_slug)}
            />
          ))}
        </div>
      </section>

      {/* —— APPEL PRESTATAIRES —— */}
      <section className="encart mt-12 p-5">
        <p className="label-annonce text-bordeaux">Tu es prestataire ?</p>
        <h2 className="rubrique mt-1 text-3xl">Référence ton activité</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Ta fiche est vérifiée par la rédaction avant d'être publiée dans les Pages Roses.
        </p>
        <Link
          to="/referencer"
          className="rubrique mt-4 inline-block border border-border bg-rose px-4 py-2.5 text-lg text-rose-foreground shadow-sm"
        >
          Remplir ma fiche →
        </Link>
      </section>

      <NumeroDePage n={1} mention="Couverture" />
    </PageMagazine>
  );
}
