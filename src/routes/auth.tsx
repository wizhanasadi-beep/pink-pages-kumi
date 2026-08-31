import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageMagazine } from "@/components/pr/layout";
import { Filet, Rubrique } from "@/components/pr/bits";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Espace rédaction — Les Pages Roses" },
      {
        name: "description",
        content: "Connexion à l'espace rédaction des Pages Roses pour gérer les fiches de l'annuaire.",
      },
      { property: "og:title", content: "Espace rédaction — Les Pages Roses" },
      { property: "og:description", content: "Connexion réservée à la rédaction des Pages Roses." },
    ],
  }),
  component: Auth,
});

function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"connexion" | "inscription">("connexion");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [charge, setCharge] = useState(false);

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    setCharge(true);
    setMessage(null);
    const action =
      mode === "connexion"
        ? supabase.auth.signInWithPassword({ email, password: motDePasse })
        : supabase.auth.signUp({
            email,
            password: motDePasse,
            options: { emailRedirectTo: `${window.location.origin}/admin` },
          });
    const { error } = await action;
    setCharge(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    if (mode === "inscription") {
      setMessage("Compte créé. Tu peux te connecter (une administratrice devra t'attribuer l'accès).");
      setMode("connexion");
      return;
    }
    navigate({ to: "/admin" });
  };

  return (
    <PageMagazine>
      <Rubrique sur="Réservé à la rédaction" titre="Espace rédaction" />
      <form onSubmit={soumettre} className="encart mx-auto max-w-md space-y-4 p-5">
        <div>
          <label className="label-annonce mb-1 block">E-mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-2 border-encre bg-papier px-3 py-2.5"
          />
        </div>
        <div>
          <label className="label-annonce mb-1 block">Mot de passe</label>
          <input
            type="password"
            required
            minLength={6}
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            className="w-full border-2 border-encre bg-papier px-3 py-2.5"
          />
        </div>
        {message ? <p className="label-annonce text-bordeaux">{message}</p> : null}
        <button
          type="submit"
          disabled={charge}
          className="rubrique w-full border-2 border-encre bg-rose px-4 py-3 text-lg text-rose-foreground shadow-[4px_4px_0_0_var(--encre)] disabled:opacity-60"
        >
          {mode === "connexion" ? "Se connecter" : "Créer mon compte"}
        </button>
        <Filet />
        <button
          type="button"
          onClick={() => setMode(mode === "connexion" ? "inscription" : "connexion")}
          className="label-annonce w-full text-center"
        >
          {mode === "connexion" ? "Créer un compte rédaction" : "J'ai déjà un compte"}
        </button>
      </form>
    </PageMagazine>
  );
}
