# Remplir l'annuaire avec les vraies prestataires KUMI

Remplacement complet des 19 fiches fictives par les 27 vraies réponses du formulaire de recensement (toutes ont autorisé la publication).

## Ce qui s'affiche sur une fiche

- **Nom de l'activité en gros** (ex. « Nehyir House »), puis le **prénom** en dessous (« par Sarah »).
- **Type** : badge « Service » ou « Produit ».
- **Domaine** : Coiffure, Onglerie, Maquillage, Extension de cils, Événementiel, Restauration, Communication, Coaching, Création web…
- **Ville / zone d'intervention** (ex. Créteil 94, IDF, En ligne).
- **Lien** : site web s'il existe, sinon le @ Instagram (ou TikTok si c'est le seul réseau).
- **Jamais** : téléphone, e-mail, âge, nom de famille.
- **Photo** : initiales sur fond rose pour l'instant (les photos Google Drive ne sont pas accessibles ; on les ajoutera quand tu les enverras).

## Carte

Toutes les fiches sont placées : coordonnées de la ville quand elle est précisée (Créteil, Meaux, Noisy-le-Grand, Sartrouville, Épinay, Malakoff, Lieusaint, Ris-Orangis, Corbeil, Bonneuil, Champigny), centre de zone pour « Paris / IDF / 93 / 77 », et centre de Paris pour les activités 100 % en ligne, qui portent la mention « En ligne ».

## Rubriques

Les 6 rubriques existantes sont conservées, les fiches y sont réparties :
- Beauté : coiffure, onglerie, maquillage, cils, spa à domicile (≈17 fiches)
- Food : pâtisserie, cake design, traiteur, agroalimentaire (4)
- Événementiel : décoration (1)
- Création : contenu, audiovisuel, site web, crochet, bonnets en soie (5)
- Autres : coaching / éducation financière (1)

La ligne incomplète du fichier (prénom « Geniale », association de danse, aucune autre info) est écartée faute de données.

## Détails techniques

- Migration SQL : ajout d'une colonne `type_offre` (`service` | `produit`) sur `prestataires`, `DELETE` des fiches de démo, puis `INSERT` des 27 fiches réelles avec `statut = 'publiee'`, latitude/longitude codées en dur, `telephone` laissé nul.
- `src/lib/pages-roses.ts` : type `Prestataire` étendu avec `type_offre` et `prenom`.
- `src/components/pr/FicheCard.tsx`, `src/routes/prestataire.$id.tsx`, popup de `CarteLeaflet.tsx` : titre = nom de l'activité, sous-titre = prénom, badge Service/Produit, plus aucun affichage de téléphone.
- `src/routes/referencer.tsx` : ajout du choix Service / Produit et retrait du champ téléphone pour rester cohérent.
- Filtre « Service / Produit » ajouté dans l'annuaire.
