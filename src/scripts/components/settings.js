import "../../styles/components/settings.scss";

let defaultSettings = {
  sound: 50,
  theme: 1,
};

const themes = [
  {
    name: "Classic",
    background: "#ffffff",
    text: "#000000",
    border: "#808080",
    font: "DM Sans",
  },
  {
    name: "Dark",
    background: "#171717",
    text: "#f5f5f5",
    border: "#555555",
    font: "Montserrat",
  },
  {
    name: "Jedi",
    background: "#dce8d5",
    text: "#19351f",
    border: "#6b8f71",
    font: "Cinzel",
  },
  {
    name: "Sith",
    background: "#210d0d",
    text: "#ff4d4d",
    border: "#8f1d1d",
    font: "UnifrakturCook",
  },
  {
    name: "Cyberpunk",
    background: "#120d24",
    text: "#f5eaff",
    border: "#d946ef",
    font: "Orbitron",
  },
  {
    name: "Galaxy",
    background: "#0b1026",
    text: "#e4e9ff",
    border: "#5969b8",
    font: "Audiowide",
  },
  {
    name: "Vampire",
    background: "#1c0b10",
    text: "#f5d6d6",
    border: "#8f263d",
    font: "Creepster",
  },
  {
    name: "Forest",
    background: "#102018",
    text: "#dcebdc",
    border: "#4f7959",
    font: "Alegreya",
  },
  {
    name: "Pirate",
    background: "#21170d",
    text: "#f5d98a",
    border: "#9b7435",
    font: "Pirata One",
  },
  {
    name: "Retro Terminal",
    background: "#071007",
    text: "#39ff5a",
    border: "#1c8c2e",
    font: "VT323",
  },
];

let isSettingsChanged = false;
let settings;

function createSettingsModal() {
  const overlay = document.createElement("div");
  overlay.className = "overlay";

  const settingsModal = document.createElement("div");
  settingsModal.className = "settings-modal";
  overlay.append(settingsModal);

  const settingsModalTitle = document.createElement("h2");
  settingsModalTitle.className = "settings-modal__title";
  settingsModalTitle.textContent = "Settings";
  settingsModal.append(settingsModalTitle);

  const settingsContainer = document.createElement("div");
  settingsContainer.className = "settings-modal__settings";
  settingsModal.append(settingsContainer);

  loadSettings();
  settingsContainer.append(createSoundSettingsPanel());
  settingsContainer.append(createThemeSettingsPanel());

  const settingsControls = document.createElement("div");
  settingsControls.className = "settings-modal__controls";
  settingsModal.append(settingsControls);

  const saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.disabled = !isSettingsChanged;
  saveButton.className = "settings-modal__controls__save";
  settingsControls.append(saveButton);

  saveButton.addEventListener("click", () => {
    console.log("save settings");
    // todo add saving of settings
    closeSettings();
  });

  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.className = "settings-modal__controls__cancel";
  settingsControls.append(cancelButton);

  cancelButton.addEventListener("click", () => {
    closeSettings();
  });

  return overlay;
}

function createSoundSettingsPanel() {
  const soundSettingsContainer = document.createElement("div");
  soundSettingsContainer.className = "settings-modal__settings__sound";

  const soundSettingsTitle = document.createElement("label");
  soundSettingsTitle.textContent = "Sound";
  soundSettingsContainer.className = "settings-modal__settings__sound__title";
  soundSettingsContainer.append(soundSettingsTitle);

  let lastVolume = settings["sound"];

  const volumeRange = document.createElement("input");
  volumeRange.className = "settings-modal__settings__sound__range";
  volumeRange.type = "range";
  volumeRange.min = "0";
  volumeRange.max = "";
  volumeRange.value = lastVolume;

  const volumeLabel = document.createElement("label");
  volumeLabel.className = "settings-modal__settings__sound__value";
  volumeLabel.textContent = volumeRange.value;

  soundSettingsContainer.append(volumeRange, volumeLabel);

  volumeRange.addEventListener("input", () => {
    volumeLabel.textContent = volumeRange.value;
  });

  return soundSettingsContainer;
}

function createThemeSettingsPanel() {
  const themeSettingsContainer = document.createElement("div");
  themeSettingsContainer.className = "settings-modal__settings__theme";

  const themeSettingsTitle = document.createElement("label");
  themeSettingsTitle.textContent = "Theme";
  themeSettingsTitle.className = "settings-modal__settings__theme__title";
  themeSettingsContainer.append(themeSettingsTitle);

  const themesContainer = document.createElement("div");
  themesContainer.className = "settings-modal__settings__theme__container";
  themeSettingsContainer.append(themesContainer);

  for (const theme of themes) {
    const themeOption = document.createElement("label");
    themeOption.textContent = theme.name;
    themeOption.className =
      "settings-modal__settings__theme__container__option";
    themeOption.style.backgroundColor = theme.background;
    themeOption.style.color = theme.text;
    themeOption.style.fontFamily = `"${theme.font}", sans-serif`;
    themeOption.style.border = `2px solid ${theme.border}`;

    themesContainer.append(themeOption);
  }

  return themeSettingsContainer;
}

function loadSettings() {
  const savedSettings = localStorage.getItem("settings");
  if (savedSettings) {
    settings = JSON.parse(savedSettings);
  } else {
    saveDefaultSettings();
  }
}

function saveDefaultSettings() {
  settings = defaultSettings;
  localStorage.setItem("settings", JSON.stringify(defaultSettings));
}

let settingsModal;

function openSettings() {
  settingsModal = createSettingsModal();
  document.body.append(settingsModal);
}

function closeSettings() {
  if (settingsModal) {
    settingsModal.remove();
    settingsModal = undefined;
  }
}

export { openSettings, closeSettings };
