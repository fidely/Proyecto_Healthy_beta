const registerTab = document.getElementById("register-tab");
const loginTab = document.getElementById("login-tab");
const registerPanel = document.getElementById("register-panel");
const loginPanel = document.getElementById("login-panel");
const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");
const authStatus = document.getElementById("auth-status");

function setAuthMode(mode) {
  const isRegisterMode = mode === "registro";
  registerTab.setAttribute("aria-selected", String(isRegisterMode));
  loginTab.setAttribute("aria-selected", String(!isRegisterMode));
  registerTab.tabIndex = isRegisterMode ? 0 : -1;
  loginTab.tabIndex = isRegisterMode ? -1 : 0;
  registerPanel.hidden = !isRegisterMode;
  loginPanel.hidden = isRegisterMode;
  authStatus.hidden = true;
}

registerTab.addEventListener("click", () => setAuthMode("registro"));
loginTab.addEventListener("click", () => setAuthMode("ingreso"));

const requestedMode = new URLSearchParams(window.location.search).get("modo");
setAuthMode(requestedMode === "ingreso" ? "ingreso" : "registro");

const registerPassword = document.getElementById("register-password");
const confirmationPassword = document.getElementById(
  "register-confirm-password",
);

function validatePasswordConfirmation() {
  confirmationPassword.setCustomValidity(
    confirmationPassword.value &&
      confirmationPassword.value !== registerPassword.value
      ? "Las contraseñas no coinciden."
      : "",
  );
}

registerPassword.addEventListener("input", validatePasswordConfirmation);
confirmationPassword.addEventListener("input", validatePasswordConfirmation);

function showBackendNotice(event) {
  event.preventDefault();
  authStatus.textContent =
    "El formulario está validado, pero falta conectar un servicio de autenticación para crear o verificar cuentas.";
  authStatus.hidden = false;
}

const avatarInput = document.getElementById("register-avatar");
const avatarPreview = document.getElementById("register-avatar-preview");

async function createAvatarDataUrl(file) {
  const imageUrl = URL.createObjectURL(file);

  try {
    const image = new Image();
    image.src = imageUrl;
    await image.decode();

    const maxDimension = 512;
    const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(image.width * scale);
    canvas.height = Math.round(image.height * scale);
    canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.82);
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

if (avatarInput && avatarPreview) {
  avatarInput.addEventListener("change", async () => {
    const file = avatarInput.files[0];
    if (!file) return;

    try {
      avatarPreview.src = await createAvatarDataUrl(file);
    } catch {
      avatarInput.value = "";
      authStatus.textContent = "No se pudo cargar esa imagen. Prueba con otro archivo.";
      authStatus.hidden = false;
    }
  });
}

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const displayName = document.getElementById("register-alias").value.trim();
  const avatarFile = avatarInput?.files[0];

  try {
    window.localStorage.setItem("healthyUserName", displayName);
    if (avatarFile) {
      window.localStorage.setItem(
        "healthyUserAvatar",
        await createAvatarDataUrl(avatarFile),
      );
    } else {
      window.localStorage.removeItem("healthyUserAvatar");
    }
    authStatus.textContent = `Perfil local guardado como ${displayName}. La foto queda guardada en este dispositivo; falta conectar un servicio de autenticación para crear una cuenta real.`;
  } catch {
    authStatus.textContent =
      "No se pudo guardar el perfil en este navegador. La autenticación real requiere conectar un servicio.";
  }
  authStatus.hidden = false;
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const emailName = document
    .getElementById("login-email")
    .value.split("@")[0]
    .trim();
  const displayName = emailName
    ? emailName.charAt(0).toLocaleUpperCase("es") + emailName.slice(1)
    : "Invitado";

  try {
    window.localStorage.setItem("healthyUserName", displayName);
    authStatus.textContent = `Nombre guardado localmente como ${displayName}. El acceso todavía no verifica cuentas; falta conectar un servicio de autenticación.`;
  } catch {
    authStatus.textContent =
      "No se pudo guardar el nombre en este navegador. El acceso todavía no verifica cuentas.";
  }
  authStatus.hidden = false;
});