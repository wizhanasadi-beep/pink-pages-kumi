import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { PageMagazine } from "@/components/pr/layout";
import { Etiquette, Filet, NumeroDePage, Rubrique } from "@/components/pr/bits";
import {
  deciderDemandeAcces,
  demanderAcces,
  etatAcces,
  exporterDemandes,
  fichesRedaction,
  listerDemandesAcces,
  majStatutFiche,
  statistiquesSite,
  supprimerFiche,
  type StatutFiche,
} from "@/lib/redaction.functions";


export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Espace rédaction — Les Pages Roses" },
      {
        name: "description",
        content: "Tableau de bord, demandes de référencement et export des Pages Roses.",
      },
      { property: "og:title", content: "Espace rédaction — Les Pages Roses" },
      { property: "og:description", content: "Accès réservé à la rédaction des Pages Roses." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Redaction,
});

function Redaction() {
  const qc = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [pretSession, setPretSession] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setPretSession(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      qc.invalidateQueries({ queryKey: ["redaction"] });
    });
    return () => sub.subscription.unsubscribe();
  }, [qc]);

  const { data: acces, isLoading } = useQuery({
    queryKey: ["redaction", "acces", session?.user.id ?? null],
    queryFn: () => etatAcces(),
    enabled: Boolean(session),
  });

  if (!pretSession || (session && isLoading)) {
    return (
      <PageMagazine>
        <p className="label-annonce">Chargement…</p>
      </PageMagazine>
    );
  }

  if (!session) return <PorteConnexion />;
  if (!acces?.admin) return <EnAttente email={acces?.email ?? session.user.email ?? ""} demande={acces?.demande ?? null} />;
  return <Tableau />;
}

async function deconnexion(qc: ReturnType<typeof useQueryClient>) {
  await qc.cancelQueries();
  qc.clear();
  await supabase.auth.signOut();
}

const champ =
  "w-full rounded-full border border-border bg-papier px-4 py-3 text-base";

function PorteConnexion() {
  const [mode, setMode] = useState<"connexion" | "inscription" | "demande">("connexion");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [nom, setNom] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [succes, setSucces] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  const envoyer = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSucces(null);
    setEnvoi(true);
    try {
      if (mode === "connexion") {
        const { error } = await supabase.auth.signInWithPassword({ email, password: motDePasse });
        if (error) setMessage("E-mail ou mot de passe incorrect.");
      } else if (mode === "inscription") {
        const { error } = await supabase.auth.signUp({
          email,
          password: motDePasse,
          options: { emailRedirectTo: window.location.origin + "/admin", data: { nom } },
        });
        if (error) setMessage(error.message);
        else setSucces("Compte créé. Tu peux te connecter.");
      } else {
        const res = await demanderAcces({ data: { email, nom, message: note } });
        if (res.ok) setSucces("Demande envoyée ! La rédaction te répondra bientôt.");
        else setMessage(res.message);
      }
    } catch {
      setMessage("Une erreur est survenue, réessaie.");
    } finally {
      setEnvoi(false);
    }
  };

  const titres = {
    connexion: { titre: "Connexion", sous: "Espace réservé à la rédaction." },
    inscription: { titre: "Créer un compte", sous: "Ton accès sera validé par la rédaction." },
    demande: { titre: "Demander l'accès", sous: "Dis-nous qui tu es." },
  }[mode];

  return (
    <PageMagazine>
      <Rubrique sur="Coulisses" titre={titres.titre} sous={titres.sous} />
      <form onSubmit={envoyer} className="encart mx-auto max-w-md space-y-4 p-5">
        {mode !== "connexion" ? (
          <div>
            <label className="label-annonce mb-1 block">
              {mode === "demande" ? "Ton nom" : "Prénom"}
            </label>
            <input
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required={mode === "demande"}
              className={champ}
            />
          </div>
        ) : null}

        <div>
          <label className="label-annonce mb-1 block">Adresse e-mail</label>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={champ}
          />
        </div>

        {mode !== "demande" ? (
          <div>
            <label className="label-annonce mb-1 block">Mot de passe</label>
            <input
              type="password"
              autoComplete={mode === "connexion" ? "current-password" : "new-password"}
              required
              minLength={8}
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              className={champ}
            />
          </div>
        ) : (
          <div>
            <label className="label-annonce mb-1 block">Message (optionnel)</label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-2xl border border-border bg-papier px-4 py-3 text-base"
            />
          </div>
        )}

        {message ? <p className="label-annonce text-bordeaux">{message}</p> : null}
        {succes ? <p className="label-annonce text-rose">{succes}</p> : null}

        <button
          type="submit"
          disabled={envoi}
          className="rubrique w-full rounded-full border border-border bg-rose px-4 py-3 text-lg text-rose-foreground shadow-sm disabled:opacity-60"
        >
          {envoi
            ? "Envoi…"
            : mode === "connexion"
              ? "Se connecter"
              : mode === "inscription"
                ? "Créer mon compte"
                : "Envoyer ma demande"}
        </button>

        <div className="flex flex-wrap justify-center gap-3 pt-1 text-sm">
          {mode !== "connexion" ? (
            <button type="button" onClick={() => setMode("connexion")} className="underline">
              J'ai déjà un compte
            </button>
          ) : null}
          {mode !== "inscription" ? (
            <button type="button" onClick={() => setMode("inscription")} className="underline">
              Créer un compte
            </button>
          ) : null}
          {mode !== "demande" ? (
            <button type="button" onClick={() => setMode("demande")} className="underline">
              Demander l'accès à la rédaction
            </button>
          ) : null}
        </div>
      </form>
      <NumeroDePage n={99} mention="Rédaction" />
    </PageMagazine>
  );
}

