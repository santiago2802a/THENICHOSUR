const cara = document.getElementById("cara");
const intro = document.getElementById("intro");
const pagina = document.getElementById("pagina");

setTimeout(() => {
    cara.textContent = ";)";
}, 1000);

setTimeout(() => {
    intro.style.display = "none";
    pagina.style.display = "block";
}, 2200);


const modelo = document.getElementById('modelo-logo');

let temporizadorInactividad;

modelo.addEventListener('camera-change', (e) => {
    if (e.detail.source === 'user-interaction') {
        modelo.removeAttribute('auto-rotate');
        clearTimeout(temporizadorInactividad);

        temporizadorInactividad = setTimeout(() => {
            modelo.setAttribute('auto-rotate', '');
        }, 2000);
    }
});

let t = 0;
function animarLuz() {
    t += 0.01;
    const exposicion = 1 + Math.sin(t) * 0.3;
    modelo.exposure = exposicion;
    requestAnimationFrame(animarLuz);
}
animarLuz();


document.addEventListener('DOMContentLoaded', () => {

    const fuentes = ["Boogaloo", "FirstPlace", "Quiff", "Sabrosy", "WishfulWaves"];

    function envolverLetras(elemento) {
        const texto = elemento.textContent;
        elemento.innerHTML = "";
        texto.split("").forEach(letra => {
            const span = document.createElement("span");
            span.textContent = letra;
            elemento.appendChild(span);
        });
    }

    const titulo = document.querySelector('.titulo');
    const videos = document.querySelector('.videos a');
    if (titulo) envolverLetras(titulo);
    if (videos) envolverLetras(videos);

    setInterval(() => {
        document.querySelectorAll('.titulo span, .videos span').forEach(span => {
            const fuenteRandom = fuentes[Math.floor(Math.random() * fuentes.length)];
            span.style.setProperty('font-family', fuenteRandom, 'important');
        });
    }, 1500);
});


document.getElementById('btn-videos').addEventListener('click', (e) => {
    window.open('https://www.youtube.com/@thenichosur', '_blank');
});