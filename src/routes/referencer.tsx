import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageMagazine } from "@/components/pr/layout";
import { Filet, NumeroDePage, Rubrique } from "@/components/pr/bits";
import { categoriesQuery } from "@/lib/pages-roses";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/referencer")({
  head: () => ({
    meta: [
      { title: "Référencer mon activité — Les Pages Roses" },
      {
        name: "description",
        content:
          "Tu es prestataire ? Remplis ta fiche pour rejoindre Les Pages Roses, l'annuaire des Kumi. Chaque demande est vérifiée avant publication.",
      },
      { property: "og:title", content: "Référencer mon activité — Les Pages Roses" },
      {
        property: "og:description",
        content: "Rejoins l'annuaire des Kumi : remplis ta fiche en 2 minutes. 💗",
      },
    ],
  }),
  component: Referencer,
});

const champ =
  "w-full border border-border bg-papier px-3 py-2.5 text-base outline-none focus:shadow-[0_0_0_3px_oklch(0.53_0.185_12_/_12%)]";

function Referencer() {
  const { data: categories = [] } = useQuery(categoriesQuery);
  const [envoye, setEnvoye] = useState(false);

  const mutation = useMutation({
    mutationFn: async (form: FormData) => {
      const v = (k: string) => {
        const value = String(form.get(k) ?? "").trim();
        return value.length > 0 ? value : null;
      };
      const { error } = await supabase.from("prestataires").insert({
        nom: String(form.get("nom") ?? "").trim(),
        activite: String(form.get("activite") ?? "").trim(),
        categorie_slug: String(form.get("categorie") ?? "autres"),
        sous_categorie: v("sous_categorie"),
        description: String(form.get("description") ?? "").trim(),
        photo_url: v("photo_url"),
        instagram: v("instagram"),
        site_web: v("site_web"),
        lien_reservation: v("lien_reservation"),
        telephone: v("telephone"),
        ville: String(form.get("ville") ?? "").trim(),
        quartier: v("quartier"),
        deplacement: (String(form.get("deplacement") ?? "sur_place") as "se_deplace" | "sur_place" | "sur_demande"),
        zone_deplacement: v("zone_deplacement"),
        statut: "en_attente",
      });
      if (error) throw error;
    },
    onSuccess: () => setEnvoye(true),
  });

  if (envoye) {
    return (
      <PageMagazine>
        <section className="cadre-double mt-6 bg-papier p-8 text-center">
          <p className="text-5xl" aria-hidden>
            💗
          </p>
          <h1 className="logo-pages-roses mt-4 text-3xl text-rose">Merci 💗</h1>
          <Filet className="my-5" />
          <p className="font-display text-lg">
            Ta demande a bien été envoyée. Elle sera vérifiée avant d'être ajoutée aux Pages Roses.
          </p>
          <button
            onClick={() => setEnvoye(false)}
            className="label-annonce mt-6 border border-border bg-jaune px-3 py-2"
          >
            Envoyer une autre fiche
          </button>
        </section>
        <NumeroDePage n={60} mention="Référencement" />
      </PageMagazine>
    );
  }

  return (
    <PageMagazine>
      <Rubrique
        sur="Tu es prestataire ?"
        titre="Référence ton activité"
        sous="Remplis ta fiche : la rédaction la vérifie avant publication. Aucune adresse personnelle ne sera affichée."
      />

      <form
        className="encart space-y-5 p-4 sm:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate(new FormData(e.currentTarget));
        }}
      >
        <fieldset className="space-y-3">
          <legend className="label-annonce text-bordeaux">Ton identité</legend>
          <div>
            <label className="label-annonce mb-1 block">Prénom / Nom *</label>
            <input name="nom" required className={champ} placeholder="Amina D." />
          </div>
          <div>
            <label className="label-annonce mb-1 block">Nom de l'activité *</label>
            <input name="activite" required className={champ} placeholder="Glow by Amina" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label-annonce mb-1 block">Rubrique *</label>
              <select name="categorie" required className={champ} defaultValue="beaute">
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.nom}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-annonce mb-1 block">Spécialité</label>
              <input name="sous_categorie" className={champ} placeholder="MUA, Coiffure…" />
            </div>
          </div>
          <div>
            <label className="label-annonce mb-1 block">Description *</label>
            <textarea
              name="description"
              required
              rows={4}
              className={champ}
              placeholder="Raconte ton activité en quelques lignes…"
            />
          </div>
          <div>
            <label className="label-annonce mb-1 block">Photo / logo (lien)</label>
            <input name="photo_url" type="url" className={champ} placeholder="https://…" />
          </div>
        </fieldset>

        <div className="filet" />

        <fieldset className="space-y-3">
          <legend className="label-annonce text-bordeaux">Où te retrouver</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label-annonce mb-1 block">Instagram</label>
              <input name="instagram" type="url" className={champ} placeholder="https://instagram.com/…" />
            </div>
            <div>
              <label className="label-annonce mb-1 block">Site internet</label>
              <input name="site_web" type="url" className={champ} placeholder="https://…" />
            </div>
            <div>
              <label className="label-annonce mb-1 block">Lien de réservation</label>
              <input name="lien_reservation" type="url" className={champ} placeholder="https://…" />
            </div>
            <div>
              <label className="label-annonce mb-1 block">Téléphone</label>
              <input name="telephone" className={champ} placeholder="+33 6 …" />
            </div>
          </div>
        </fieldset>

        <div className="filet" />

        <fieldset className="space-y-3">
          <legend className="label-annonce text-bordeaux">Localisation & déplacement</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label-annonce mb-1 block">Ville *</label>
              <input name="ville" required className={champ} placeholder="Paris" />
            </div>
            <div>
              <label className="label-annonce mb-1 block">Quartier / zone</label>
              <input name="quartier" className={champ} placeholder="10e arrondissement" />
            </div>
          </div>
          <div>
            <label className="label-annonce mb-1 block">Te déplaces-tu ? *</label>
            <select name="deplacement" required className={champ} defaultValue="sur_place">
              <option value="se_deplace">🩷 Oui, je me déplace</option>
              <option value="sur_place">🏠 Non, sur place uniquement</option>
              <option value="sur_demande">🟡 Sur demande</option>
            </select>
          </div>
          <div>
            <label className="label-annonce mb-1 block">Zone de déplacement</label>
            <input name="zone_deplacement" className={champ} placeholder="Île-de-France" />
          </div>
        </fieldset>

        {mutation.isError ? (
          <p className="label-annonce border border-border bg-destructive px-3 py-2 text-destructive-foreground">
            Oups, l'envoi a échoué. Réessaie dans un instant.
          </p>
        ) : null}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="rubrique w-full border border-border bg-rose px-4 py-3 text-xl text-rose-foreground shadow-sm disabled:opacity-60"
        >
          {mutation.isPending ? "Envoi…" : "Envoyer ma fiche →"}
        </button>
        <p className="text-center text-xs text-muted-foreground">
          Aucune fiche n'est publiée sans vérification de la rédaction.
        </p>
      </form>

      <NumeroDePage n={60} mention="Référencement" />
    </PageMagazine>
  );
}
