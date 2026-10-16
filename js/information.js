function formaterDate(dateISO) {
    const parties = dateISO.split("-");
    return parties[2] + "/" + parties[1] + "/" + parties[0];
}

fetch("../promo.json")
    .then(function (response) {
        if (!response.ok) {
            throw new Error("Le fichier promo.json n'a pas pu être chargé.");
        }

        return response.json();
    })
    .then(function (promo) {
        document.getElementById("datesFormation").textContent =
            "Formation du " +
            formaterDate(promo.dateDebutFormation) +
            " au " +
            formaterDate(promo.dateFinFormation);

        document.getElementById("nombreApprenants").textContent =
            "Nombre d'apprenants : " + promo.nombreApprenants;

        const description = document.getElementById("texteDescription");
        const paragraphes = promo.descriptionFormation.split("\n\n");

        paragraphes.forEach(function (texte, index) {
            const paragraphe = document.createElement("p");

            if (index === 0 || index === paragraphes.length - 1) {
                const texteMisEnAvant = document.createElement("strong");
                texteMisEnAvant.className = "mise-en-avant-description";
                texteMisEnAvant.textContent = texte;
                paragraphe.appendChild(texteMisEnAvant);
            } else {
                paragraphe.textContent = texte;
            }

            description.appendChild(paragraphe);
        });
    })
    .catch(function (erreur) {
        console.error("Erreur lors du chargement des informations de la promotion :", erreur);
    });