const salles = document.querySelectorAll(".salle");
const expoContainer = document.querySelector(".expo"); 
let indexSalle = 0;

const flecheG = document.getElementById("gauche");
const flecheD = document.getElementById("droite");

// =========================================================
// NAVIGATION SALLE (Horizontal)
// =========================================================

function deplacerSalle() {
    // Déplace le conteneur 'expo' horizontalement
    const translationValue = -indexSalle * 100; 
    expoContainer.style.transform = `translateX(${translationValue}vw)`;
}

flecheD?.addEventListener("click", () => {
    if (indexSalle < salles.length - 1) {
        indexSalle++;
        deplacerSalle();
    }
});

flecheG?.addEventListener("click", () => {
    if (indexSalle > 0) {
        indexSalle--;
        deplacerSalle();
    }
});

// NAVIGATION AU CLAVIER (Horizontal)
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") flecheD.click();
    if (e.key === "ArrowLeft") flecheG.click();
});

// Initialiser la position au chargement
deplacerSalle();