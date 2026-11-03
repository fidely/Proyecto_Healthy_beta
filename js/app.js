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

const calendarGrid = document.getElementById("calendar-grid");
const calendarMonthTitle = document.getElementById("calendar-month-title");
if (calendarGrid && calendarMonthTitle) {
  const previousMonthButton = document.getElementById(
    "calendar-prev-month-btn",
  );
  const nextMonthButton = document.getElementById("calendar-next-month-btn");
  const todayButton = document.getElementById("calendar-today-btn");
  const selectedDateLabel = document.getElementById("calendar-selected-date");
  const monthFormatter = new Intl.DateTimeFormat("es", { month: "long" });
  const fullDateFormatter = new Intl.DateTimeFormat("es", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  let today = getLocalDate();
  let selectedDate = new Date(today);
  let visibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  function getLocalDate(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function isSameDate(firstDate, secondDate) {
    return firstDate.getTime() === secondDate.getTime();
  }

  function renderCalendar() {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const monthName = monthFormatter.format(visibleMonth);
    calendarMonthTitle.textContent = `${monthName[0].toLocaleUpperCase("es")}${monthName.slice(1)} ${year}`;
    if (selectedDateLabel) {
      selectedDateLabel.textContent = `Fecha seleccionada: ${fullDateFormatter.format(selectedDate)}`;
    }

    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
    const firstVisibleDate = new Date(year, month, 1 - firstWeekday);
    calendarGrid.replaceChildren();

    for (let dayOffset = 0; dayOffset < 42; dayOffset += 1) {
      const date = new Date(
        firstVisibleDate.getFullYear(),
        firstVisibleDate.getMonth(),
        firstVisibleDate.getDate() + dayOffset,
      );
      const isCurrentMonth = date.getMonth() === month;
      const isToday = isSameDate(date, today);
      const isSelected = isSameDate(date, selectedDate);
      const dayButton = document.createElement("button");
      dayButton.type = "button";
      dayButton.className =
        "h-20 sm:h-24 p-2 rounded flex flex-col items-start justify-between text-left transition-colors " +
        (isCurrentMonth
          ? "bg-surface-container-low text-on-surface hover:bg-surface-container"
          : "bg-surface/50 text-outline opacity-50 hover:opacity-80");
      if (isToday) {
        dayButton.classList.add("bg-primary-fixed", "font-bold");
      }
      if (isSelected) {
        dayButton.classList.add("ring-2", "ring-primary");
      }
      dayButton.setAttribute("aria-label", fullDateFormatter.format(date));
      dayButton.setAttribute("aria-pressed", String(isSelected));

      const dayNumber = document.createElement("span");
      dayNumber.className = "font-label-sm text-label-sm font-semibold";
      dayNumber.textContent = String(date.getDate());
      dayButton.append(dayNumber);
      dayButton.addEventListener("click", () => {
        selectedDate = date;
        if (!isCurrentMonth) {
          visibleMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        }
        renderCalendar();
      });
      calendarGrid.append(dayButton);
    }
  }

  previousMonthButton?.addEventListener("click", () => {
    visibleMonth = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth() - 1,
      1,
    );
    renderCalendar();
  });
  nextMonthButton?.addEventListener("click", () => {
    visibleMonth = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth() + 1,
      1,
    );
    renderCalendar();
  });
  todayButton?.addEventListener("click", () => {
    today = getLocalDate();
    selectedDate = new Date(today);
    visibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    renderCalendar();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") return;
    const currentLocalDate = getLocalDate();
    if (isSameDate(currentLocalDate, today)) return;

    const wasViewingCurrentMonth =
      visibleMonth.getFullYear() === today.getFullYear() &&
      visibleMonth.getMonth() === today.getMonth();
    const wasSelectedToday = isSameDate(selectedDate, today);
    today = currentLocalDate;
    if (wasSelectedToday) selectedDate = new Date(today);
    if (wasViewingCurrentMonth) {
      visibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    }
    renderCalendar();
  });

  renderCalendar();
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