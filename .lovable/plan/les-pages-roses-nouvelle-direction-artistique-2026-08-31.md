# Les Pages Roses — Nouvelle direction artistique

Refonte du branding et de la homepage : identité éditoriale contemporaine, rose comme couleur de marque, le combiné téléphonique comme symbole graphique. L'annuaire reste fonctionnel et devient plus aéré.

## Identité

- Palette « rose poudré premium » : blanc cassé `#fffaf8`, rose pâle `#f6d7d9`, rose signature `#e0899b`, bordeaux profond `#4a1524`.
- Typo : Cormorant Garamond pour le logo et les grands titres, Karla pour toute l'interface. Le mot « ROSES » reçoit un traitement propre (italique + lettrage large) pour devenir reconnaissable.
- Logo : lettrage « LES PAGES ROSES » sur trois lignes, avec un combiné stylisé (SVG dessiné à la main, traits fins, sans skeuomorphisme) intégré comme signe. Trois usages : grand format hero, version horizontale navbar, glyphe seul pour favicon et cartes prestataires.
- Le combiné revient comme motif discret : puce de rubrique, séparateur de section, filigrane d'aplat.

## Homepage

Rythme de couleur alterné : BLANC → ROSE PLEIN → BLANC → ROSE PÂLE → BLANC.

1. **Hero** — fond blanc cassé, typo géante `LES / PAGES / ROSES`, le combiné SVG traverse le mot ROSES (il remplace visuellement une partie du lettrage). Sous-titre « L'annuaire des Kumi ». Champ de recherche intégré à la composition (ligne fine soulignée, pas de card) + bouton « Trouver une Kumi ».
2. **Rubriques** — aplat rose pleine largeur, grille de rubriques en typo large, sans icônes emoji ni décor.
3. **À la une** — fond blanc, 3 grandes fiches en largeur pleine, très aérées.
4. **Manifeste / appel prestataires** — aplat rose pâle, une phrase éditoriale en Cormorant, un seul bouton.

Transitions entre sections traitées comme des changements d'aplat francs (aucun dégradé), avec une ligne fine et le glyphe téléphone en marqueur.

## Annuaire

- Barre de recherche + filtres (rubrique, ville, déplacement) dans un bandeau clair et sobre, filtres actifs affichés en pastilles supprimables.
- Résultats en grandes cards pleine largeur : photo/avatar à gauche, nom en serif, activité, localisation, description courte (2 lignes), bouton « Consulter ». Une card par ligne sur mobile et desktop large, deux colonnes max.
- Suppression des mentions « n° 01 / page 12 » façon vieil annuaire.

## Navbar, footer, favicon

- Navbar blanche, logo horizontal + combiné, liens en Karla majuscules discrètes, bouton « Référencer » en rose plein.
- Bottom nav mobile conservée, restylée sans emoji.
- Favicon généré depuis le glyphe téléphone.

## Détails techniques

- `src/styles.css` : nouveaux tokens de couleur (oklch), remplacement des utilitaires actuels (`encart`, `rubrique`, `label-annonce`, `rayures-jaunes`, `cadre-double`) par un jeu cohérent : `aplat-rose`, `aplat-clair`, `titre-geant`, `fiche`, `oeil` (label). Retrait du jaune.
- `src/routes/__root.tsx` : chargement Cormorant Garamond + Karla via `<link>`, mise à jour du favicon.
- Nouveaux composants : `src/components/pr/Logo.tsx` (logo + glyphe combiné en SVG inline), `src/components/pr/Combine.tsx` (illustration hero).
- Réécriture de `src/routes/index.tsx` (hero + sections), `src/components/pr/layout.tsx`, `src/components/pr/bits.tsx`, `src/components/pr/FicheCard.tsx` (grande card), ajustement des filtres dans `src/routes/annuaire.tsx`.
- Alignement visuel léger sur `/categories`, `/prestataire/$id`, `/carte`, `/referencer` (tokens et typo), sans changement fonctionnel.
- Aucune modification de la base de données, des requêtes ou de la logique de modération.
