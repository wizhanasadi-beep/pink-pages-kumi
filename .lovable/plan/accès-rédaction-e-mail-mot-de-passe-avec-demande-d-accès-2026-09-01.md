# Accès rédaction : e-mail + mot de passe, avec demande d'accès

Retour à une connexion classique pour `/admin`, plus la possibilité pour quelqu'un de demander l'accès.

## Ce que ça donne

**Page `/admin` — non connectée**
- Formulaire « Connexion » : e-mail + mot de passe.
- Lien « Créer un compte » (e-mail, mot de passe, prénom).
- Lien « Demander l'accès à la rédaction » : petit formulaire (nom, e-mail, message) envoyé à l'équipe.

**Connectée mais pas encore autorisée**
- Écran « Ton accès est en attente de validation », avec bouton pour envoyer/relancer sa demande et bouton de déconnexion.

**Connectée et autorisée (rôle admin)**
- Le tableau de bord actuel, inchangé : statistiques 14 jours, top fiches/pages/liens, demandes de référencement, export Excel.
- Nouvel onglet « Accès » : liste des demandes d'accès (en attente / acceptées / refusées) avec boutons « Autoriser » et « Refuser ». Autoriser donne le rôle admin au compte correspondant.

**Premier compte**
Le tout premier compte créé devient automatiquement administrateur (c'est le tien). Tous les suivants passent par la validation.

**Mot de passe oublié**
Non inclus pour l'instant (nécessite la configuration d'un domaine d'envoi d'e-mails) — à ajouter si tu le souhaites ensuite.

## Détails techniques

- Base : nouvelle table `demandes_acces` (email, nom, message, statut, user_id, created_at) avec RLS + GRANT : insertion possible par tout visiteur, lecture/mise à jour réservées à `has_role(auth.uid(),'admin')`. Réutilisation de la table `user_roles` et de la fonction `has_role` déjà en place.
- Premier admin : fonction trigger sur `auth.users` (ou vérification serveur au premier login) qui insère le rôle `admin` si `user_roles` est vide.
- `src/lib/redaction.functions.ts` : la garde par code est remplacée par `.middleware([requireSupabaseAuth])` + vérification `has_role` via `context.supabase` sur toutes les fonctions (fiches, statuts, statistiques, export). Ajout de `demanderAcces`, `listerDemandesAcces`, `deciderDemandeAcces`.
- Suppression de `src/lib/redaction.server.ts` (session maison) et des secrets `REDACTION_ACCESS_CODE` / `REDACTION_SESSION_SECRET`.
- `src/routes/admin.tsx` : `ssr: false`, connexion via `supabase.auth.signInWithPassword` / `signUp`, état d'autorisation lu par une fonction serveur ; déconnexion propre (annulation des requêtes, vidage du cache).
- Auth e-mail/mot de passe activée avec auto-confirmation pour éviter le blocage sur l'e-mail de confirmation (aucun envoi d'e-mail configuré à ce stade).
- Design et textes gardent la DA actuelle (crème / rose fraise, DM Serif Display).
