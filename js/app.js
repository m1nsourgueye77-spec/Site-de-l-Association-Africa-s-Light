window.addEventListener("DOMContentLoaded", function () {

  // MENU MOBILE
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      nav.classList.toggle("active");
    });
  }

  // FORMULAIRE D'ADHÉSION
  const form = document.getElementById("adhesionForm");

  if (form) {

    const API_ADHESION =
      "https://script.google.com/macros/s/AKfycbwxpxE6AB4F-JwZBS-zho3pswtjqLnilhZSexh2xpCZy1jt8RAOjn2Dkh_Sqr7pWlkd/exec";

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const data = {
        nom: document.getElementById("nom").value,
        telephone: document.getElementById("telephone").value,
        email: document.getElementById("email").value,
        commission: document.getElementById("commission").value
      };

      fetch(API_ADHESION, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      .then(res => res.text())
      .then(text => {
        console.log(text);

        document.getElementById("message").innerHTML =
          "✅ Demande envoyée avec succès !";

        form.reset();
      })
      .catch(err => {
        console.error(err);

        document.getElementById("message").innerHTML =
          "❌ Erreur d'envoi. Réessayez.";
      });
    });
  }

});
