import { Link } from "@tanstack/react-router";
import { BadgeDeplacement, PhotoFiche } from "@/components/pr/bits";
import type { Categorie, Prestataire } from "@/lib/pages-roses";

export function FicheCard({
  fiche,
  categorie,
}: {
  fiche: Prestataire;
  categorie?: Categorie | undefined;
  numero?: number | undefined;
}) {
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
        <p className="mt-1.5 text-base text-bordeaux">{fiche.activite}</p>

        <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {fiche.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="oeil border border-border px-2.5 py-1 text-muted-foreground rounded-full">
            {fiche.ville}
            {fiche.quartier ? ` · ${fiche.quartier}` : ""}
          </span>
          <BadgeDeplacement mode={fiche.deplacement} />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
          <Link
            to="/prestataire/$id"
            params={{ id: fiche.id }}
            className="oeil bg-encre px-5 py-3 text-background transition-opacity hover:opacity-85 rounded-full"
          >
            Consulter
          </Link>
          {fiche.instagram ? (
            <a
              href={fiche.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="oeil border-b border-rose pb-0.5 text-bordeaux"
            >
              Instagram
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
          {fiche.site_web ? (
            <a
              href={fiche.site_web}
              target="_blank"
              rel="noopener noreferrer"
              className="oeil border-b border-rose pb-0.5 text-bordeaux"
            >
              Site web
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
