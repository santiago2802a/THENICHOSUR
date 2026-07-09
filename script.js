const cara = document.getElementById("cara");
const hint = document.getElementById("hint");
const intro = document.getElementById("intro");
const pagina = document.getElementById("pagina");
const modelo = document.getElementById('modelo-logo');

let yaEntro = false;

hint.style.display = "none";

setTimeout(() => { cara.textContent = ";)"; }, 2000);
setTimeout(() => { cara.textContent = ":)"; }, 4000);

function mostrarLogo() {
    cara.style.display = "none";
    modelo.classList.add('visible');
    hint.textContent = "Tocá el logo para entrar";
    hint.style.display = "block";
}

// Esperamos a que la librería model-viewer esté realmente cargada
// antes de mostrar el logo, en vez de confiar solo en el tiempo
setTimeout(() => {
    if (customElements.get('model-viewer')) {
        mostrarLogo();
    } else {
        customElements.whenDefined('model-viewer').then(mostrarLogo);
        // Si por algún motivo nunca carga, dejamos pasar igual a los 4s extra
        setTimeout(() => {
            if (modelo.style.display !== "none" && !modelo.classList.contains('visible')) {
                hint.textContent = "Tocá para entrar";
                hint.style.display = "block";
                intro.addEventListener('click', entrarASitio, { once: true });
            }
        }, 4000);
    }
}, 6000);

// Si el modelo tira error al cargar el archivo .glb, no dejamos a nadie trabado
modelo.addEventListener('error', () => {
    console.warn("El modelo 3D no pudo cargar, se habilita entrada directa.");
    hint.textContent = "Tocá para entrar";
    hint.style.display = "block";
    intro.addEventListener('click', entrarASitio, { once: true });
});

function entrarASitio() {
    if (yaEntro) return;
    yaEntro = true;

    modelo.classList.add('final');
    intro.style.opacity = '0';

    setTimeout(() => {
        intro.style.display = 'none';
        pagina.style.display = 'block';
    }, 600);
}

modelo.addEventListener('click', entrarASitio);


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

    const titulo = document.querySelector('.titulo a');
    const videos = document.querySelector('.videos a');
    if (titulo) envolverLetras(titulo);
    if (videos) envolverLetras(videos);

    setInterval(() => {
        document.querySelectorAll('.titulo a span, .videos span').forEach(span => {
            const fuenteRandom = fuentes[Math.floor(Math.random() * fuentes.length)];
            span.style.setProperty('font-family', fuenteRandom, 'important');
        });
    }, 700);
});