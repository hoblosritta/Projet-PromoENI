const formulaire = document.getElementById("formPreferences");
const theme = document.getElementById("theme");
const liste = document.getElementById("Liste");
const cartes = document.getElementById("Cartes");
const boutonEnregistrer = document.getElementById("boutonEnregistrer");

const themeEnregistre = localStorage.getItem("theme");
const affichageEnregistre = localStorage.getItem("affichage");

if (themeEnregistre !== null) {
    theme.value = themeEnregistre;
}

if (affichageEnregistre === "liste") {
    liste.checked = true;
} else if (affichageEnregistre === "cartes") {
    cartes.checked = true;
}

// Prévisualise le thème choisi dans le menu.
formulaire.addEventListener("change", function () {
    document.documentElement.setAttribute("data-theme", theme.value);
});

// Enregistre les préférences lorsque le bouton est cliqué.
boutonEnregistrer.addEventListener("click", function () {
    let choixTheme = theme.value;
    let choixAffichage;

    if (liste.checked) {
        choixAffichage = "liste";
    } else {
        choixAffichage = "cartes";
    }

    localStorage.setItem("theme", choixTheme);
    localStorage.setItem("affichage", choixAffichage);

    document.documentElement.setAttribute("data-theme", choixTheme);
});
