import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageMagazine } from "@/components/pr/layout";
import { BadgeDeplacement, Etiquette, Filet, NumeroDePage, PhotoFiche } from "@/components/pr/bits";
import { categoriesQuery, DEPLACEMENT_LABEL, prestataireQuery } from "@/lib/pages-roses";

export const Route = createFileRoute("/prestataire/$id")({
  head: () => ({
    meta: [
      { title: "Fiche prestataire — Les Pages Roses" },
      {
        name: "description",
        content:
          "Découvre l'activité d'une prestataire des Kumi : rubrique, localisation, déplacement et liens pour la contacter.",
      },
      { property: "og:title", content: "Fiche prestataire — Les Pages Roses" },
      {
        property: "og:description",
        content: "Les bonnes adresses des Kumi, réunies au même endroit.",
      },
    ],
  }),
  component: Fiche,
});

function Fiche() {
  const { id } = Route.useParams();
  const { data: fiche, isLoading } = useQuery(prestataireQuery(id));
  const { data: categories = [] } = useQuery(categoriesQuery);
  const categorie = categories.find((c) => c.slug === fiche?.categorie_slug);

  if (isLoading) {
    return (
      <PageMagazine>
        <p className="label-annonce">Chargement de la fiche…</p>
      </PageMagazine>
    );
  }

  if (!fiche) {
    return (
      <PageMagazine>
        <div className="encart p-6 text-center">
          <p className="font-display text-2xl">Cette fiche n'est pas (encore) publiée.</p>
          <Link
            to="/annuaire"
            search={{ q: "", cat: "", dep: "", ville: "" }}
            className="rubrique mt-4 inline-block border border-border bg-rose px-4 py-2 text-rose-foreground shadow-sm"
          >
            Retour à l'annuaire
          </Link>
        </div>
      </PageMagazine>
    );
  }

  const liens = [
    fiche.instagram ? { label: "Instagram", href: fiche.instagram, ton: "rose" } : null,
    fiche.site_web ? { label: "Site web", href: fiche.site_web, ton: "papier" } : null,
    fiche.lien_reservation
      ? { label: "Prendre rendez-vous", href: fiche.lien_reservation, ton: "jaune" }
      : null,
    fiche.telephone ? { label: "Appeler", href: `tel:${fiche.telephone}`, ton: "poudre" } : null,
  ].filter(Boolean) as { label: string; href: string; ton: string }[];

  const tons: Record<string, string> = {
    rose: "bg-rose text-rose-foreground",
    jaune: "bg-jaune text-jaune-foreground",
    poudre: "bg-poudre text-encre",
    papier: "bg-papier text-encre",
  };

  return (
    <PageMagazine>
      <Link
        to="/annuaire"
        search={{ q: "", cat: "", dep: "", ville: "" }}
        className="label-annonce inline-block"
      >
        ← Retour à l'annuaire
      </Link>

      <article className="cadre-double mt-4 bg-papier p-4 sm:p-8">
        <PhotoFiche nom={fiche.nom} url={fiche.photo_url} ratio="aspect-[4/3]" />

        <p className="label-annonce mt-5 text-bordeaux">
          Rubrique : {categorie ? categorie.nom : "Annuaire"}
          {fiche.sous_categorie ? ` · ${fiche.sous_categorie}` : ""}
        </p>
        <h1 className="logo-pages-roses mt-1 text-4xl sm:text-5xl">{fiche.nom}</h1>
        <p className="rubrique text-2xl text-rose">{fiche.activite}</p>

        <div className="mt-4">
          <BadgeDeplacement mode={fiche.deplacement} className="text-sm" />
        </div>

        <Filet className="my-6" />

        <p className="font-display text-lg leading-relaxed">{fiche.description}</p>

        <section className="encart mt-6 p-4">
          <p className="label-annonce text-bordeaux">Informations pratiques</p>
          <ul className="mt-2 space-y-1.5 text-sm">
            <li>
              📍 <strong>Localisation :</strong> {fiche.ville}
              {fiche.quartier ? ` — ${fiche.quartier}` : ""}
            </li>
            <li>
              🚗 <strong>Se déplace :</strong>{" "}
              {fiche.deplacement === "se_deplace"
                ? "Oui"
                : fiche.deplacement === "sur_demande"
                  ? "Sur demande"
                  : "Non"}
            </li>
            {fiche.zone_deplacement ? (
              <li>
                📍 <strong>Zone de déplacement :</strong> {fiche.zone_deplacement}
              </li>
            ) : null}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            Par respect de sa vie privée, aucune adresse personnelle n'est publiée.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="rubrique text-3xl">La retrouver</h2>
          <div className="filet mt-3 mb-4" />
          <div className="grid gap-3 sm:grid-cols-2">
            {liens.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith("tel:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className={`rubrique border border-border px-4 py-3 text-center text-lg shadow-sm ${tons[l.ton]}`}
              >
                {l.label}
              </a>
            ))}
          </div>
          {liens.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucun lien renseigné pour le moment. Reviens bientôt 💗
            </p>
          ) : null}
        </section>

        <div className="mt-8 flex flex-wrap gap-2">
          <Etiquette ton="jaune">{DEPLACEMENT_LABEL[fiche.deplacement].texte}</Etiquette>
          <Etiquette>Fiche vérifiée par la rédaction</Etiquette>
        </div>
      </article>

      <NumeroDePage n={24} mention={fiche.activite} />
    </PageMagazine>
  );
}
