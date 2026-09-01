import { supabase } from "@/integrations/supabase/client";

type Evenement = {
  type: "visite" | "vue_fiche" | "clic_lien" | "recherche";
  chemin?: string;
  prestataire_id?: string | null;
  cible?: string | null;
};

/** Enregistre un événement d'audience. Silencieux en cas d'échec. */
export function pister(evt: Evenement) {
  if (typeof window === "undefined") return;
  const chemin = (evt.chemin ?? window.location.pathname).slice(0, 300);
  void supabase
    .from("evenements")
    .insert({
      type: evt.type,
      chemin,
      prestataire_id: evt.prestataire_id ?? null,
      cible: evt.cible ? evt.cible.slice(0, 300) : null,
      referent: document.referrer ? document.referrer.slice(0, 300) : null,
    })
    .then(
      () => undefined,
      () => undefined,
    );
}
