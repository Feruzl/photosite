const salles = document.querySelectorAll(".salle");
let indexSalle = 0;

const flecheG = document.getElementById("gauche");
const flecheD = document.getElementById("droite");

function afficherSalle() {
  salles.forEach((salle, i) => {
    salle.classList.toggle("active", i === indexSalle);
  });
}

flecheD?.addEventListener("click", () => {
  if (indexSalle < salles.length - 1) indexSalle++;
  afficherSalle();
});

flecheG?.addEventListener("click", () => {
  if (indexSalle > 0) indexSalle--;
  afficherSalle();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") flecheD.click();
  if (e.key === "ArrowLeft") flecheG.click();
});
