'use strict';

const firebaseConfig = {
  apiKey: "AIzaSyDdTyyWQYWMA3VJCNFJiNtdAYC7Rc9gI9k",
  authDomain: "portal-aiche.firebaseapp.com",
  databaseURL: "https://portal-aiche-default-rtdb.firebaseio.com",
  projectId: "portal-aiche",
  storageBucket: "portal-aiche.firebasestorage.app",
  messagingSenderId: "153207665579",
  appId: "1:153207665579:web:b76bdf9ed2c6ff500918ee"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-contacto');
    const datosFormulario = document.getElementById('datos-formulario');
    const datosLista = document.getElementById('datos-lista');
    const btnOpenPopup = document.getElementById('btn-open-login');
    const btnLogin = document.getElementById('btn-login');
    const btnLogout = document.getElementById('btn-logout');
    const loginStatus = document.getElementById('login-status');

    // Función para actualizar la interfaz según el usuario
    function actualizarUI(usuario) {
        if (usuario) {
            loginStatus.textContent = `Ingresado como ${usuario.rol}: ${usuario.nombre.split(' ')[0]} ${usuario.nombre.split(' ')[1]}`;
            loginStatus.classList.remove('hidden');
            btnOpenPopup.classList.add('hidden');
            btnLogout.classList.remove('hidden');
        } else {
            loginStatus.textContent = '';
            loginStatus.classList.add('hidden');
            btnOpenPopup.classList.remove('hidden');
            btnLogout.classList.add('hidden');
        }
    }

    // Validar si hay sesión guardada
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
        const data = JSON.parse(usuarioGuardado);
        actualizarUI(data);
    }

    // Mostrar popup login
    if (btnOpenPopup) {
        btnOpenPopup.addEventListener('click', () => {
            document.getElementById('popup-login').classList.remove('hidden');
        });
    }

    // Cerrar sesión
    btnLogout.addEventListener('click', () => {
        localStorage.removeItem('usuario');
        actualizarUI(null);
    });

    // Validar matrícula en Firebase
    btnLogin.addEventListener('click', async () => {
        const matricula = document.getElementById('input-matricula').value.trim();
        const errorText = document.getElementById('login-error');

        if (!matricula) {
            errorText.textContent = "Por favor ingresa una matrícula.";
            errorText.classList.remove('hidden');
            return;
        }

        try {
            const snapshot = await get(ref(database, `Aiche/miembros/${matricula}`));
            if (snapshot.exists()) {
                const data = snapshot.val();
                localStorage.setItem('usuario', JSON.stringify(data));
                document.getElementById('popup-login').classList.add('hidden');
                actualizarUI(data);
            } else {
                errorText.textContent = "Matrícula no registrada.";
                errorText.classList.remove('hidden');
            }
        } catch (error) {
            console.error("Firebase error:", error);
            errorText.textContent = "Error al conectar con la base de datos.";
            errorText.classList.remove('hidden');
        }
    });

    // Enviar formulario de contacto ficticio
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = this.email.value;
            const motivo = this.motivo.value;

            fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, motivo })
            })
            .then(response => response.json())
            .then(data => {
                datosLista.innerHTML = `
                    <li><strong>Email:</strong> ${email}</li>
                    <li><strong>Motivo:</strong> ${motivo}</li>
                    <li><strong>Respuesta POST (id):</strong> ${data.id}</li>
                `;
                datosFormulario.classList.remove('hidden');
                form.reset();
            })
            .catch(() => {
                datosLista.innerHTML = `<li>Error al enviar los datos.</li>`;
                datosFormulario.classList.remove('hidden');
            });
        });
    }
});