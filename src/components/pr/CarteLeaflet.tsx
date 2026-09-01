import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { Prestataire } from "@/lib/pages-roses";
import { DEPLACEMENT_LABEL, TYPE_OFFRE_LABEL } from "@/lib/pages-roses";

const marqueurRose = (initiales: string) =>
  L.divIcon({
    className: "",
    html: `<span style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;border:2px solid #241a16;border-radius:999px;background:#F0468C;color:#fffdf5;font:600 11px/1 'Work Sans',sans-serif;box-shadow:3px 3px 0 0 #241a16">${initiales}</span>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

export default function CarteLeaflet({
  fiches,
  centre,
}: {
  fiches: Prestataire[];
  centre?: { lat: number; lon: number } | null;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const carte = useRef<L.Map | null>(null);
  const couche = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!ref.current || carte.current) return;
    carte.current = L.map(ref.current, { scrollWheelZoom: false }).setView([46.7, 2.4], 5);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
      maxZoom: 19,
    }).addTo(carte.current);
    couche.current = L.layerGroup().addTo(carte.current);
    return () => {
      carte.current?.remove();
      carte.current = null;
    };
  }, []);

  useEffect(() => {
    const map = carte.current;
    const group = couche.current;
    if (!map || !group) return;
    group.clearLayers();

    const points: [number, number][] = [];
    for (const f of fiches) {
      if (f.latitude == null || f.longitude == null) continue;
      points.push([f.latitude, f.longitude]);
      const init = f.nom
        .split(/[\s.]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((m) => m[0]?.toUpperCase())
        .join("");
      L.marker([f.latitude, f.longitude], { icon: marqueurRose(init) })
        .bindPopup(
          `<strong>${f.nom}</strong>${f.prenom ? `<br/>par ${f.prenom}` : ""}<br/>${f.activite}<br/>${
            TYPE_OFFRE_LABEL[f.type_offre]
          } · ${f.ville}${f.quartier ? ` · ${f.quartier}` : ""}<br/>${
            DEPLACEMENT_LABEL[f.deplacement].texte
          }<br/><a href="/prestataire/${f.id}">Voir la fiche →</a>`,
        )
        .addTo(group);
    }

    if (centre) {
      L.circleMarker([centre.lat, centre.lon], {
        radius: 8,
        color: "#241a16",
        weight: 2,
        fillColor: "#FFD84F",
        fillOpacity: 1,
      })
        .bindPopup("Tu es ici")
        .addTo(group);
      map.setView([centre.lat, centre.lon], 11);
    } else if (points.length > 0) {
      map.fitBounds(L.latLngBounds(points).pad(0.2));
    }
  }, [fiches, centre]);

  return <div ref={ref} className="h-[60vh] min-h-80 w-full border border-border" />;
}
