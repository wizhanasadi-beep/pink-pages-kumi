import { supabase } from "@/integrations/supabase/client";

export type Deplacement = "se_deplace" | "sur_place" | "sur_demande";
export type Statut = "en_attente" | "publiee" | "refusee";

export type Prestataire = {
  id: string;
  nom: string;
  activite: string;
  categorie_slug: string;
  sous_categorie: string | null;
  description: string;
  photo_url: string | null;
  ville: string;
  quartier: string | null;
  telephone: string | null;
  instagram: string | null;
  site_web: string | null;
  lien_reservation: string | null;
  latitude: number | null;
  longitude: number | null;
  deplacement: Deplacement;
  zone_deplacement: string | null;
  statut: Statut;
  created_at: string;
};

export type Categorie = {
  id: string;
  nom: string;
  slug: string;
  icone: string;
  description: string | null;
  ordre: number;
};

/** Sous-rubriques affichées dans les pages "Catégories" (façon sommaire de magazine). */
export const SOUS_RUBRIQUES: Record<string, string[]> = {
  beaute: ["MUA", "Coiffure", "Lash Tech", "Nails", "Esthétique"],
  mode: ["Personal Shopper", "Couture", "Retouches", "Stylisme"],
  evenementiel: ["Wedding Planner", "Coordination événementielle", "Décoration", "Location"],
  creation: ["Photographie", "Vidéo", "Graphisme", "Création de contenu"],
  food: ["Pâtisserie", "Cake Design", "Traiteur"],
  autres: ["Home organising", "Coaching", "Et bien d'autres"],
};

export const DEPLACEMENT_LABEL: Record<Deplacement, { emoji: string; texte: string }> = {
  se_deplace: { emoji: "🩷", texte: "Se déplace" },
  sur_place: { emoji: "🏠", texte: "Sur place uniquement" },
  sur_demande: { emoji: "🟡", texte: "Sur demande" },
};

export const categoriesQuery = {
  queryKey: ["categories"],
  queryFn: async (): Promise<Categorie[]> => {
    const { data, error } = await supabase
      .from("categories")
      .select("id, nom, slug, icone, description, ordre")
      .order("ordre");
    if (error) throw error;
    return data as Categorie[];
  },
};

export const prestatairesQuery = {
  queryKey: ["prestataires", "publiee"],
  queryFn: async (): Promise<Prestataire[]> => {
    const { data, error } = await supabase
      .from("prestataires")
      .select("*")
      .eq("statut", "publiee")
      .order("nom");
    if (error) throw error;
    return data as Prestataire[];
  },
};

export const prestataireQuery = (id: string) => ({
  queryKey: ["prestataire", id],
  queryFn: async (): Promise<Prestataire | null> => {
    const { data, error } = await supabase.from("prestataires").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return (data as Prestataire) ?? null;
  },
});

export const toutesFichesQuery = {
  queryKey: ["prestataires", "admin"],
  queryFn: async (): Promise<Prestataire[]> => {
    const { data, error } = await supabase
      .from("prestataires")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as Prestataire[];
  },
};

export function initiales(nom: string) {
  return nom
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((m) => m[0]?.toUpperCase())
    .join("");
}

export function distanceKm(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number },
) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function normalise(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
