/* Configuration publique du site (aucun secret ici : tout ce fichier est lisible par les visiteurs). */
window.ALA_CONFIG = {
  // Point d'entrée du formulaire d'adhésion (Google Apps Script — voir docs/apps-script-adhesion.gs).
  // Il doit répondre en JSON : { "ok": true } uniquement lorsque la demande est réellement enregistrée.
  ADHESION_ENDPOINT: "https://script.google.com/macros/s/AKfycbwxpxE6AB4F-JwZBS-zho3pswtjqLnilhZSexh2xpCZy1jt8RAOjn2Dkh_Sqr7pWlkd/exec",
  TIMEOUT_MS: 15000,
  WHATSAPP: "221780194442",          // À valider par l'association
  EMAIL: "africaslightassociation@gmail.com" // À valider par l'association
};
