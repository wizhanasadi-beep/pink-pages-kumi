// Accès à l'espace rédaction par code numérique et session chiffrée.
import { createHash, timingSafeEqual } from "node:crypto";
import { useSession } from "@tanstack/react-start/server";

const DUREE_SECONDES = 60 * 60 * 12;
type SessionRedaction = { ouverte?: boolean };

function codeAttendu(): string {
  const code = process.env["REDACTION_ACCESS_CODE"];
  if (!code) throw new Error("Le code d'accès rédaction n'est pas configuré.");
  return code;
}

function configurationSession() {
  const password = process.env["REDACTION_SESSION_SECRET"];
  if (!password || password.length < 32) {
    throw new Error("Le secret de session rédaction n'est pas configuré.");
  }
  return {
    password,
    name: "pr-redaction",
    maxAge: DUREE_SECONDES,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

function empreinte(valeur: string) {
  return createHash("sha256").update(valeur).digest();
}

export function codeCorrect(saisie: string): boolean {
  const a = empreinte(saisie.trim());
  const b = empreinte(codeAttendu().trim());
  return timingSafeEqual(a, b);
}

export async function ouvrirSessionRedaction() {
  const session = await useSession<SessionRedaction>(configurationSession());
  await session.update({ ouverte: true });
}

export async function sessionRedactionOuverte(): Promise<boolean> {
  const session = await useSession<SessionRedaction>(configurationSession());
  return session.data.ouverte === true;
}

export async function fermerSessionRedaction() {
  const session = await useSession<SessionRedaction>(configurationSession());
  await session.clear();
}
