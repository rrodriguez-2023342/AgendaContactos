// Cuando la pagina termine de cargar
document.addEventListener("DOMContentLoaded", () => {

    // Obtener el formulario de login
    const formulario = document.querySelector("form");

    // Verificamos si existe el formulario
    if (formulario) {

        // Escuchamos cuando el usuario presiona el botón de enviar
        formulario.addEventListener("submit", (e) => {

            // Evita que la pagina se recargue
            e.preventDefault();

            // Obtenemos lo que el usuario escribio en los inputs
            const usuario = document.getElementById("usuario").value;
            const contraseña = document.getElementById("Contraseña").value;

            // Guardamos los datos en el navegador (localStorage)
            localStorage.setItem("usuario", usuario);
            localStorage.setItem("contraseña", contraseña);
            localStorage.setItem("rol", "Administrador");

            // Nos muestra la pagina de Contactos
            window.location.href = "/html/contactos.html";
        });
    }

    // Perfil

    // Obtenemos los elementos del perfil donde se muestra la informacion
    const usuarioPerfil = document.getElementById("perfil-usuario");
    const contraseñaPerfil = document.getElementById("perfil-contraseña");
    const rolPerfil = document.getElementById("perfil-rol");
    const nombrePerfil = document.getElementById("perfil-nombre");

    // Verificamos que estemos en la página del perfil
    if (usuarioPerfil && contraseñaPerfil) {

        // Mostramos la informacion guardada en localStorage
        usuarioPerfil.textContent = localStorage.getItem("usuario") || "No definido";
        contraseñaPerfil.textContent = localStorage.getItem("contraseña") || "No definido";
        rolPerfil.textContent = localStorage.getItem("rol") || "Usuario";

        // Usamos el usuario tambien como nombre
        nombrePerfil.textContent = localStorage.getItem("usuario") || "Usuario";
    }
});

// CERRAR SESION

// Se ejecuta cuando el usuario presiona "Cerrar Sesión"
function login() {

    // Borra todos los datos guardados
    localStorage.clear();

    // Regresa a la pagina de inicio de sesión
    window.location.href = "/index.html";
}
