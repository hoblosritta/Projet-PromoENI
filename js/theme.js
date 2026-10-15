// Applique le thème enregistré à l'ouverture de chaque page.
function appliquerTheme(valeur) {
    if (valeur === "sombre") {
        document.documentElement.setAttribute("data-theme", "sombre");
    } else {
        document.documentElement.setAttribute("data-theme", "clair");
    }
}

appliquerTheme(localStorage.getItem("theme"));

window.addEventListener("storage", function (event) {
    if (event.key === "theme") {
        appliquerTheme(event.newValue);
    }
});