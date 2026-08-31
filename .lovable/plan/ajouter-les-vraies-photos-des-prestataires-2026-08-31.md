# Ajouter les vraies photos des prestataires

Les images du formulaire sont maintenant accessibles depuis le Drive : j'ai testé deux fichiers, ils se téléchargent correctement en JPEG. On peut donc remplacer les initiales roses par les vraies photos.

## Ce qui va changer

- Chaque fiche affiche sa **photo principale** (la première image envoyée), recadrée pour remplir le cadre — vignettes toutes régulières dans l'annuaire, la carte et la fiche.
- Les prestataires qui ont envoyé plusieurs images (jusqu'à 5) auront une **petite galerie** sous leur fiche : miniatures cliquables qui agrandissent l'image.
- Les fiches sans photo gardent l'affichage actuel (initiales sur fond rose).

## Étapes

1. **Récupération** : téléchargement des ~60 images depuis les liens Drive du fichier de recensement, avec correspondance ligne par ligne (nom de l'activité).
2. **Hébergement** : envoi des images sur le CDN Lovable pour un chargement rapide et des URL stables (les liens Drive ne sont pas fiables à long terme).
3. **Base de données** : ajout d'une colonne `photos` (liste d'images) sur la table des prestataires, puis mise à jour de la photo principale (`photo_url`) et de la galerie pour les 28 fiches.
4. **Interface** :
   - `PhotoFiche` : affichage recadré (`object-cover`) et chargement différé (`loading="lazy"`), texte alternatif = nom de l'activité (bon pour le référencement).
   - Fiche prestataire : nouvelle section « En images » avec les miniatures et un agrandissement au clic.
   - Formulaire de référencement : inchangé (une seule photo par lien, comme aujourd'hui).

## Détails techniques

- Téléchargement via `https://drive.google.com/uc?export=download&id=…` puis upload avec `lovable-assets create`, un pointeur `.asset.json` par image sous `src/assets/prestataires/`.
- Migration : `ALTER TABLE public.prestataires ADD COLUMN photos text[] NOT NULL DEFAULT '{}'` (aucun changement de politiques RLS ni de GRANT nécessaires).
- Mise à jour des URL par requêtes de données, pas de nouveau schéma côté fiches.
- Type `Prestataire` étendu avec `photos: string[]` dans `src/lib/pages-roses.ts`.
- Nouveau composant `GaleriePhotos` dans `src/components/pr/` utilisé uniquement sur `prestataire.$id.tsx`.
- Vérification finale : capture d'écran de l'annuaire et d'une fiche à galerie pour contrôler cadrage et chargement.

## À noter

Certaines images sont des logos ou des captures Canva plutôt que des portraits : recadrées au centre, elles peuvent être légèrement coupées. Si le rendu ne te plaît pas sur certaines fiches, on pourra passer ces cas en « image entière visible ».
