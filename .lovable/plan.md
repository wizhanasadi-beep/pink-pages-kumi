# Charte graphique Kumi appliquée aux Pages Roses

Objectif : ne changer que l'habillage (couleurs, typographies, ambiance). Tout le contenu, les pages, les fiches, les filtres, les photos, l'espace rédaction et la logique restent identiques.

## Palette (issue de la charte)

- Rose Kumi vif `#F20098` — couleur de marque : boutons, liens, accents, mot « Roses ».
- Rose flash `#F9459C` — hover, aplats secondaires, anneaux de focus.
- Noir profond `#0A0A0A` — texte principal et aplats sombres (remplace le bordeaux).
- Taupe `#836964` — texte secondaire, bordures fines, légendes.
- Terracotta `#DB4A2B` et Jaune doré `#FCB238` — accents ponctuels (badges « à la une », pastilles de filtres actifs, notes/étoiles des avis).
- Fond : blanc cassé très clair et neutre, plus épuré que le crème actuel, pour laisser le rose vif respirer.

Vérification des contrastes : sur aplat rose vif, le texte passe en blanc ; le taupe reste réservé aux textes secondaires de taille suffisante.

## Typographies

La charte demande **Open Sauce** (sans) + **The Seasons** (serif élégant). Ces deux fontes ne sont pas distribuées librement pour le web ; on utilise les substituts les plus proches, chargés depuis Google Fonts :

- Titres / logo : **Cormorant Garamond** (serif haute contraste, très proche de The Seasons).
- Interface et corps de texte : **Plus Jakarta Sans** (géométrique arrondi, proche d'Open Sauce).

Si tu possèdes les fichiers de fontes Open Sauce et The Seasons, envoie-les et je les substitue directement.

## Ambiance

- Style « épuré, moderne, sobre, glam » : moins d'ombres roses lourdes, davantage de filets fins taupe, plus d'air entre les blocs.
- Rayons d'arrondi légèrement réduits (cartes plus nettes), boutons pilule conservés.
- Les médaillons photo des rubriques restent, avec liseré rose vif au lieu du rose poudré.

## Détails techniques

- `src/styles.css` : réécriture des tokens `--background`, `--foreground`, `--rose`, `--poudre`, `--bordeaux`, `--encre`, `--creme`, `--primary`, `--secondary`, `--muted`, `--border`, `--ring`, ombres `--shadow-encart*`, et des variables `--font-display` / `--font-titre` / `--font-sans`. Ajout de tokens `--terracotta` et `--dore` pour les accents.
- `src/routes/__root.tsx` : remplacement des liens Google Fonts (DM Serif Display + Fira Sans → Cormorant Garamond + Plus Jakarta Sans).
- Ajustements ponctuels de classes dans `layout.tsx`, `bits.tsx`, `FicheCard.tsx`, `Couverture.tsx`, `VignetteRubrique.tsx`, `index.tsx`, `categories.tsx`, `annuaire.tsx`, `admin.tsx` uniquement là où une valeur de couleur ou une taille de titre doit suivre la nouvelle échelle typographique.
- Aucun changement de données, de requêtes, de routes ou de logique métier.
