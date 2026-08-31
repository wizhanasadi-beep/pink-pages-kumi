# Mobile premium + logo « vrai annuaire »

## 1. Le logo : une vraie image d'annuaire rose

Abandon du dessin SVG plat au profit d'une **illustration réaliste et premium d'un annuaire rose** :

- Image générée (rendu produit 3D doux) : annuaire rose fermé, tranche de pages crème, spirales, combiné téléphonique posé dessus en relief, **ombre portée douce** sous le livre, fond transparent.
- Palette respectée : rose signature, crème, bordeaux profond.
- Sous l'illustration : **LES PAGES ROSES sur une seule ligne**, centré, lettrage resserré en typo titre.
- Ce couple image + wordmark devient le logo unique : couverture d'intro (grand format), navbar (image réduite + texte sur une ligne), footer.
- Favicon dérivé de la même image, recadrée carré sur le livre.


## 2. Couverture d'intro

Aujourd'hui : un grand vide rose, le logo perdu au milieu, l'écran fait deux fois la hauteur du téléphone.

- Hauteur bloquée à l'écran exact (100dvh), plus de scroll parasite.
- Composition recentrée et resserrée : édition n°01, lettrage, baseline, logo, bouton — le tout dans un bloc équilibré, sans trous.
- Logo plus grand et plus présent, ornements (fleur, étoile) repositionnés en bord de cadre plutôt qu'au hasard.
- Bouton d'ouverture pleine largeur avec marge confortable, et « Passer » discret mais atteignable au pouce.

## 3. Accueil mobile

- Titres géants recalibrés : plus de textes qui frôlent les bords, échelle de tailles dédiée au petit écran.
- Rythme des sections resserré (padding vertical réduit) pour que le scroll ne soit pas interminable.
- Pavés rubriques en grille 2 colonnes sur mobile plutôt qu'empilés à pleine hauteur.
- Recherche guidée : champs compacts, bouton pleine largeur, zone de tap ≥ 44 px.

## 4. Annuaire mobile

- Les trois filtres (rubrique, localisation, déplacement) passent dans un bloc repliable « Filtrer », fermé par défaut : on voit les résultats tout de suite.
- Champ de recherche à taille de texte normale (aujourd'hui il est géant et déborde).
- Cards allégées : visuel en format plus bas, actions sur une seule ligne (Consulter + Instagram + RDV), padding harmonisé.
- Compteur de résultats et tri sur une ligne discrète.

## 5. Finitions premium

- Barre de navigation basse : fond crème net, séparation fine, état actif visible, safe-area iPhone respectée.
- Bouton « Référencer » flottant repositionné pour ne plus chevaucher les cards.
- Harmonisation des rayons, ombres douces et espacements sur mobile.

## Détails techniques

- `src/components/pr/Logo.tsx` : nouveau `Combine` (path plein + fil spiralé) et `CarnetLogo` reconstruit ; `public/favicon.svg` mis à jour en cohérence.
- `src/styles.css` : échelle typographique responsive pour `titre-geant` / `mot-roses`, tokens d'espacement mobile, `env(safe-area-inset-bottom)` sur la nav basse.
- `src/components/pr/Couverture.tsx` : passage en `h-[100dvh]`, composition centrée.
- `src/routes/index.tsx`, `src/routes/annuaire.tsx`, `src/components/pr/FicheCard.tsx`, `layout.tsx` : ajustements responsive uniquement, aucune logique de données touchée.
- Vérification finale par captures en 390 px de large sur accueil, annuaire et fiche.
