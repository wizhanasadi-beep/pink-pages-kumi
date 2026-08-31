# Simplifier le bloc recherche de l'accueil

L'encart « Recherche guidée » (deux champs + bouton + pastilles « Populaire ») est trop lourd et fait générique. On le remplace par une barre unique, discrète et éditoriale.

## Ce qui change sur l'accueil

- Suppression de l'encart complet : libellés « Je cherche… / à… », le select ville, le bouton « C'est parti » et la ligne « Populaire ».
- À la place, sous la baseline : une seule barre de recherche fine (champ + petite icône/bouton) avec le placeholder « MUA, coiffeuse, photographe… ».
- Valider (Entrée ou clic) envoie vers `/annuaire?q=…`. Champ vide = on ouvre l'annuaire complet.
- Les liens existants « Feuilleter l'annuaire » / « Voir la carte » restent inchangés juste en dessous.
- Les suggestions (datalist des rubriques et sous-rubriques) sont conservées, mais invisibles tant qu'on ne tape pas.

## Ce qui ne change pas

- La page `/annuaire` garde tous ses filtres (rubrique, ville, département) : c'est là que se fait le filtrage fin.
- Aucun changement de contenu, de données ou de couleurs.

## Détail technique

- `src/routes/index.tsx` : retirer le `<form>` de recherche guidée et l'état `ville`, garder un seul état `besoin`, simplifier `lancer()` en `navigate({ to: "/annuaire", search: { q: besoin, cat: "", dep: "", ville: "" } })`.
- Style : champ `rounded-full` bordure fine, largeur max ~28rem, sans cadre `encart` ni fond papier lourd.
