# Site Africa's Light — refonte 2026 (phase 1 : front)

Site statique HTML/CSS/JS, sans framework. Hébergement actuel : Render (site statique).

## Structure
```
index.html + 10 pages (apropos, bureau, projets, commissions, actualites, galerie,
                       adhesion, contact, soutenir, mentions-legales)
css/theme.css      tokens (palette du logo), typographies, composants, accueil
css/pages.css      styles des pages internes
js/main.js         menu mobile, header, progression, révélations
js/pages.js        filtre des projets, lightbox, présélection de commission
js/config.js       configuration publique (endpoint du formulaire, contacts)
js/adhesion.js     validation + envoi + confirmation honnête
assets/            fonts (Fraunces, Manrope), icons.svg (Lucide), img/, media/
docs/              termes de référence (PDF), apps-script-adhesion.gs
sitemap.xml, robots.txt
```

## Déploiement
Remplacer le contenu du dépôt GitHub par ce dossier (racine du site = ce dossier), puis laisser Render redéployer.
Test local : `python3 -m http.server 8000` dans ce dossier, puis http://localhost:8000.

## Formulaire d'adhésion — à configurer
Le site n'affiche « demande enregistrée » que si le serveur répond `{ "ok": true }`.
1. Ouvrir le Google Sheet de l'association > Extensions > Apps Script.
2. Coller `docs/apps-script-adhesion.gs`, déployer en Application Web (accès : Tout le monde).
3. Mettre la nouvelle URL `/exec` dans `js/config.js`.
4. Tester avec une vraie demande. Tant que le script ne répond pas `{ok:true}`, le visiteur voit un message l'invitant à écrire par WhatsApp ou e-mail.
Solution transitoire : une base gérée avec rôles (type Supabase) est recommandée en phase 2.

## À valider / compléter par l'association
- E-mail et téléphone officiels (contact, footer, WhatsApp) : marqués « À valider ».
- Noms et fonctions de la page Bureau (établis d'après les fiches du site précédent).
- Statut des projets « à confirmer ».
- Mentions légales (directeur de publication, récépissé), durée de conservation, vérification juridique.
- Photos réelles à la place des 3 images de démonstration de l'accueil (voir IMAGES-A-REMPLACER.md).
- Mot de passe « Africa123 » : retiré du code, mais visible dans l'historique Git — le changer partout où il sert.

## Non inclus dans cette version
Fiches détaillées par projet et par article, tableau de bord administrateur, gestion des actualités/galerie sans code, intégration GI-COLLECTE, notifications testées. Ces éléments exigent un backend et des validations (phase 2).

## Médias
Portraits et affiches convertis en WebP, vidéos recompressées en 720p (de 26 Mo à 12 Mo). Les originaux restent dans votre zip d'origine.
