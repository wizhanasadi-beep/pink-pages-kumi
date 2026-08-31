# Les Pages Roses — Couverture, nouveau logo, typo Abril Fatface

## 1. Nouveau logo (inspiré de l'icône annuaire)

Un carnet d'annuaire stylisé, redessiné en SVG dans la palette de la marque (rose signature, crème, bordeaux) :

- Carnet vu de face avec dos à spirales (4 anneaux) et un combiné téléphonique graphique au centre de la page.
- Traits fins, coins arrondis, aucun effet 3D : lecture nette de 16 px (favicon) à 400 px (couverture).
- Trois usages : `LogoAnnuaire` (grand, couverture), `Glyphe` (navbar / puces), favicon régénéré depuis le même tracé.
- Le lettrage « Les Pages Roses » accompagne le carnet, désormais en Abril Fatface.

## 2. Page de couverture avec ouverture

- À chaque arrivée sur l'accueil : couverture plein écran, grand aplat rose, « LES PAGES ROSES » en très gros, baseline « L'annuaire des Kumi », le logo carnet au centre, et un appel clair « Ouvrir l'annuaire ».
- Clic sur le logo (ou n'importe où) : animation d'ouverture — le carnet pivote comme une page qui s'ouvre, la couverture se soulève et révèle le site en dessous. Durée ~700 ms, puis on est sur l'accueil.
- Un lien « Passer » discret, et respect de `prefers-reduced-motion` (fondu simple).
- La couverture ne bloque jamais l'accès direct à `/annuaire`, `/carte`, etc.

## 3. Typographie

- Titres et logo : **Abril Fatface** (display généreux, épais, contrasté).
- Interface et corps de texte : **Cabin** (propre, très lisible).
- Cormorant Garamond et Karla sont retirés. Les tailles de titres sont recalibrées (Abril étant beaucoup plus lourd) et les micro-labels passent en Cabin majuscules espacées.

## 4. Site plus ludique et intuitif

- **Rubriques en gros pavés colorés** : la grille de listes textuelles devient 6 grands blocs cliquables (rose, crème, poudre, bordeaux) avec un pictogramme girly par rubrique et le nombre de fiches.
- **Recherche guidée** : sur le hero, un parcours en 2 clics — « Je cherche… » (rubrique / métier) + « à… » (ville) — avec suggestions, qui mène directement aux résultats filtrés de l'annuaire. La recherche libre reste disponible.
- **Illustrations girly** : petits éléments SVG (fleurs, combinés, étoiles, arches) posés en accents dans les aplats, jamais décoratifs au point de gêner la lecture.
- **Micro-animations** : apparition des sections au scroll, hovers sur les pavés et les fiches, transition « page qui tourne » entre couverture et site, boutons réactifs.

## Détails techniques

- Nouveaux composants : `src/components/pr/Logo.tsx` (réécriture : carnet + combiné), `src/components/pr/Couverture.tsx` (overlay animé), `src/components/pr/ornements.tsx` (SVG girly).
- Animation d'ouverture en CSS (`transform: rotateY` + `transform-origin: left`) déclarée dans `src/styles.css`, montée/démontée par état React dans `src/routes/index.tsx` — pas de nouvelle dépendance.
- `src/routes/__root.tsx` : liens Google Fonts remplacés par Abril Fatface + Cabin ; favicon mis à jour vers le nouveau tracé (`public/favicon.svg`).
- `src/styles.css` : `--font-display` / `--font-titre` / `--font-sans` mis à jour, ajout des utilitaires pavés (`pave-rose`, `pave-creme`…), keyframes d'ouverture et d'apparition au scroll. Palette de couleurs conservée.
- `src/routes/index.tsx` : hero avec recherche guidée, pavés de rubriques, sections animées ; `annuaire.tsx` accepte les mêmes paramètres de recherche (aucun changement de logique de données).
