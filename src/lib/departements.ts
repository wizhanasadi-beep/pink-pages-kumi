import { normalise, type Prestataire } from "@/lib/pages-roses";

export type Departement = { code: string; nom: string };

/** Communes connues → département. */
const COMMUNES: Record<string, string> = {
  paris: "75",
  malakoff: "92",
  "noisy-le-grand": "93",
  "epinay-sur-seine": "93",
  "saint-denis": "93",
  aubervilliers: "93",
  montreuil: "93",
  "bonneuil-sur-marne": "94",
  "champigny-sur-marne": "94",
  creteil: "94",
  vitry: "94",
  "corbeil-essonnes": "91",
  "ris-orangis": "91",
  "evry": "91",
  sartrouville: "78",
  versailles: "78",
  meaux: "77",
  lieusaint: "77",
  melun: "77",
  cergy: "95",
  argenteuil: "95",
};

/** Départements (et zones) utilisés par l'annuaire. */
export const DEPARTEMENTS: Record<string, string> = {
  "75": "Paris",
  "77": "Seine-et-Marne",
  "78": "Yvelines",
  "91": "Essonne",
  "92": "Hauts-de-Seine",
  "93": "Seine-Saint-Denis",
  "94": "Val-de-Marne",
  "95": "Val-d'Oise",
  idf: "Toute l'Île-de-France",
  "en-ligne": "En ligne",
  ailleurs: "Ailleurs en France",
};

/** Déduit le département (code) d'une fiche à partir de sa ville. */
export function departementDeFiche(fiche: Pick<Prestataire, "ville">): string {
  const v = normalise(fiche.ville ?? "").trim();
  if (!v) return "ailleurs";
  if (v.includes("en ligne") || v.includes("distance") || v.includes("visio")) return "en-ligne";
  if (v.includes("ile-de-france") || v.includes("idf")) return "idf";
  if (v.includes("seine-saint-denis")) return "93";
  if (v.includes("val-de-marne")) return "94";
  if (v.includes("hauts-de-seine")) return "92";
  if (v.includes("val-d'oise") || v.includes("val-doise")) return "95";
  if (v.includes("seine-et-marne")) return "77";
  if (v.includes("yvelines")) return "78";
  if (v.includes("essonne")) return "91";
  const commune = COMMUNES[v.replace(/\s+/g, "-")];
  if (commune) return commune;
  return "ailleurs";
}

export function nomDepartement(code: string) {
  return DEPARTEMENTS[code] ?? "Ailleurs en France";
}

/** Regroupe les fiches par département, trié par nombre décroissant. */
export function grouperParDepartement<T extends Pick<Prestataire, "ville">>(fiches: T[]) {
  const map = new Map<string, T[]>();
  for (const f of fiches) {
    const code = departementDeFiche(f);
    map.set(code, [...(map.get(code) ?? []), f]);
  }
  return Array.from(map.entries())
    .map(([code, items]) => ({ code, nom: nomDepartement(code), fiches: items }))
    .sort((a, b) => b.fiches.length - a.fiches.length || a.nom.localeCompare(b.nom));
}

/** Options du filtre « Département » (Île-de-France + en ligne). */
export const OPTIONS_DEPARTEMENT: Departement[] = [
  { code: "75", nom: "Paris (75)" },
  { code: "77", nom: "Seine-et-Marne (77)" },
  { code: "78", nom: "Yvelines (78)" },
  { code: "91", nom: "Essonne (91)" },
  { code: "92", nom: "Hauts-de-Seine (92)" },
  { code: "93", nom: "Seine-Saint-Denis (93)" },
  { code: "94", nom: "Val-de-Marne (94)" },
  { code: "95", nom: "Val-d'Oise (95)" },
  { code: "idf", nom: "Toute l'Île-de-France" },
  { code: "en-ligne", nom: "En ligne" },
  { code: "ailleurs", nom: "Ailleurs en France" },
];

/** Une fiche correspond-elle au département choisi ? */
export function ficheDansDepartement(
  fiche: Pick<Prestataire, "ville">,
  code: string,
): boolean {
  if (!code) return true;
  const dep = departementDeFiche(fiche);
  if (code === "en-ligne") return dep === "en-ligne";
  if (code === "idf") return dep === "idf" || /^(75|77|78|91|92|93|94|95)$/.test(dep);
  // Les fiches « toute l'Île-de-France » ou « en ligne » restent visibles partout en IDF.
  return dep === code || dep === "idf";
}
