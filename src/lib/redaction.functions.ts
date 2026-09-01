import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type StatutFiche = "en_attente" | "publiee" | "refusee";

export type FicheRedaction = {
  id: string;
  nom: string;
  prenom: string | null;
  activite: string;
  type_offre: string;
  categorie_slug: string;
  sous_categorie: string | null;
  description: string;
  ville: string;
  quartier: string | null;
  deplacement: string;
  zone_deplacement: string | null;
  telephone: string | null;
  instagram: string | null;
  site_web: string | null;
  lien_reservation: string | null;
  statut: StatutFiche;
  created_at: string;
};

export type Statistiques = {
  visites: number;
  vuesFiches: number;
  clicsLiens: number;
  recherches: number;
  visites7j: number;
  parJour: { jour: string; visites: number; vues: number; clics: number }[];
  topFiches: { id: string; nom: string; vues: number; clics: number }[];
  topPages: { chemin: string; visites: number }[];
  topLiens: { cible: string; clics: number }[];
};

export type StatutDemandeAcces = "en_attente" | "acceptee" | "refusee";

export type DemandeAcces = {
  id: string;
  user_id: string | null;
  email: string;
  nom: string;
  message: string;
  statut: StatutDemandeAcces;
  created_at: string;
};

type ContexteAuth = { userId: string; claims: { email?: string } };

/** Vérifie que l'appelante est administratrice. La toute première utilisatrice le devient. */
async function garde(context: ContexteAuth) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: role } = await supabaseAdmin
    .from("user_roles")
    .select("id")
    .eq("user_id", context.userId)
    .eq("role", "admin")
    .maybeSingle();
  if (role) return;

  const { count } = await supabaseAdmin
    .from("user_roles")
    .select("id", { count: "exact", head: true })
    .eq("role", "admin");
  if ((count ?? 0) === 0) {
    await supabaseAdmin.from("user_roles").insert({ user_id: context.userId, role: "admin" });
    return;
  }
  throw new Error("Accès rédaction requis");
}

/** État d'accès de la personne connectée (rôle admin + demande éventuelle). */
export const etatAcces = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let admin = false;
    try {
      await garde(context as unknown as ContexteAuth);
      admin = true;
    } catch {
      admin = false;
    }
    const email = String((context.claims as { email?: string })?.email ?? "");
    const { data: demande } = await supabaseAdmin
      .from("demandes_acces")
      .select("statut")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return { admin, email, demande: (demande?.statut ?? null) as StatutDemandeAcces | null };
  });

/** Demande d'accès à l'espace rédaction (ouverte à tout le monde). */
export const demanderAcces = createServerFn({ method: "POST" })
  .validator((data: { email: string; nom?: string; message?: string }) => ({
    email: String(data?.email ?? "").trim().slice(0, 200),
    nom: String(data?.nom ?? "").trim().slice(0, 120),
    message: String(data?.message ?? "").trim().slice(0, 1000),
  }))
  .handler(async ({ data }) => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) {
      return { ok: false as const, message: "Adresse e-mail invalide." };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: utilisateurs } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
    const compte = utilisateurs?.users.find(
      (u) => (u.email ?? "").toLowerCase() === data.email.toLowerCase(),
    );
    const { error } = await supabaseAdmin.from("demandes_acces").insert({
      email: data.email,
      nom: data.nom,
      message: data.message,
      user_id: compte?.id ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const listerDemandesAcces = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<DemandeAcces[]> => {
    await garde(context as unknown as ContexteAuth);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("demandes_acces")
      .select("id, user_id, email, nom, message, statut, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as DemandeAcces[];
  });

/** Autorise ou refuse une demande d'accès. Autoriser donne le rôle admin au compte. */
export const deciderDemandeAcces = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { id: string; statut: "acceptee" | "refusee" }) => data)
  .handler(async ({ data, context }) => {
    await garde(context as unknown as ContexteAuth);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: demande, error: err1 } = await supabaseAdmin
      .from("demandes_acces")
      .select("id, email, user_id")
      .eq("id", data.id)
      .maybeSingle();
    if (err1) throw new Error(err1.message);
    if (!demande) return { ok: false as const, message: "Demande introuvable." };

    if (data.statut === "acceptee") {
      let userId = demande.user_id;
      if (!userId) {
        const { data: utilisateurs } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
        userId =
          utilisateurs?.users.find(
            (u) => (u.email ?? "").toLowerCase() === demande.email.toLowerCase(),
          )?.id ?? null;
      }
      if (!userId) {
        return {
          ok: false as const,
          message: "Aucun compte avec cet e-mail : demande-lui de créer son compte d'abord.",
        };
      }
      const { error } = await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });
      if (error) throw new Error(error.message);
      await supabaseAdmin
        .from("demandes_acces")
        .update({ statut: "acceptee", user_id: userId })
        .eq("id", data.id);
      return { ok: true as const };
    }

    const { error } = await supabaseAdmin
      .from("demandes_acces")
      .update({ statut: "refusee" })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const fichesRedaction = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
  await garde(context as unknown as ContexteAuth);
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("prestataires")
    .select(
      "id, nom, prenom, activite, type_offre, categorie_slug, sous_categorie, description, ville, quartier, deplacement, zone_deplacement, telephone, instagram, site_web, lien_reservation, statut, created_at",
    )
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as FicheRedaction[];
});