function EnAttente({ email, demande }: { email: string; demande: string | null }) {
  const qc = useQueryClient();
  const [note, setNote] = useState("");
  const [etat, setEtat] = useState<string | null>(
    demande === "en_attente" ? "Ta demande est en cours d'examen." : null,
  );
  const envoyer = useMutation({
    mutationFn: () => demanderAcces({ data: { email, nom: "", message: note } }),
    onSuccess: () => setEtat("Demande envoyée ! La rédaction te répondra bientôt."),
  });

  return (
    <PageMagazine>
      <Rubrique
        sur="Coulisses"
        titre="Accès en attente"
        sous="Ton compte existe, il doit encore être autorisé."
      />
      <div className="encart mx-auto max-w-md space-y-4 p-5">
        <p className="text-sm">
          Connectée avec <strong>{email}</strong>.
          {demande === "refusee" ? " Ta précédente demande a été refusée." : ""}
        </p>
        {etat ? <p className="label-annonce text-rose">{etat}</p> : null}
        {demande !== "en_attente" ? (
          <>
            <textarea
              rows={3}
              placeholder="Quelques mots sur toi (optionnel)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-2xl border border-border bg-papier px-4 py-3 text-base"
            />
            <button
              onClick={() => envoyer.mutate()}
              disabled={envoyer.isPending}
              className="rubrique w-full rounded-full border border-border bg-rose px-4 py-3 text-rose-foreground disabled:opacity-60"
            >
              {envoyer.isPending ? "Envoi…" : "Demander l'accès"}
            </button>
          </>
        ) : null}
        <button
          onClick={() => deconnexion(qc)}
          className="label-annonce w-full rounded-full border border-border bg-papier px-4 py-3"
        >
          Se déconnecter
        </button>
      </div>
      <NumeroDePage n={99} mention="Rédaction" />
    </PageMagazine>
  );
}

const ONGLETS = [
  { cle: "dashboard", label: "Tableau de bord" },
  { cle: "demandes", label: "Demandes" },
  { cle: "acces", label: "Accès" },
] as const;


