// =========================================================
// GESTION DU FOND PLEINE PAGE (Diaporama)
// (Pour index.html et about.html)
// =========================================================

const bgPage = document.querySelector(".dynamic-background-page");

if (bgPage) {
    const images = document.querySelectorAll('#slideshow-background img');
    let currentImageIndex = 0;

    /**
     * Fonction de défilement (slideshow) pour la page d'accueil
     */
    function startSlideshow() {
        // Ne lance le slideshow que s'il y a plus d'une image
        if (images.length <= 1) return; 

        setInterval(() => {
            // 1. Désactiver l'image actuelle
            images[currentImageIndex].classList.remove('active-bg');

            // 2. Calculer l'index de la prochaine image
            currentImageIndex = (currentImageIndex + 1) % images.length;
            const nextImage = images[currentImageIndex];

            // 3. Activer la nouvelle image
            nextImage.classList.add('active-bg');
            
        }, 5000); // Défilement toutes les 5 secondes
    }

    // Initialisation du diaporama au chargement de la page
    document.addEventListener('DOMContentLoaded', () => {
        if (images.length > 0) {
            // S'assurer que la première image est active
            images[0].classList.add('active-bg'); 
        }
        
        // Démarrer le défilement si nécessaire
        if (images.length > 1) {
            startSlideshow();
        }
    });
}


// =========================================================
// GESTION DE L'EXPOSITION IMMERSIVE (NAVIGATION HORIZONTALE/VERTICALE)
// (Pour 2024.html et 2025.html)
// =========================================================

const expoContainer = document.querySelector(".expo"); 
const flecheG = document.getElementById("gauche");
const flecheD = document.getElementById("droite");
const flechesContainer = document.querySelector(".fleches");

let indexSalle = 0; 
let totalPages; 
let isScrolling = false; 

// Fonction pour déterminer la couleur de fond et ajuster les flèches
function updateFlecheColor() {
    // Vérifie si l'on est bien sur une page d'exposition
    if (!expoContainer || !flechesContainer) return; 
    
    const allSalles = document.querySelectorAll(".salle");
    if (allSalles.length === 0) return;

    const activeSalle = allSalles[indexSalle];
    let isFonce = false;

    if (activeSalle) {
        if (activeSalle.classList.contains('salle-future')) {
            // Salle future (blanche)
            isFonce = false; 
        } else {
            // Pour la salle d'exposition (Salle 1)
            const murs = activeSalle.querySelectorAll(".mur");
            const murHeight = window.innerHeight;
            const currentScroll = activeSalle.scrollTop;

            // Détermine quel mur est majoritairement visible
            let visibleMurIndex = Math.round(currentScroll / murHeight);
            
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

    // Applique la classe appropriée pour la couleur des flèches
    if (isFonce) {
        flechesContainer.classList.add("fleches-fonce");
        flechesContainer.classList.remove("fleches-clair");
    } else {
        flechesContainer.classList.add("fleches-clair");
        flechesContainer.classList.remove("fleches-fonce");
    }
}


// 1. GESTION HORIZONTALE (Salles - Par flèches)
function deplacerSalle() {
    const translationValue = -indexSalle * 100; 
    expoContainer.style.transform = `translateX(${translationValue}vw)`;
    
    // Mettre à jour la couleur des flèches après le déplacement horizontal
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
    // S'assurer que les flèches existent avant d'essayer de les utiliser
    if (!flecheD || !flecheG) return; 

    if (e.key === "ArrowRight") {
        e.preventDefault(); 
        flecheD.click();
    }
    if (e.key === "ArrowLeft") {
        e.preventDefault();
        flecheG.click();
    }
});

// 2. GESTION VERTICALE PAR SEUIL (Murs - Par molette)
function handleVerticalScroll(e) {
    if (!expoContainer) return; // Ne pas exécuter si ce n'est pas la page d'exposition

    // Annule le défilement si le mouvement est majoritairement horizontal
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        return; 
    }
    
    // Empêche les défilements multiples en succession rapide
    if (isScrolling) {
        e.preventDefault();
        return;
    }
    
    const delta = e.deltaY;
    const SCROLL_THRESHOLD = 20; 

    if (Math.abs(delta) < SCROLL_THRESHOLD) {
        return; 
    }
    
    const allSalles = document.querySelectorAll(".salle");
    const activeSalle = allSalles[indexSalle];
    
    // La salle active n'est pas censée être scrollable (comme salle-future)
    if (!activeSalle || activeSalle.style.overflowY === 'hidden') {
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

    // Mettre à jour la couleur des flèches après le défilement vertical
    // Le délai est ajusté pour le 'smooth' scroll
    setTimeout(() => {
        isScrolling = false;
        updateFlecheColor(); 
    }, 70); 
}

window.addEventListener("wheel", handleVerticalScroll, { passive: false });


// 3. INITIALISATION de l'exposition
document.addEventListener('DOMContentLoaded', () => {
    // Initialisation uniquement si l'exposition existe
    if (expoContainer) {
        const pages = document.querySelectorAll(".salle"); 
        totalPages = pages.length;
        
        deplacerSalle(); // Initialise la position et appelle updateFlecheColor
        
        // Écouteur pour le défilement vertical direct de la salle (pour les scrollbars et les cas non gérés par handleVerticalScroll)
        const primarySalle = document.querySelector(".salle");
        if (primarySalle) {
            primarySalle.addEventListener('scroll', () => {
                // N'agit que si le défilement n'est pas en cours (pour éviter les saccades)
                if (!isScrolling) { 
                    updateFlecheColor();
                }
            });
        }
    }
});