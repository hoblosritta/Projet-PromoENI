fetch("../promo.json")
    .then(function (response) {
        if (!response.ok) {
            throw new Error("Le fichier promo.json n'a pas pu être chargé.");
        }

        return response.json();
    })
    .then(function (promo) {
        document.querySelectorAll(".site-title").forEach(function (titre) {
            titre.textContent = promo.nomPromo;
        });
    })
    .catch(function (erreur) {
        console.error("Erreur lors du chargement des informations de la promotion :", erreur);
    });