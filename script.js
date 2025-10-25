const expoContainer = document.querySelector(".expo"); 
const flecheG = document.getElementById("gauche");
const flecheD = document.getElementById("droite");
const flechesContainer = document.querySelector(".fleches"); // Nouveau: Conteneur des flèches

let indexSalle = 0; 
let totalPages; 
let isScrolling = false; 

// =========================================================
// NOUVEAU: Fonction pour déterminer la couleur de fond et ajuster les flèches
// =========================================================
function updateFlecheColor() {
    const activeSalle = document.querySelectorAll(".salle")[indexSalle];
    let isFonce = false;

    if (activeSalle) {
        if (activeSalle.classList.contains('salle-future')) {
            // Si c'est la salle future (blanche), les flèches sont sombres
            isFonce = false; 
        } else {
            // Pour la salle d'exposition (Salle 1), vérifie le mur actuellement visible
            const murs = activeSalle.querySelectorAll(".mur");
            const murHeight = window.innerHeight;
            const currentScroll = activeSalle.scrollTop;

            // Détermine quel mur est majoritairement visible
            let visibleMurIndex = Math.round(currentScroll / murHeight);
            
            // Assure que l'index ne dépasse pas le nombre de murs
            if (visibleMurIndex >= murs.length) {
                visibleMurIndex = murs.length - 1;
            }

            const visibleMur = murs[visibleMurIndex];

            // Si c'est le mur du footer, qui est foncé
            if (visibleMur && visibleMur.classList.contains("footer-mur")) {
                isFonce = true;
            } else {
                // Pour les autres murs de la salle 1 (fond clair par défaut)
                isFonce = false;
            }
        }
    }

    if (isFonce) {
        flechesContainer.classList.add("fleches-fonce");
        flechesContainer.classList.remove("fleches-clair");
    } else {
        flechesContainer.classList.add("fleches-clair");
        flechesContainer.classList.remove("fleches-fonce");
    }
}


// =========================================================
// 1. GESTION HORIZONTALE (Salles - Par flèches)
// =========================================================

function deplacerSalle() {
    const translationValue = -indexSalle * 100; 
    expoContainer.style.transform = `translateX(${translationValue}vw)`;
    
    // NOUVEAU: Mettre à jour la couleur des flèches après le déplacement horizontal
    updateFlecheColor();
}

// NAVIGATION PAR FLÈCHES
flecheD?.addEventListener("click", () => {
    if (indexSalle < totalPages - 1) { 
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

// NAVIGATION AU CLAVIER
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
        e.preventDefault(); 
        flecheD.click();
    }
    if (e.key === "ArrowLeft") {
        e.preventDefault();
        flecheG.click();
    }
});

// =========================================================
// 2. GESTION VERTICALE PAR SEUIL (Murs - Par molette)
// =========================================================

function handleVerticalScroll(e) {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || indexSalle !== 0) {
        return; 
    }
    
    if (isScrolling) {
        e.preventDefault();
        return;
    }
    
    const delta = e.deltaY;
    const SCROLL_THRESHOLD = 20; 

    if (Math.abs(delta) < SCROLL_THRESHOLD) {
        return; 
    }
    
    const activeSalle = document.querySelectorAll(".salle")[indexSalle];
    
    if (!activeSalle) {
        return;
    }

    const murHeight = window.innerHeight;
    const murs = activeSalle.querySelectorAll(".mur");
    
    if (murs.length <= 1) {
        return; 
    }
    
    const currentScroll = activeSalle.scrollTop;

    e.preventDefault();
    isScrolling = true;
    
    let targetScroll;
    
    // Défilement vers le bas
    if (delta > 0) {
        targetScroll = currentScroll + murHeight;
        targetScroll = Math.min(targetScroll, activeSalle.scrollHeight - murHeight); 
    } 
    // Défilement vers le haut
    else {
        targetScroll = currentScroll - murHeight;
        targetScroll = Math.max(targetScroll, 0);
    }

    activeSalle.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
    });

    // NOUVEAU: Mettre à jour la couleur des flèches après le défilement vertical
    // On met un délai pour s'assurer que le défilement est terminé et que le mur est visible
    setTimeout(() => {
        isScrolling = false;
        updateFlecheColor(); 
    }, 70); 
}

window.addEventListener("wheel", handleVerticalScroll, { passive: false });


// =========================================================
// 3. INITIALISATION
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll(".salle"); 
    totalPages = pages.length;
    
    deplacerSalle(); // Initialise la position et appelle updateFlecheColor
    updateFlecheColor(); // S'assure de l'appliquer au chargement initial
});

// NOUVEAU: Écouteur pour le défilement vertical direct de la salle pour gérer les cas non-molette ou redimensionnement
// Sans cela, si l'utilisateur fait glisser la barre de défilement manuellement, la couleur ne s'adapte pas.
document.querySelector(".salle").addEventListener('scroll', () => {
    // Si nous ne sommes pas déjà en train de défiler de manière contrôlée, mettez à jour.
    // Et seulement si c'est la salle d'exposition (indexSalle === 0)
    if (!isScrolling && indexSalle === 0) { 
        updateFlecheColor();
    }
});