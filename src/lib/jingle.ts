/**
 * Petit jingle de marque joué à l'ouverture des Pages Roses.
 * Généré à la volée avec la Web Audio API (aucun fichier audio à charger).
 */

const MELODIE = [
  { note: 880.0, debut: 0, duree: 0.22 }, // La5
  { note: 1108.73, debut: 0.16, duree: 0.22 }, // Do#6
  { note: 1318.51, debut: 0.32, duree: 0.24 }, // Mi6
  { note: 1760.0, debut: 0.5, duree: 0.7 }, // La6
];

export function jouerJingle() {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return;

  let ctx: AudioContext;
  try {
    ctx = new Ctx();
  } catch {
    return;
  }
  void ctx.resume();

  const master = ctx.createGain();
  master.gain.value = 0.22;
  master.connect(ctx.destination);

  const t0 = ctx.currentTime + 0.03;

  for (const { note, debut, duree } of MELODIE) {
    for (const [type, ratio, vol] of [
      ["sine", 1, 1],
      ["triangle", 2, 0.28],
    ] as const) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = note * ratio;

      const debutNote = t0 + debut;
      gain.gain.setValueAtTime(0, debutNote);
      gain.gain.linearRampToValueAtTime(vol, debutNote + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, debutNote + duree);

      osc.connect(gain);
      gain.connect(master);
      osc.start(debutNote);
      osc.stop(debutNote + duree + 0.05);
    }
  }

  window.setTimeout(() => void ctx.close(), 2000);
}