export const majStatutFiche = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { id: string; statut: StatutFiche }) => data)
  .handler(async ({ data, context }) => {
    await garde(context as unknown as ContexteAuth);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("prestataires")
      .update({ statut: data.statut })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const supprimerFiche = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    await garde(context as unknown as ContexteAuth);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("prestataires").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const statistiquesSite = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(
  async ({ context }): Promise<Statistiques> => {
    await garde(context as unknown as ContexteAuth);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const depuis = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();

    const [{ data: evts, error }, { data: fiches }] = await Promise.all([
      supabaseAdmin
        .from("evenements")
        .select("type, chemin, cible, prestataire_id, created_at")
        .gte("created_at", depuis)
        .order("created_at", { ascending: false })
        .limit(20000),
      supabaseAdmin.from("prestataires").select("id, nom"),
    ]);
    if (error) throw new Error(error.message);

    const nomParId = new Map((fiches ?? []).map((f) => [f.id, f.nom]));
    const jours = new Map<string, { visites: number; vues: number; clics: number }>();
    for (let i = 13; i >= 0; i--) {
      const j = new Date(Date.now() - i * 24 * 3600 * 1000).toISOString().slice(0, 10);
      jours.set(j, { visites: 0, vues: 0, clics: 0 });
    }

    const compteurs = { visites: 0, vuesFiches: 0, clicsLiens: 0, recherches: 0, visites7j: 0 };
    const pages = new Map<string, number>();
    const liens = new Map<string, number>();
    const parFiche = new Map<string, { vues: number; clics: number }>();
    const limite7j = Date.now() - 7 * 24 * 3600 * 1000;

    for (const e of evts ?? []) {
      const jour = String(e.created_at).slice(0, 10);
      const seau = jours.get(jour);
      if (e.type === "visite") {
        compteurs.visites++;
        if (new Date(e.created_at).getTime() >= limite7j) compteurs.visites7j++;
        pages.set(e.chemin, (pages.get(e.chemin) ?? 0) + 1);
        if (seau) seau.visites++;
      } else if (e.type === "vue_fiche") {
        compteurs.vuesFiches++;
        if (seau) seau.vues++;
      } else if (e.type === "clic_lien") {
        compteurs.clicsLiens++;
        if (e.cible) liens.set(e.cible, (liens.get(e.cible) ?? 0) + 1);
        if (seau) seau.clics++;
      } else if (e.type === "recherche") {
        compteurs.recherches++;
      }
      if (e.prestataire_id && (e.type === "vue_fiche" || e.type === "clic_lien")) {
        const courant = parFiche.get(e.prestataire_id) ?? { vues: 0, clics: 0 };
        if (e.type === "vue_fiche") courant.vues++;
        else courant.clics++;
        parFiche.set(e.prestataire_id, courant);
      }
    }

    return {
      ...compteurs,
      parJour: [...jours.entries()].map(([jour, v]) => ({ jour, ...v })),
      topFiches: [...parFiche.entries()]
        .map(([id, v]) => ({ id, nom: nomParId.get(id) ?? "Fiche supprimée", ...v }))
        .sort((a, b) => b.vues + b.clics - (a.vues + a.clics))
        .slice(0, 10),
      topPages: [...pages.entries()]
        .map(([chemin, visites]) => ({ chemin, visites }))
        .sort((a, b) => b.visites - a.visites)
        .slice(0, 10),
      topLiens: [...liens.entries()]
        .map(([cible, clics]) => ({ cible, clics }))
        .sort((a, b) => b.clics - a.clics)
        .slice(0, 10),
    };
  },
);

const COLONNES: { cle: keyof FicheRedaction; entete: string }[] = [
  { cle: "created_at", entete: "Date de la demande" },
  { cle: "nom", entete: "Nom de l'activité" },
  { cle: "prenom", entete: "Prénom" },
  { cle: "activite", entete: "Activité" },
  { cle: "type_offre", entete: "Type d'offre" },
  { cle: "categorie_slug", entete: "Rubrique" },
  { cle: "sous_categorie", entete: "Sous-catégorie" },
  { cle: "ville", entete: "Ville" },
  { cle: "quartier", entete: "Quartier" },
  { cle: "deplacement", entete: "Déplacement" },
  { cle: "zone_deplacement", entete: "Zone de déplacement" },
  { cle: "instagram", entete: "Instagram" },
  { cle: "site_web", entete: "Site web" },
  { cle: "lien_reservation", entete: "Lien de réservation" },
  { cle: "telephone", entete: "Téléphone" },
  { cle: "description", entete: "Description" },
  { cle: "statut", entete: "Statut" },
];

function cellule(valeur: unknown) {
  const texte = valeur == null ? "" : String(valeur).replace(/"/g, '""');
  return `"${texte}"`;
}

/** Renvoie un CSV (séparateur point-virgule, BOM UTF-8) directement ouvrable dans Excel. */
export const exporterDemandes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
  await garde(context as unknown as ContexteAuth);
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("prestataires")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);

  const lignes = [COLONNES.map((c) => cellule(c.entete)).join(";")];
  for (const ligne of (data ?? []) as unknown as FicheRedaction[]) {
    lignes.push(COLONNES.map((c) => cellule(ligne[c.cle])).join(";"));
  }
  return { csv: `\uFEFF${lignes.join("\r\n")}`, nombre: (data ?? []).length };
});
