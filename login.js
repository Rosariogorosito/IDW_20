const ADMIN_USER = {
  email: "admin@clinica.com",
  password: "1234"
};

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const alerta = document.getElementById("alerta");

  if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
    localStorage.setItem("usuarioActivo", JSON.stringify(ADMIN_USER));

    window.location.href = "admin.html";
  } else {
    alerta.textContent = "Correo o contraseña incorrectos";
    alerta.classList.remove("d-none");
  }
});