function Tableau() {
  const qc = useQueryClient();
  const [onglet, setOnglet] = useState<(typeof ONGLETS)[number]["cle"]>("dashboard");

  return (
    <PageMagazine>
      <div className="flex items-start justify-between gap-3">
        <Rubrique sur="Coulisses" titre="La rédaction" sous="Audience, demandes, export." />
        <button
          onClick={() => deconnexion(qc)}
          className="label-annonce shrink-0 border border-border bg-papier px-3 py-2 rounded-full"
        >
          Quitter
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {ONGLETS.map((o) => (
          <button
            key={o.cle}
            onClick={() => setOnglet(o.cle)}
            className={`rubrique border border-border px-3 py-2 rounded-full ${
              onglet === o.cle ? "bg-rose text-rose-foreground" : "bg-papier"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      {onglet === "dashboard" ? <Dashboard /> : onglet === "demandes" ? <Demandes /> : <Acces />}
      <NumeroDePage n={99} mention="Rédaction" />
    </PageMagazine>
  );
}

function Chiffre({ valeur, libelle }: { valeur: number; libelle: string }) {
  return (
    <div className="encart p-4">
      <p className="text-3xl font-bold leading-none">{valeur.toLocaleString("fr-FR")}</p>
      <p className="label-annonce mt-2 text-muted-foreground">{libelle}</p>
    </div>
  );
}

function Dashboard() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["redaction", "stats"],
    queryFn: () => statistiquesSite(),
  });

  if (isLoading) return <p className="label-annonce mt-5">Chargement des statistiques…</p>;
  if (error || !stats)
    return <p className="encart mt-5 p-4 text-sm">Statistiques indisponibles pour le moment.</p>;

  const maxi = Math.max(1, ...stats.parJour.map((j) => j.visites + j.vues + j.clics));

  return (
    <div className="mt-5 space-y-6">
      <p className="label-annonce text-muted-foreground">Sur les 30 derniers jours</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Chiffre valeur={stats.visites} libelle="Visites de pages" />
        <Chiffre valeur={stats.vuesFiches} libelle="Fiches consultées" />
        <Chiffre valeur={stats.clicsLiens} libelle="Clics de contact" />
        <Chiffre valeur={stats.visites7j} libelle="Visites (7 derniers jours)" />
      </div>

      <div className="encart p-4">
        <h3 className="rubrique">Activité des 14 derniers jours</h3>
        <div className="mt-4 flex h-40 items-end gap-1">
          {stats.parJour.map((j) => {
            const total = j.visites + j.vues + j.clics;
            return (
              <div key={j.jour} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-rose"
                  style={{ height: `${(total / maxi) * 100}%`, minHeight: total ? 4 : 1 }}
                  title={`${j.jour} · ${total} événements`}
                />
                <span className="text-[0.55rem] text-muted-foreground">{j.jour.slice(8)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="encart p-4">
          <h3 className="rubrique">Fiches les plus vues</h3>
          <Filet />
          <ul className="space-y-2 text-sm">
            {stats.topFiches.length === 0 ? (
              <li className="text-muted-foreground">Aucune donnée encore.</li>
            ) : null}
            {stats.topFiches.map((f) => (
              <li key={f.id} className="flex justify-between gap-3">
                <span className="truncate">{f.nom}</span>
                <span className="label-annonce shrink-0 text-muted-foreground">
                  {f.vues} vues · {f.clics} clics
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="encart p-4">
          <h3 className="rubrique">Pages les plus visitées</h3>
          <Filet />
          <ul className="space-y-2 text-sm">
            {stats.topPages.length === 0 ? (
              <li className="text-muted-foreground">Aucune donnée encore.</li>
            ) : null}
            {stats.topPages.map((p) => (
              <li key={p.chemin} className="flex justify-between gap-3">
                <span className="truncate">{p.chemin}</span>
                <span className="label-annonce shrink-0 text-muted-foreground">{p.visites}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="encart p-4 sm:col-span-2">
          <h3 className="rubrique">Liens de contact les plus cliqués</h3>
          <Filet />
          <ul className="space-y-2 text-sm">
            {stats.topLiens.length === 0 ? (
              <li className="text-muted-foreground">Aucune donnée encore.</li>
            ) : null}
            {stats.topLiens.map((l) => (
              <li key={l.cible} className="flex justify-between gap-3">
                <span className="truncate">{l.cible}</span>
                <span className="label-annonce shrink-0 text-muted-foreground">{l.clics}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const STATUTS: { valeur: StatutFiche; label: string }[] = [
  { valeur: "en_attente", label: "En attente" },
  { valeur: "publiee", label: "Publiées" },
  { valeur: "refusee", label: "Refusées" },
];

function Demandes() {
  const qc = useQueryClient();
  const [filtre, setFiltre] = useState<StatutFiche | "toutes">("en_attente");
  const { data: fiches = [], isLoading } = useQuery({
    queryKey: ["redaction", "fiches"],
    queryFn: () => fichesRedaction(),
  });

  const rafraichir = () => qc.invalidateQueries({ queryKey: ["redaction"] });
  const statut = useMutation({
    mutationFn: (v: { id: string; statut: StatutFiche }) => majStatutFiche({ data: v }),
    onSuccess: rafraichir,
  });
  const suppression = useMutation({
    mutationFn: (id: string) => supprimerFiche({ data: { id } }),
    onSuccess: rafraichir,
  });

  const telecharger = useMutation({
    mutationFn: () => exporterDemandes(),
    onSuccess: (res) => {
      const url = URL.createObjectURL(
        new Blob([res.csv], { type: "text/csv;charset=utf-8;" }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = `pages-roses-referencements-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    },
  });

  const liste = filtre === "toutes" ? fiches : fiches.filter((f) => f.statut === filtre);

  return (
    <div className="mt-5 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {[...STATUTS, { valeur: "toutes" as const, label: "Toutes" }].map((s) => (
          <button
            key={s.valeur}
            onClick={() => setFiltre(s.valeur)}
            className={`label-annonce border border-border px-3 py-1.5 rounded-full ${
              filtre === s.valeur ? "bg-poudre" : "bg-papier"
            }`}
          >
            {s.label} (
            {s.valeur === "toutes"
              ? fiches.length
              : fiches.filter((f) => f.statut === s.valeur).length}
            )
          </button>
        ))}
        <button
          onClick={() => telecharger.mutate()}
          disabled={telecharger.isPending}
          className="label-annonce ml-auto border border-border bg-jaune px-3 py-1.5 rounded-full disabled:opacity-60"
        >
          {telecharger.isPending ? "Export…" : "⤓ Exporter pour Excel"}
        </button>
      </div>

      {isLoading ? <p className="label-annonce">Chargement…</p> : null}

      <div className="grid gap-4">
        {liste.map((f) => (
          <article key={f.id} className="encart p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold">{f.nom}</h3>
                <p className="rubrique text-rose">
                  {f.activite}
                  {f.prenom ? ` — par ${f.prenom}` : ""}
                </p>
                <p className="label-annonce mt-1 text-muted-foreground">
                  {f.ville}
                  {f.quartier ? ` · ${f.quartier}` : ""} · {f.categorie_slug} · {f.type_offre}
                </p>
                <p className="label-annonce mt-1 text-muted-foreground">
                  Reçue le {new Date(f.created_at).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <Etiquette
                ton={f.statut === "publiee" ? "rose" : f.statut === "refusee" ? "encre" : "jaune"}
              >
                {f.statut.replace("_", " ")}
              </Etiquette>
            </div>

            {f.description ? (
              <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
            ) : null}

            <ul className="mt-2 space-y-1 text-sm">
              {f.instagram ? <li>Instagram : {f.instagram}</li> : null}
              {f.site_web ? <li>Site : {f.site_web}</li> : null}
              {f.lien_reservation ? <li>Réservation : {f.lien_reservation}</li> : null}
              {f.telephone ? <li>Téléphone : {f.telephone}</li> : null}
            </ul>

            <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
              {f.statut !== "publiee" ? (
                <button
                  onClick={() => statut.mutate({ id: f.id, statut: "publiee" })}
                  className="label-annonce border border-border bg-rose px-3 py-1.5 text-rose-foreground rounded-full"
                >
                  ✓ Publier
                </button>
              ) : (
                <button
                  onClick={() => statut.mutate({ id: f.id, statut: "en_attente" })}
                  className="label-annonce border border-border bg-jaune px-3 py-1.5 rounded-full"
                >
                  ⏸ Dépublier
                </button>
              )}
              {f.statut !== "refusee" ? (
                <button
                  onClick={() => statut.mutate({ id: f.id, statut: "refusee" })}
                  className="label-annonce border border-border bg-papier px-3 py-1.5 rounded-full"
                >
                  ✕ Refuser
                </button>
              ) : null}
              <button
                onClick={() => {
                  if (confirm(`Supprimer définitivement la fiche de ${f.nom} ?`))
                    suppression.mutate(f.id);
                }}
                className="label-annonce border border-border bg-destructive px-3 py-1.5 text-destructive-foreground rounded-full"
              >
                Supprimer
              </button>
            </div>
          </article>
        ))}
        {!isLoading && liste.length === 0 ? (
          <p className="encart p-4 text-sm text-muted-foreground">Aucune fiche ici.</p>
        ) : null}
      </div>
    </div>
  );
}
