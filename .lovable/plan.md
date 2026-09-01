# Rose plus vif + vignettes photo stylisées

## 1. Un rose qui pète (fond conservé)

Le fond clair `#FAF6F4`, le bordeaux et la couleur de texte restent identiques. Seul le rose devient plus saturé et lumineux :

- Rose principal : de `#D88C9A` (poudré) vers un rose bonbon franc autour de `#E8637F` — assez vif pour les accents, les boutons, les liens et les pictos.
- Rose poudré (aplats, fonds de blocs) : légèrement remonté en saturation pour rester en accord, sans devenir criard.
- Ombres roses et anneaux de focus recalés sur le nouveau rose.
- Vérification des contrastes : texte sur aplat rose passe en blanc cassé si besoin pour rester lisible.

## 2. Vignettes de rubriques : photo à la place de l'icône

Sur l'accueil (grille « Les rubriques ») et la page Catégories, l'icône SVG est remplacée par une vignette photo stylisée :

- Format inchangé pour le pavé : la photo occupe le même emplacement que l'icône (petit médaillon en haut du pavé), pas tout le fond.
- Style : médaillon arrondi (cercle / carré très arrondi) avec liseré rose fin, léger voile rose en surimpression pour homogénéiser les 6 images, et zoom doux au survol comme aujourd'hui.
- Images issues de tes envois, associées ainsi :
  - Beauté → flacons skincare sur plateau argenté
  - Mode → portant de manteaux rose/bordeaux
  - Création / contenu → bureau UGC (appareil photo rose, magazines)
  - Food → strawberry shortcake
  - Autres / self-care → sérums lèvres rose pâle
  - Événementiel → téléphone rose + accessoires beauté (à défaut d'image dédiée ; dis-moi si tu préfères en envoyer une)
- Repli : si une rubrique n'a pas d'image, l'ancien picto SVG est conservé.

## Détails techniques

- `src/styles.css` : mise à jour des tokens `--rose`, `--poudre`, `--ring` et des ombres roses (valeurs oklch).
- Nouveau composant `VignetteRubrique` (dans `src/components/pr/ornements.tsx` ou fichier dédié) : mapping slug → image, styles du médaillon, fallback `PictoRubrique`.
- Images ajoutées via pointeurs Lovable Assets (CDN), pas de binaires dans le dépôt.
- Intégration dans `src/routes/index.tsx` (grille rubriques) et `src/routes/categories.tsx`.
