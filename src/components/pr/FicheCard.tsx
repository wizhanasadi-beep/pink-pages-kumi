import { Link } from "@tanstack/react-router";
import { BadgeDeplacement, Etiquette, PhotoFiche } from "@/components/pr/bits";
import type { Categorie, Prestataire } from "@/lib/pages-roses";

export function FicheCard({
  fiche,
  categorie,
  numero,
}: {
  fiche: Prestataire;
  categorie?: Categorie | undefined;
  numero?: number | undefined;
}) {
  return (
    <article className="encart relative flex flex-col p-3 transition-transform hover:-translate-y-0.5 sm:flex-row sm:gap-4 sm:p-4">
      {numero !== undefined ? (
        <span className="label-annonce absolute -top-2.5 left-3 border border-border bg-jaune px-1.5">
          n° {String(numero).padStart(2, "0")}
        </span>
      ) : null}

      <PhotoFiche
        nom={fiche.nom}
        url={fiche.photo_url}
        ratio="aspect-[4/3] sm:aspect-[3/4]"
        className="sm:w-32 sm:shrink-0"
      />

      <div className="mt-3 flex flex-1 flex-col sm:mt-0">
        <p className="label-annonce text-bordeaux">
          {categorie ? `${categorie.icone} ${categorie.nom}` : "✦ Annuaire"}
          {fiche.sous_categorie ? ` · ${fiche.sous_categorie}` : ""}
        </p>
        <h3 className="mt-1 text-xl leading-tight font-bold">{fiche.nom}</h3>
        <p className="rubrique text-rose text-lg">{fiche.activite}</p>

        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{fiche.description}</p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Etiquette>
            📍 {fiche.ville}
            {fiche.quartier ? ` · ${fiche.quartier}` : ""}
          </Etiquette>
          <BadgeDeplacement mode={fiche.deplacement} />
        </div>

        <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
          <Link
            to="/prestataire/$id"
            params={{ id: fiche.id }}
            className="label-annonce border border-border bg-rose px-2.5 py-1.5 text-rose-foreground shadow-sm"
          >
            Voir la fiche
          </Link>
          {fiche.instagram ? (
            <a
              href={fiche.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="label-annonce border border-border bg-papier px-2.5 py-1.5"
            >
              Instagram
            </a>
          ) : null}
          {fiche.lien_reservation ? (
            <a
              href={fiche.lien_reservation}
              target="_blank"
              rel="noopener noreferrer"
              className="label-annonce border border-border bg-jaune px-2.5 py-1.5"
            >
              Rendez-vous
            </a>
          ) : null}
          {fiche.site_web ? (
            <a
              href={fiche.site_web}
              target="_blank"
              rel="noopener noreferrer"
              className="label-annonce border border-border bg-papier px-2.5 py-1.5"
            >
              Site web
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
