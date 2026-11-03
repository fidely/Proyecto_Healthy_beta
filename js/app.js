let currentUserName = null;
try {
  currentUserName = window.localStorage.getItem("healthyUserName");
} catch {
  currentUserName = null;
}
document.querySelectorAll("[data-user-name]").forEach((element) => {
  element.textContent = currentUserName || "Invitado";
});

document.querySelectorAll("[data-logout]").forEach((button) => {
  button.hidden = !currentUserName;
  button.addEventListener("click", () => {
    try {
      window.localStorage.removeItem("healthyUserName");
      window.localStorage.removeItem("healthyUserAvatar");
    } catch {
      // Continue to the access screen even if local storage is unavailable.
    }
    window.location.href = "registro.html?modo=ingreso";
  });
});

let currentUserAvatar = null;
try {
  currentUserAvatar = window.localStorage.getItem("healthyUserAvatar");
} catch {
  currentUserAvatar = null;
}
if (currentUserAvatar?.startsWith("data:image")) {
  document.querySelectorAll("[data-user-avatar]").forEach((image) => {
    image.src = currentUserAvatar;
    image.alt = "Foto de perfil";
  });
}

document.querySelectorAll(".filter-chip").forEach((button) => {
  button.addEventListener("click", function () {
    const isSelected = this.getAttribute("aria-pressed") === "true";
    document.querySelectorAll(".filter-chip").forEach((chip) => {
      chip.setAttribute("aria-pressed", "false");
      chip.classList.remove("ring-2", "ring-primary");
    });
    if (!isSelected) {
      this.setAttribute("aria-pressed", "true");
      this.classList.add("ring-2", "ring-primary");
      const searchInput = document.getElementById("library-search");
      if (searchInput) {
        searchInput.value = this.innerText.trim();
        searchInput.focus();
      }
    }
  });
});

window.triggerAssistantSearch = function () {
  const searchInput = document.getElementById("library-search");
  const searchValue = searchInput ? searchInput.value : "";
  const assistantButton = document.querySelector("aside button");
  if (assistantButton) {
    assistantButton.classList.add("scale-105");
    setTimeout(() => assistantButton.classList.remove("scale-105"), 300);
    assistantButton.click();
  }
  return searchValue;
};

const assistantSearchButton = document.getElementById("assistant-search-btn");
if (assistantSearchButton) {
  assistantSearchButton.addEventListener("click", window.triggerAssistantSearch);
}

const reportOptionsButton = document.getElementById("report-options-btn");
if (reportOptionsButton) {
  reportOptionsButton.addEventListener("click", () => {
    document
      .getElementById("report-modal-box")
      ?.scrollIntoView({ behavior: "smooth" });
  });
}

const reportForm = document.getElementById("report-form");
if (reportForm) {
  reportForm.addEventListener("submit", (event) => {
    event.preventDefault();
    document.getElementById("report-status-msg")?.classList.remove("hidden");
  });
}

const reminderModal = document.getElementById("reminder-modal");
if (reminderModal) {
  const openReminderButtons = [
    document.getElementById("open-reminder-modal-btn"),
    document.getElementById("open-reminder-modal-top"),
  ];
  const closeReminderButtons = [
    document.getElementById("close-reminder-modal-btn"),
    document.getElementById("cancel-reminder-btn"),
  ];

  function openReminderModal() {
    reminderModal.classList.remove(
      "hidden",
      "opacity-0",
      "pointer-events-none",
    );
    reminderModal.classList.add("flex", "opacity-100");
    const content = reminderModal.querySelector("div");
    if (content) {
      content.classList.remove("scale-95");
      content.classList.add("scale-100");
    }
  }

  function closeReminderModal() {
    reminderModal.classList.add("opacity-0", "pointer-events-none");
    const content = reminderModal.querySelector("div");
    if (content) {
      content.classList.add("scale-95");
      content.classList.remove("scale-100");
    }
    setTimeout(() => {
      reminderModal.classList.add("hidden");
      reminderModal.classList.remove("flex");
    }, 150);
  }

  openReminderButtons.forEach((button) => {
    if (button) button.addEventListener("click", openReminderModal);
  });
  closeReminderButtons.forEach((button) => {
    if (button) button.addEventListener("click", closeReminderModal);
  });
  reminderModal.addEventListener("click", (event) => {
    if (event.target === reminderModal) closeReminderModal();
  });

  const reminderForm = document.getElementById("reminder-form");
  if (reminderForm) {
    reminderForm.addEventListener("submit", (event) => {
      event.preventDefault();
      alert(
        "✓ Recordatorio discreto guardado. Recibirás tu aviso bajo el alias seleccionado sin revelar datos de salud.",
      );
      closeReminderModal();
    });
  }
}

const moodButtons = document.querySelectorAll(".mood-btn");
moodButtons.forEach((button) => {
  button.addEventListener("click", () => {
    moodButtons.forEach((moodButton) => {
      moodButton.classList.remove(
        "bg-primary-container",
        "text-on-primary-container",
      );
      moodButton.classList.add("bg-surface-container-low", "text-on-surface");
    });
    button.classList.remove("bg-surface-container-low", "text-on-surface");
    button.classList.add("bg-primary-container", "text-on-primary-container");
  });
});

document.querySelectorAll(".toggle-pill").forEach((pill) => {
  pill.addEventListener("click", () => {
    const isActive = pill.classList.contains("bg-secondary-container");
    if (isActive) {
      pill.classList.remove(
        "bg-secondary-container",
        "text-on-secondary-container",
      );
      pill.classList.add("bg-surface-container-low", "text-on-surface");
    } else {
      pill.classList.remove("bg-surface-container-low", "text-on-surface");
      pill.classList.add(
        "bg-secondary-container",
        "text-on-secondary-container",
      );
    }
  });
});

const saveLogButton = document.getElementById("save-log-btn");
if (saveLogButton) {
  saveLogButton.addEventListener("click", () => {
    const previousHtml = saveLogButton.innerHTML;
    saveLogButton.innerHTML =
      '<span class="material-symbols-outlined text-[18px]">check</span><span>¡Guardado con éxito!</span>';
    saveLogButton.classList.remove("bg-primary");
    saveLogButton.classList.add("bg-secondary", "text-on-secondary");
    setTimeout(() => {
      saveLogButton.innerHTML = previousHtml;
      saveLogButton.classList.remove("bg-secondary", "text-on-secondary");
      saveLogButton.classList.add("bg-primary");
    }, 2200);
  });
}

const chatInput = document.querySelector('input[type="text"]');
document.querySelectorAll(".bot-prompt").forEach((prompt) => {
  prompt.addEventListener("click", () => {
    const promptText = prompt.querySelector("span")?.innerText;
    if (chatInput && promptText) {
      chatInput.value = promptText;
      chatInput.focus();
    }
  });
});

if (document.documentElement.dataset.quickEscape === "true") {
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") window.location.href = "https://www.google.com";
  });
}