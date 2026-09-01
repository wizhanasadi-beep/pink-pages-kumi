import { cn } from "@/lib/utils";
import { PictoRubrique } from "@/components/pr/ornements";
import beaute from "@/assets/rubrique-5951.json";
import autres from "@/assets/rubrique-5952.json";
import mode from "@/assets/rubrique-5953.json";
import creation from "@/assets/rubrique-5954.json";
import evenementiel from "@/assets/rubrique-5955.json";
import food from "@/assets/rubrique-5956.json";

const IMAGES: Record<string, { url: string; alt: string }> = {
  beaute: { url: beaute.url, alt: "Soins et cosmétiques posés sur un plateau" },
  mode: { url: mode.url, alt: "Portant de manteaux rose et bordeaux" },
  creation: { url: creation.url, alt: "Bureau de création de contenu rose" },
  evenementiel: { url: evenementiel.url, alt: "Téléphone rose et accessoires beauté" },
  food: { url: food.url, alt: "Layer cake à la fraise" },
  autres: { url: autres.url, alt: "Sérums lèvres rose pâle" },
};

/**
 * Vignette photo stylisée qui remplace le picto SVG d'une rubrique.
 * Même encombrement qu'un picto : un médaillon carré très arrondi.
 */
export function VignetteRubrique({
  slug,
  className,
}: {
  slug: string;
  className?: string | undefined;
}) {
  const image = IMAGES[slug];
  if (!image) return <PictoRubrique slug={slug} className={className} />;

  return (
    <span
      className={cn(
        "relative block aspect-square shrink-0 overflow-hidden rounded-[1.1rem] ring-1 ring-inset ring-rose/40 shadow-[0_10px_24px_-18px_oklch(0.672_0.166_10/60%)]",
        className,
      )}
    >
      <img
        src={image.url}
        alt={image.alt}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <span className="pointer-events-none absolute inset-0 bg-rose/15 mix-blend-multiply" />
    </span>
  );
}
