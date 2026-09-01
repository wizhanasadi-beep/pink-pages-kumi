// Accès à l'espace rédaction par simple code secret (REDACTION_ACCESS_CODE).
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const COOKIE_REDACTION = "pr_redaction";
const DUREE_SECONDES = 60 * 60 * 12; // 12 h

function codeAttendu(): string {
  const code = process.env["REDACTION_ACCESS_CODE"];
  if (!code) throw new Error("Le code d'accès rédaction n'est pas configuré.");
  return code;
}

function normaliser(valeur: string) {
  return valeur.trim().toLowerCase();
}

function empreinte(valeur: string) {
  return createHash("sha256").update(valeur).digest();
}

export function codeCorrect(saisie: string): boolean {
  const a = empreinte(normaliser(saisie));
  const b = empreinte(normaliser(codeAttendu()));
  return timingSafeEqual(a, b);
}

function signer(expiration: number) {
  return createHmac("sha256", codeAttendu()).update(`redaction:${expiration}`).digest("hex");
}

export function creerJeton(): string {
  const expiration = Math.floor(Date.now() / 1000) + DUREE_SECONDES;
  return `${expiration}.${signer(expiration)}`;
}

export function jetonValide(jeton: string | null | undefined): boolean {
  if (!jeton) return false;
  const [brutExpiration, signature] = jeton.split(".");
  if (!brutExpiration || !signature) return false;
  const expiration = Number(brutExpiration);
  if (!Number.isFinite(expiration) || expiration < Math.floor(Date.now() / 1000)) return false;
  const attendue = signer(expiration);
  if (attendue.length !== signature.length) return false;
  return timingSafeEqual(Buffer.from(attendue), Buffer.from(signature));
}

export function lireCookieRedaction(entete: string | null | undefined): string | null {
  if (!entete) return null;
  for (const morceau of entete.split(";")) {
    const [nom, ...reste] = morceau.trim().split("=");
    if (nom === COOKIE_REDACTION) return decodeURIComponent(reste.join("="));
  }
  return null;
}

export function cookieOuvert(jeton: string) {
  return `${COOKIE_REDACTION}=${encodeURIComponent(jeton)}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=${DUREE_SECONDES}`;
}

export function cookieFerme() {
  return `${COOKIE_REDACTION}=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0`;
}
