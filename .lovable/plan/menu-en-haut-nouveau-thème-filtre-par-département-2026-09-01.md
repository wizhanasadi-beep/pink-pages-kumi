# Menu en haut, nouveau thème, filtre par département

## 1. Navigation en haut

- Suppression de la barre de navigation fixée en bas (mobile) et du bouton flottant « Référencer ».
- Sur mobile : menu bouton (☰) en haut à droite du bandeau, qui ouvre un panneau plein écran avec les liens + « Référencer ».
- Sur desktop : les liens restent alignés en haut à droite, inchangés.
- Le bandeau reste collant en haut sur toutes les pages.

## 2. Nouveau thème couleur

Application exacte de la palette envoyée :

| Rôle | Couleur |
| --- | --- |
| Rose poudré (principal, accents, vignettes) | `#D88C9A` |
| Bordeaux profond (boutons / CTA, texte sur fond rose) | `#5C2A3A` |
| Fond clair du site | `#FAF6F4` |
| Texte principal | `#2B2426` |

Les tokens `--background`, `--foreground`, `--rose`, `--bordeaux`, `--encre`, `--poudre`, `--papier`, bordures et `--muted-foreground` sont réécrits à partir de ces 4 valeurs (poudre = version claire du rose, papier = blanc). Aucun composant ne reçoit de couleur en dur : tout passe par les tokens, donc tout le site suit.

## 3. Retrait de la page Département

- Suppression des pages `/departements` et `/departements/{code}`.
- Retrait des liens correspondants dans le menu et le pied de page.
- La logique de rattachement ville → département est conservée, car elle sert au nouveau filtre.

## 4. Filtre par département (annuaire + carte)

Remplacement du filtre « Localisation / ville » par un filtre **Département** avec la liste fixe :

Partout · Paris (75) · Seine-et-Marne (77) · Yvelines (78) · Essonne (91) · Hauts-de-Seine (92) · Seine-Saint-Denis (93) · Val-de-Marne (94) · Val-d'Oise (95) · Toute l'Île-de-France · En ligne

- « Partout » = aucun filtre ; « En ligne » = prestataires à distance.
- Même filtre sur la carte, à la place du tri par ville.
- La barre de recherche de l'accueil passe elle aussi de « Où ? » (ville libre) à un choix de département, et transmet ce département à l'annuaire.

## Détails techniques

- `src/components/pr/layout.tsx` : `Masthead` avec état d'ouverture du menu mobile ; suppression de `BottomNav` et `FabReferencer` dans `PageMagazine` / `PageAplats`.
- `src/styles.css` : conversion des 4 hex en oklch dans `:root`.
- `rm src/routes/departements.index.tsx src/routes/departements.$code.tsx` (l'arbre de routes se régénère).
- `src/routes/annuaire.tsx` : paramètre de recherche `ville` remplacé par `dept`, filtrage via `departementDeFiche` de `src/lib/departements.ts` ; mêmes ajustements dans `src/routes/carte.tsx` et le formulaire de `src/routes/index.tsx`.
