// Les fonctions L viennent de la bibliothèque Leaflet chargée dans carte.html.
// Crée la carte dans l'élément HTML qui a l'id "map".
const carte = L.map("map").setView([46.6, 2.4], 6);

// Ajoute le fond de carte OpenStreetMap.
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(carte);

// Affiche un message sous la carte.
function afficherMessage(message) {
    const paragraphe = document.createElement("p");
    paragraphe.innerText = message;
    document.querySelector("main").appendChild(paragraphe);
}

// Charge les apprenants depuis le fichier JSON.
fetch("../promo.json")
    .then(function (response) {
        return response.json();
    })
    .then(function (donnees) {
        const marqueurs = [];

        donnees.apprenants.forEach(function (apprenant) {
            if (apprenant.coordonnees) {
                const latitude = apprenant.coordonnees.latitude;
                const longitude = apprenant.coordonnees.longitude;
                const nomComplet = apprenant.prenom + " " + apprenant.nom;

                // Prépare le contenu de la fenêtre qui s'ouvre au clic.
                const contenuPopup = document.createElement("div");
                const nomPopup = document.createElement("strong");
                nomPopup.innerText = nomComplet;
                contenuPopup.appendChild(nomPopup);

                if (apprenant.ville !== "") {
                    const ville = document.createElement("div");
                    ville.innerText = apprenant.ville;
                    contenuPopup.appendChild(ville);
                }

                // Prépare le prénom et le nom affichés au survol.
                const texteTooltip = document.createElement("span");
                texteTooltip.innerText = nomComplet;

                // Crée le point, la fenêtre au clic et l'étiquette au survol.
                const marqueur = L.marker([latitude, longitude], {
                    riseOnHover: true
                });

                marqueur.bindPopup(contenuPopup);
                marqueur.bindTooltip(texteTooltip, {
                    direction: "top",
                    permanent: false,
                    opacity: 0.95
                });

                marqueurs.push(marqueur);
            }
        });

        if (marqueurs.length === 0) {
            afficherMessage("Aucun apprenant avec des coordonnées n'a été trouvé.");
        } else {
            // Ajoute tous les points à la carte et ajuste le zoom pour les voir.
            const groupeMarqueurs = L.featureGroup(marqueurs);
            groupeMarqueurs.addTo(carte);

            carte.fitBounds(groupeMarqueurs.getBounds(), {
                padding: [24, 24],
                maxZoom: 13
            });
        }
    });
