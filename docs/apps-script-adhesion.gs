/**
 * Réception sécurisée des demandes d'adhésion — Google Apps Script lié à une feuille Google Sheets.
 * Déploiement : Extensions > Apps Script > coller ce code > Déployer > Application Web
 *   Exécuter en tant que : Moi  |  Qui a accès : Tout le monde
 * Copier l'URL « /exec » dans js/config.js (ADHESION_ENDPOINT).
 * Le script répond { ok: true } UNIQUEMENT si la ligne a été écrite : le site n'affiche
 * « demande enregistrée » que dans ce cas.
 */
var NOTIFY_EMAIL = "africaslightassociation@gmail.com"; // responsables à notifier (à valider)
var COMMISSIONS = ["Communication", "Organisation", "Finances", "Mobilisation"];

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var d = JSON.parse(e.postData.contents);
    var nom = String(d.nom || "").trim().slice(0, 120);
    var tel = String(d.telephone || "").trim().slice(0, 30);
    var mail = String(d.email || "").trim().slice(0, 120);
    var commission = String(d.commission || "").trim();
    var motivation = String(d.motivation || "").trim().slice(0, 800);
    if (nom.length < 3 || !/^\+?\d{8,15}$/.test(tel.replace(/[\s.\-()]/g, "")) ||
        (commission && COMMISSIONS.indexOf(commission) === -1) || d.consent !== true) {
      return out({ ok: false, error: "invalid" });
    }
    lock.waitLock(10000);
    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Adhesions") ||
             SpreadsheetApp.getActiveSpreadsheet().insertSheet("Adhesions");
    if (sh.getLastRow() === 0) sh.appendRow(["Date", "Nom", "Téléphone", "E-mail", "Commission", "Motivation", "Statut", "Assigné à"]);
    sh.appendRow([new Date(), nom, tel, mail, commission, motivation, "nouvelle", ""]);
    var commissionText = commission ? " la commission " + commission : " l'association";
    try { MailApp.sendEmail(NOTIFY_EMAIL, "Nouvelle demande d'adhésion", nom + " (" + tel + ") souhaite rejoindre" + commissionText + "."); } catch (err) {}
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: "server" });
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}
function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
