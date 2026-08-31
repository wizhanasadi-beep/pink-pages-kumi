import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageMagazine } from "@/components/pr/layout";
import { NumeroDePage, Rubrique } from "@/components/pr/bits";
import { FicheCard } from "@/components/pr/FicheCard";
import { Partager } from "@/components/pr/Partager";
import { categoriesQuery, prestatairesQuery } from "@/lib/pages-roses";
import { departementDeFiche, nomDepartement } from "@/lib/departements";

export const Route = createFileRoute("/departements/$code")({
  head: ({ params }) => {
    const nom = nomDepartement(params.code);
    const titre = `Prestataires — ${nom} | Les Pages Roses`;
    const desc = `Toutes les prestataires des Kumi à ${nom} : beauté, mode, événementiel, création, food et plus encore.`;
    return {
      meta: [
        { title: titre },
        { name: "description", content: desc },
        { property: "og:title", content: titre },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: PageDepartement,
});

function PageDepartement() {
  const { code } = Route.useParams();
  const nom = nomDepartement(code);
  const { data: fiches = [], isLoading } = useQuery(prestatairesQuery);
  const { data: categories = [] } = useQuery(categoriesQuery);
  const resultats = fiches.filter((f) => departementDeFiche(f) === code);
  const villes = Array.from(new Set(resultats.map((f) => f.ville))).sort();

  return (
    <PageMagazine>
      <Link to="/departements" className="label-annonce inline-block">
        ← Tous les départements
      </Link>

      <Rubrique
        sur={/^\d+$/.test(code) ? `Département ${code}` : "Zone"}
        titre={nom}
        sous={
          villes.length
            ? `Villes représentées : ${villes.join(" · ")}`
            : "Aucune prestataire référencée pour le moment."
        }
      />

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <p className="oeil text-muted-foreground">
          {isLoading
            ? "Chargement…"
            : `${resultats.length} prestataire${resultats.length > 1 ? "s" : ""}`}
        </p>
        <Partager titre={`Prestataires à ${nom} — Les Pages Roses`} />
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
          <p className="font-display text-2xl">Personne ici pour l'instant.</p>
          <Link
            to="/referencer"
            className="oeil mt-4 inline-block rounded-full bg-encre px-5 py-3 text-background"
          >
            Référencer mon activité
          </Link>
        </div>
      ) : null}

      <NumeroDePage mention={nom} />
    </PageMagazine>
  );
}
