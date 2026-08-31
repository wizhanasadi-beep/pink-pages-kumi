import { Link } from "@tanstack/react-router";
import { BadgeDeplacement, BadgeType, PhotoFiche } from "@/components/pr/bits";
import { poigneeOuDomaine, type Categorie, type Prestataire } from "@/lib/pages-roses";

export function FicheCard({
  fiche,
  categorie,
}: {
  fiche: Prestataire;
  categorie?: Categorie | undefined;
  numero?: number | undefined;
}) {
  const lien = fiche.site_web ?? fiche.instagram;

  return (
    <article className="fiche group grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4 p-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-7 sm:p-7">
      <PhotoFiche
        nom={fiche.nom}
        url={fiche.photo_url}
        ratio="aspect-square sm:aspect-[4/5]"
        className="w-[5.5rem] sm:w-40"
      />

      <div className="flex min-w-0 flex-col">
        <p className="oeil text-rose">
          {categorie ? categorie.nom : "Annuaire"}
          {fiche.sous_categorie ? ` · ${fiche.sous_categorie}` : ""}
        </p>

        <h3 className="mt-2 text-2xl leading-none sm:text-3xl">{fiche.nom}</h3>
        {fiche.prenom ? (
          <p className="mt-1.5 text-base text-bordeaux">par {fiche.prenom}</p>
        ) : null}
        <p className="mt-1 text-sm text-muted-foreground">{fiche.activite}</p>

        <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {fiche.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <BadgeType type={fiche.type_offre} />
          <span className="oeil rounded-full border border-border px-2.5 py-1 text-muted-foreground">
            {fiche.ville}
            {fiche.quartier ? ` · ${fiche.quartier}` : ""}
          </span>
          <BadgeDeplacement mode={fiche.deplacement} />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
          <Link
            to="/prestataire/$id"
            params={{ id: fiche.id }}
            className="oeil rounded-full bg-encre px-5 py-3 text-background transition-opacity hover:opacity-85"
          >
            Consulter
          </Link>
          {lien ? (
            <a
              href={lien}
              target="_blank"
              rel="noopener noreferrer"
              className="oeil border-b border-rose pb-0.5 text-bordeaux"
            >
              {poigneeOuDomaine(lien)}
            </a>
          ) : null}
          {fiche.lien_reservation ? (
            <a
              href={fiche.lien_reservation}
              target="_blank"
              rel="noopener noreferrer"
              className="oeil border-b border-rose pb-0.5 text-bordeaux"
            >
              Rendez-vous
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
