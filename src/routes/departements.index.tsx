import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageMagazine } from "@/components/pr/layout";
import { NumeroDePage, Rubrique } from "@/components/pr/bits";
import { prestatairesQuery } from "@/lib/pages-roses";
import { grouperParDepartement } from "@/lib/departements";

export const Route = createFileRoute("/departements/")({
  head: () => ({
    meta: [
      { title: "Annuaires par département — Les Pages Roses" },
      {
        name: "description",
        content:
          "Choisis ton département : Paris, Seine-Saint-Denis, Val-de-Marne, Essonne… et découvre toutes les prestataires des Kumi près de chez toi.",
      },
      { property: "og:title", content: "Annuaires par département — Les Pages Roses" },
      {
        property: "og:description",
        content: "Un annuaire par département : toutes les prestataires près de chez toi.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Departements,
});

function Departements() {
  const { data: fiches = [], isLoading } = useQuery(prestatairesQuery);
  const groupes = grouperParDepartement(fiches);

  return (
    <PageMagazine>
      <Rubrique
        sur="Par département"
        titre="Les annuaires près de chez toi"
        sous="Chaque département a sa page : toutes les prestataires qui y exercent, réunies."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? <p className="oeil text-muted-foreground">Chargement…</p> : null}
        {groupes.map((g) => (
          <Link
            key={g.code}
            to="/departements/$code"
            params={{ code: g.code }}
            className="fiche flex items-center justify-between gap-4 p-6 transition-colors hover:bg-poudre/60"
          >
            <span>
              <span className="oeil block text-rose">
                {/^\d+$/.test(g.code) ? `Dép. ${g.code}` : "Zone"}
              </span>
              <span className="mt-1 block font-display text-2xl leading-tight">{g.nom}</span>
            </span>
            <span className="rubrique text-3xl text-bordeaux">{g.fiches.length}</span>
          </Link>
        ))}
      </div>

      <NumeroDePage mention="Par département" />
    </PageMagazine>
  );
}
