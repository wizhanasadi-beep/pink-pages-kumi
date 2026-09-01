# Accès rédaction par code numérique

## Objectif
Conserver `/admin` sans compte ni adresse e-mail, avec un simple code numérique choisi par la propriétaire du site.

## Modifications prévues
- Remplacer le mécanisme de cookie signé manuellement par une session serveur chiffrée et indépendante du code d’accès.
- Conserver le code uniquement dans un secret serveur, jamais dans le navigateur ni dans le code source.
- Limiter le formulaire aux chiffres avec un clavier numérique sur mobile et un message d’erreur clair.
- Mettre à jour le secret avec le nouveau code numérique choisi via le formulaire sécurisé de gestion des secrets.
- Garder la session ouverte pendant 12 heures et conserver le bouton « Quitter ».
- Vérifier que le dashboard, les demandes et l’export restent inaccessibles sans session valide.

## Validation
- Tester un mauvais code : accès refusé.
- Tester le nouveau code : ouverture du dashboard.
- Recharger `/admin` : session conservée.
- Quitter puis rouvrir `/admin` : code demandé à nouveau.
- Tester sur mobile que le clavier numérique apparaît.

## Détails techniques
- Comparaison du code côté serveur avec une vérification à temps constant.
- Secret de session distinct, aléatoire et d’au moins 32 caractères.
- Aucune authentification par e-mail et aucune création de compte.
