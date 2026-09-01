import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageMagazine } from "@/components/pr/layout";
import { Etiquette, NumeroDePage, Rubrique } from "@/components/pr/bits";
import { PictoRubrique } from "@/components/pr/ornements";
import { categoriesQuery, prestatairesQuery, SOUS_RUBRIQUES } from "@/lib/pages-roses";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Les rubriques — Les Pages Roses" },
      {
        name: "description",
        content:
          "Beauté, mode & style, événementiel, création, food et autres services : le sommaire complet des rubriques des Pages Roses.",
      },
      { property: "og:title", content: "Les rubriques — Les Pages Roses" },
      {
        property: "og:description",
        content: "Le sommaire de l'annuaire des Kumi, rubrique par rubrique.",
      },
    ],
  }),
  component: Categories,
});

function Categories() {
  const { data: categories = [] } = useQuery(categoriesQuery);
  const { data: fiches = [] } = useQuery(prestatairesQuery);

  return (
    <PageMagazine>
      <Rubrique
        sur="Sommaire général"
        titre="Les rubriques"
        sous="Chaque rubrique, ses spécialités, ses bonnes adresses."
      />

      <div className="grid gap-6">
        {categories.map((c, i) => {
          const nb = fiches.filter((f) => f.categorie_slug === c.slug).length;
          return (
            <section key={c.id} className={i % 2 === 0 ? "encart p-4 sm:p-5" : "encart-rose p-4 sm:p-5"}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="label-annonce text-bordeaux">Rubrique {i + 1}</p>
                  <h2 className="rubrique flex items-center gap-3 text-2xl sm:text-4xl">
                    <PictoRubrique slug={c.slug} className="w-7 shrink-0 text-rose sm:w-9" />
                    {c.nom}
                  </h2>
                  {c.description ? (
                    <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                  ) : null}
                </div>
                <Etiquette ton="jaune">{nb} fiche{nb > 1 ? "s" : ""}</Etiquette>
              </div>

              <ul className="mt-4 flex flex-wrap gap-2">
                {(SOUS_RUBRIQUES[c.slug] ?? []).map((s) => (
                  <li key={s}>
                    <Link
                      to="/annuaire"
                      search={{ q: s, cat: c.slug, dep: "", dept: "" }}
                      className="label-annonce inline-block border border-border bg-papier px-2.5 py-1.5 rounded-full"
                    >
                      ✦ {s}
                    </Link>
                  </li>
                ))}
              </ul>

              <Link
                to="/annuaire"
                search={{ q: "", cat: c.slug, dep: "", dept: "" }}
                className="rubrique mt-4 inline-block border border-border bg-jaune px-3 py-2 shadow-sm rounded-full"
              >
                Feuilleter la rubrique →
              </Link>
            </section>
          );
        })}
      </div>

      <NumeroDePage n={8} mention="Sommaire" />
    </PageMagazine>
  );
}
