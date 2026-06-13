const form = document.getElementById("adhesionForm");

if (form) {

form.addEventListener("submit", function(e){

e.preventDefault();

const nom =
document.getElementById("nom").value;

const tel =
document.getElementById("telephone").value;

const email =
document.getElementById("email").value;

const commission =
document.getElementById("commission").value;

document.getElementById("message").innerHTML =

`
<h3>
Merci ${nom} !
</h3>

<p>
Votre demande d'adhésion a été enregistrée.
</p>

<p>
Commission choisie :
<strong>${commission}</strong>
</p>
`;

form.reset();

});

}


let nombre = 0;

setInterval(() => {

if(nombre < 150){
nombre++;
document.getElementById("compteur")
.innerText =
nombre + " Membres";
}

},30);



const actus = [

"Journée Portes Ouvertes - 11 juillet 2026",
"Appel aux dons pour les enfants vulnérables",
"Campagne d'adhésion Africa's Light"

];

let html = "";

actus.forEach(actu => {
html += `<p>📰 ${actu}</p>`;
});

document.getElementById("actus").innerHTML = html;



let nombre = 0;

const compteur =
document.getElementById("compteur");

const timer = setInterval(() => {

nombre++;

compteur.innerText = nombre;

if(nombre >= 150){
clearInterval(timer);
}

}, 30);



const actus = [

"🌟 Journée Portes Ouvertes - 11 juillet 2026",
"❤️ Appel aux dons pour les enfants vulnérables",
"🤝 Campagne d'adhésion Africa's Light"

];

let html = "";

actus.forEach(actu => {

html += `
<div class="card">
<p>${actu}</p>
</div>
`;

});

document.getElementById("actus").innerHTML = html;