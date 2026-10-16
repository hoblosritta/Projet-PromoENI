const listeApprenants = document.getElementById("listeApprenants");
const conteneurTableau = document.getElementById("conteneurTableau");
const cartesApprenants = document.getElementById("cartesApprenants");
const optionsAffichage = document.querySelectorAll('input[name="affichage"]');
const modalApprenant = document.getElementById("modalApprenant");
const titreModal = document.getElementById("titreModal");
const avatarModal = document.getElementById("avatarModal");
const nomModal = document.getElementById("nomModal");
const prenomModal = document.getElementById("prenomModal");
const villeModal = document.getElementById("villeModal");
const texteAnecdoteModal = document.getElementById("texteAnecdoteModal");
const AVATAR_PAR_DEFAUT = "../images/avatar.png";

let boutonDetailActif = null;

// Montre le tableau ou les cartes selon le choix sélectionné.
function afficherVue(affichage) {
    if (affichage === "cartes") {
        conteneurTableau.setAttribute("hidden", "");
        cartesApprenants.removeAttribute("hidden");
    } else {
        conteneurTableau.removeAttribute("hidden");
        cartesApprenants.setAttribute("hidden", "");
    }
}

// La page est dans le dossier html : on remonte d'un dossier vers images.
function obtenirCheminAvatar(cheminAvatar) {
    if (cheminAvatar) {
        return "../" + cheminAvatar;
    } else {
        return AVATAR_PAR_DEFAUT;
    }
}

// Ferme la fiche et remet le focus sur le bouton qui l'a ouverte.
function fermerFiche(restaurerFocus = true) {
    modalApprenant.setAttribute("hidden", "");

    if (restaurerFocus && boutonDetailActif !== null) {
        boutonDetailActif.focus();
    }

    boutonDetailActif = null;
}

// Remplit la fiche, puis l'ouvre ou la ferme selon l'apprenant cliqué.
function afficherFiche(apprenant, bouton) {
    if (
        boutonDetailActif === bouton &&
        modalApprenant.hasAttribute("hidden") === false
    ) {
        fermerFiche();
        return;
    }

    let nom = apprenant.nom;
    let prenom = apprenant.prenom;
    let ville = apprenant.ville;

    if (nom === "") {
        nom = "Non renseigné";
    }

    if (prenom === "") {
        prenom = "Non renseigné";
    }

    if (ville === "") {
        ville = "Non renseignée";
    }

    const nomComplet = prenom + " " + nom;

    titreModal.innerText = "Fiche de " + nomComplet;
    nomModal.innerText = nom;
    prenomModal.innerText = prenom;
    villeModal.innerText = ville;

    if (apprenant.anecdotes === "") {
        texteAnecdoteModal.innerText = "Aucune anecdote renseignée.";
    } else {
        texteAnecdoteModal.innerText = apprenant.anecdotes;
    }

    avatarModal.alt = "Avatar de " + nomComplet;
    avatarModal.src = obtenirCheminAvatar(apprenant.avatar);

    modalApprenant.removeAttribute("hidden");
    boutonDetailActif = bouton;
}

// Crée un bouton Détail utilisable dans le tableau et les cartes.
function creerBoutonDetail(apprenant, classeSupplementaire) {
    const bouton = document.createElement("button");

    bouton.setAttribute("type", "button");

    if (classeSupplementaire === "") {
        bouton.setAttribute("class", "bouton-detail");
    } else {
        bouton.setAttribute(
            "class",
            "bouton-detail " + classeSupplementaire
        );
    }

    bouton.innerText = "Détail";
    bouton.setAttribute(
        "aria-label",
        "Afficher la fiche de " + apprenant.prenom + " " + apprenant.nom
    );

    bouton.addEventListener("click", function () {
        afficherFiche(apprenant, bouton);
    });

    return bouton;
}

document.addEventListener("click", function (event) {
    if (modalApprenant.hasAttribute("hidden")) {
        return;
    }

    if (
        modalApprenant.contains(event.target) ||
        event.target.closest(".bouton-detail") !== null
    ) {
        return;
    }

    fermerFiche(false);
});


// Restaure le choix enregistré, avec Liste par défaut.
const affichageEnregistre = localStorage.getItem("affichage");
let affichageInitial = "liste";

if (affichageEnregistre === "cartes") {
    affichageInitial = "cartes";
}

document.getElementById("Liste").checked = affichageInitial === "liste";
document.getElementById("Cartes").checked = affichageInitial === "cartes";
afficherVue(affichageInitial);

// Change l'affichage quand un nouveau choix est sélectionné.
optionsAffichage.forEach(function (option) {
    option.addEventListener("change", function () {
        if (option.checked === false) {
            return;
        }

        localStorage.setItem("affichage", option.value);
        afficherVue(option.value);
    });
});

// Charge le JSON et crée les lignes du tableau et les cartes.
fetch("../promo.json")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        const nombreApprenantsReels = data.apprenants.length;
        document.getElementById("nombreIntro").innerText = nombreApprenantsReels;
        document.getElementById("nombreParcours").innerText = nombreApprenantsReels;
        document.getElementById("nombreProfils").innerText = nombreApprenantsReels;

        let nombreApprenantsAvecZero = nombreApprenantsReels;

        if (nombreApprenantsAvecZero < 10) {
            nombreApprenantsAvecZero = "0" + nombreApprenantsAvecZero;
        }
        document.getElementById("nombreApprenantsHero").innerText = nombreApprenantsAvecZero;
        data.apprenants.forEach(function (apprenant) {
            // Ajoute une ligne au tableau.
            const ligne = document.createElement("tr");

            const celluleNom = document.createElement("td");
            celluleNom.innerText = apprenant.nom;

            const cellulePrenom = document.createElement("td");
            cellulePrenom.innerText = apprenant.prenom;

            const celluleVille = document.createElement("td");
            celluleVille.innerText = apprenant.ville;

            const celluleDetail = document.createElement("td");
            celluleDetail.appendChild(creerBoutonDetail(apprenant, ""));

            ligne.appendChild(celluleNom);
            ligne.appendChild(cellulePrenom);
            ligne.appendChild(celluleVille);
            ligne.appendChild(celluleDetail);
            listeApprenants.appendChild(ligne);

            // Crée une carte pour le même apprenant.
            const carte = document.createElement("article");
            carte.setAttribute("class", "carte-apprenant");

            const nomComplet = document.createElement("h3");
            nomComplet.innerText = apprenant.prenom + " " + apprenant.nom;

            const ville = document.createElement("p");
            ville.setAttribute("class", "ville-carte");
            ville.innerText = apprenant.ville;

            carte.appendChild(nomComplet);
            carte.appendChild(ville);
            carte.appendChild(
                creerBoutonDetail(apprenant, "lien-detail-carte")
            );

            cartesApprenants.appendChild(carte);
        });
    });

