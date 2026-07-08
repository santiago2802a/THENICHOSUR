
const firebaseConfig = {
    apiKey: "AIzaSyCZczQoqch539kY2sNrrJYG7Yc0RsRCbfc",
    authDomain: "nichosur-foro.firebaseapp.com",
    databaseURL: "https://nichosur-foro-default-rtdb.firebaseio.com",
    projectId: "nichosur-foro",
    storageBucket: "nichosur-foro.firebasestorage.app",
    messagingSenderId: "563560932208",
    appId: "1:563560932208:web:5543588eb7080f332ee5b5"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();


function usuarioAEmail(usuario) {
    return usuario.trim().toLowerCase().replace(/\s+/g, "") + "@nichosur.local";
}

let salaActual = "general";
let usuarioActual = null;
let listenerMensajes = null;


function registrarse() {
    const usuario = document.getElementById("reg-user").value.trim();
    const pass = document.getElementById("reg-pass").value;
    const errorEl = document.getElementById("register-error");
    errorEl.textContent = "";

    if (usuario.length < 3) {
        errorEl.textContent = "El usuario debe tener al menos 3 caracteres.";
        return;
    }
    if (pass.length < 6) {
        errorEl.textContent = "La contraseña debe tener al menos 6 caracteres.";
        return;
    }

    const email = usuarioAEmail(usuario);

    auth.createUserWithEmailAndPassword(email, pass)
        .then((cred) => {
            return db.ref("usuarios/" + cred.user.uid).set({ nombre: usuario });
        })
        .catch((err) => {
            if (err.code === "auth/email-already-in-use") {
                errorEl.textContent = "Ese usuario ya existe.";
            } else {
                errorEl.textContent = "Error: " + err.message;
            }
        });
}


function iniciarSesion() {
    const usuario = document.getElementById("login-user").value.trim();
    const pass = document.getElementById("login-pass").value;
    const errorEl = document.getElementById("login-error");
    errorEl.textContent = "";

    const email = usuarioAEmail(usuario);

    auth.signInWithEmailAndPassword(email, pass)
        .catch((err) => {
            errorEl.textContent = "Usuario o contraseña incorrectos.";
        });
}


function cerrarSesion() {
    auth.signOut();
}


auth.onAuthStateChanged((user) => {
    if (user) {
        db.ref("usuarios/" + user.uid).once("value").then((snap) => {
            const datos = snap.val();
            usuarioActual = datos ? datos.nombre : user.email.split("@")[0];
            document.getElementById("nombre-usuario").textContent = usuarioActual;
            document.getElementById("auth-container").style.display = "none";
            document.getElementById("chat-container").style.display = "flex";
            cambiarSala("general");
        });
    } else {
        usuarioActual = null;
        document.getElementById("auth-container").style.display = "flex";
        document.getElementById("chat-container").style.display = "none";
        mostrarLogin();
    }
});


function mostrarRegistro() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("register-form").style.display = "block";
}

function mostrarLogin() {
    document.getElementById("register-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
}


function cambiarSala(sala) {
    salaActual = sala;

    document.querySelectorAll(".sala-btn").forEach(btn => {
        btn.classList.toggle("activo", btn.dataset.sala === sala);
    });

    const nombresSalas = { general: "General", sala2: "Sala 2", sala3: "Sala 3" };
    document.getElementById("titulo-sala").textContent = nombresSalas[sala];

    if (listenerMensajes) {
        listenerMensajes.off();
    }

    const mensajesEl = document.getElementById("mensajes");
    mensajesEl.innerHTML = "";

    listenerMensajes = db.ref("salas/" + sala + "/mensajes").limitToLast(100);
    listenerMensajes.on("child_added", (snap) => {
        const msg = snap.val();
        mostrarMensaje(msg);
    });
}

function mostrarMensaje(msg) {
    const mensajesEl = document.getElementById("mensajes");
    const div = document.createElement("div");
    div.className = "mensaje";

    const hora = new Date(msg.timestamp).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });

    div.innerHTML = `
        <div class="autor">${escapeHTML(msg.autor)}</div>
        <div class="texto">${escapeHTML(msg.texto)}</div>
        <div class="hora">${hora}</div>
    `;

    mensajesEl.appendChild(div);
    mensajesEl.scrollTop = mensajesEl.scrollHeight;
}


function enviarMensaje() {
    const input = document.getElementById("input-texto");
    const texto = input.value.trim();
    if (!texto || !usuarioActual) return;

    db.ref("salas/" + salaActual + "/mensajes").push({
        autor: usuarioActual,
        texto: texto,
        timestamp: Date.now()
    });

    input.value = "";
}

function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}
