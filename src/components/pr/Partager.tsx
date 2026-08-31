import { useState } from "react";

/** Bouton « Partager cette fiche » : partage natif si dispo, sinon copie du lien. */
export function Partager({
  titre,
  texte,
  className,
}: {
  titre: string;
  texte?: string;
  className?: string;
}) {
  const [etat, setEtat] = useState<"" | "copie">("");

  const partager = async () => {
    const url = typeof window === "undefined" ? "" : window.location.href;
    const data = { title: titre, text: texte ?? titre, url };
    try {
      if (typeof navigator !== "undefined" && "share" in navigator) {
        await (navigator as Navigator & { share: (d: ShareData) => Promise<void> }).share(data);
        return;
      }
    } catch {
      /* partage annulé : on retombe sur la copie */
    }
    try {
      await navigator.clipboard.writeText(url);
      setEtat("copie");
      setTimeout(() => setEtat(""), 2200);
    } catch {
      /* rien à faire */
    }
  };

  return (
    <button
      type="button"
      onClick={partager}
      className={`oeil inline-flex items-center gap-2 rounded-full border border-border bg-papier px-4 py-2.5 text-bordeaux transition-colors hover:bg-poudre ${className ?? ""}`}
    >
      <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 15V4m0 0L8.5 7.5M12 4l3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 13v5.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V13" strokeLinecap="round" />
      </svg>
      {etat === "copie" ? "Lien copié" : "Partager"}
    </button>
  );
}
