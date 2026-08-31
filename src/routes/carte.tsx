import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { lazy, useMemo, useState } from "react";
import { PageMagazine } from "@/components/pr/layout";
import { Etiquette, NumeroDePage, Rubrique } from "@/components/pr/bits";
import { FicheCard } from "@/components/pr/FicheCard";
import { categoriesQuery, distanceKm, prestatairesQuery } from "@/lib/pages-roses";

const CarteLeaflet = lazy(() => import("@/components/pr/CarteLeaflet"));

export const Route = createFileRoute("/carte")({
  head: () => ({
    meta: [
      { title: "Les prestataires autour de moi — Les Pages Roses" },
      {
        name: "description",
        content:
          "La carte des prestataires des Kumi : filtre par rubrique, distance et déplacement pour trouver la bonne adresse près de chez toi.",
      },
      { property: "og:title", content: "Les prestataires autour de moi — Les Pages Roses" },
      {
        property: "og:description",
        content: "Trouve une prestataire des Kumi près de chez toi. 📍",
      },
    ],
  }),
  component: Carte,
});

function Carte() {
  const { data: fiches = [] } = useQuery(prestatairesQuery);
  const { data: categories = [] } = useQuery(categoriesQuery);
  const [cat, setCat] = useState("");
  const [dep, setDep] = useState("");
  const [rayon, setRayon] = useState(50);
  const [position, setPosition] = useState<{ lat: number; lon: number } | null>(null);
  const [etatGeo, setEtatGeo] = useState<"idle" | "attente" | "refus">("idle");

  const resultats = useMemo(() => {
    return fiches
      .filter((f) => (cat ? f.categorie_slug === cat : true))
      .filter((f) => (dep ? f.deplacement === dep : true))
      .filter((f) => {
        if (!position || f.latitude == null || f.longitude == null) return true;
        return distanceKm(position, { lat: f.latitude, lon: f.longitude }) <= rayon;
      });
  }, [fiches, cat, dep, position, rayon]);

  const autourDeMoi = () => {
    if (!navigator.geolocation) return setEtatGeo("refus");
    setEtatGeo("attente");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setPosition({ lat: p.coords.latitude, lon: p.coords.longitude });
        setEtatGeo("idle");
      },
      () => setEtatGeo("refus"),
    );
  };

  return (
    <PageMagazine>
      <Rubrique
        sur="Pages 50 à 56"
        titre="📍 Les prestataires autour de moi"
        sous="Villes, quartiers et zones de déplacement — jamais d'adresse personnelle."
      />

      <section className="encart-jaune p-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="label-annonce mb-1 block">Rubrique</label>
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="w-full border border-border bg-papier px-2 py-2 text-sm"
            >
              <option value="">Toutes</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.icone} {c.nom}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-annonce mb-1 block">Déplacement</label>
            <select
              value={dep}
              onChange={(e) => setDep(e.target.value)}
              className="w-full border border-border bg-papier px-2 py-2 text-sm"
            >
              <option value="">Peu importe</option>
              <option value="se_deplace">🩷 Se déplace</option>
              <option value="sur_place">🏠 Ne se déplace pas</option>
              <option value="sur_demande">🟡 Sur demande</option>
            </select>
          </div>
          <div>
            <label className="label-annonce mb-1 block">Distance : {rayon} km</label>
            <input
              type="range"
              min={5}
              max={300}
              step={5}
              value={rayon}
              onChange={(e) => setRayon(Number(e.target.value))}
              className="w-full accent-[var(--rose)]"
              disabled={!position}
            />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            onClick={autourDeMoi}
            className="rubrique border border-border bg-rose px-3 py-2 text-rose-foreground shadow-sm"
          >
            📍 Autour de moi
          </button>
          {position ? (
            <button
              onClick={() => setPosition(null)}
              className="label-annonce border border-border bg-papier px-3 py-2"
            >
              ✕ Toute la France
            </button>
          ) : null}
          {etatGeo === "attente" ? <span className="label-annonce">Localisation…</span> : null}
          {etatGeo === "refus" ? (
            <span className="label-annonce text-bordeaux">
              Localisation indisponible — utilise les filtres 💗
            </span>
          ) : null}
        </div>
      </section>

      <div className="mt-5">
        <ClientOnly
          fallback={<div className="h-[60vh] min-h-80 w-full border border-border bg-poudre" />}
        >
          <CarteLeaflet fiches={resultats} centre={position} />
        </ClientOnly>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Etiquette ton="encre">
          {resultats.length} prestataire{resultats.length > 1 ? "s" : ""} sur la carte
        </Etiquette>
        <p className="label-annonce text-muted-foreground">Marqueurs roses</p>
      </div>

      <div className="mt-5 grid gap-6">
        {resultats.slice(0, 8).map((f, i) => (
          <FicheCard
            key={f.id}
            fiche={f}
            numero={i + 1}
            categorie={categories.find((c) => c.slug === f.categorie_slug)}
          />
        ))}
      </div>

      <NumeroDePage n={50} mention="La carte" />
    </PageMagazine>
  );
}
