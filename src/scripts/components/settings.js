import "../../styles/components/settings.scss";

let defaultSettings = {
  sound: 50,
  theme: 1,
};

let soundLast;
let themeLast;

const themes = [
  {
    name: "Classic",
    background: "#ffffff",
    text: "#000000",
    border: "#808080",
    active: "#4a90e2",
    activeCell: "#d6e8ff",
    errorCell: "#ffd6d6",
    disabledCell: "#e8e8e8",
    link: "#0066cc",
    disabled: "#b5b5b5",
    font: "DM Sans",
    fontSize: "24px",
    buttonFontSize: "21px",
    eraserCursor: "eraser-classic.svg",
  },
  {
    name: "Dark",
    background: "#171717",
    text: "#f5f5f5",
    border: "#555555",
    active: "#ffffff",
    activeCell: "#3a3a3a",
    errorCell: "#5a2525",
    disabledCell: "#292929",
    link: "#66b3ff",
    disabled: "#4a4a4a",
    font: "Montserrat",
    fontSize: "24px",
    buttonFontSize: "21px",
    eraserCursor: "eraser-dark.svg",
  },
  {
    name: "Jedi",
    background: "#dce8d5",
    text: "#19351f",
    border: "#6b8f71",
    active: "#3f7048",
    activeCell: "#b8d4bc",
    errorCell: "#e8bcbc",
    disabledCell: "#b8c2b8",
    link: "#245f9e",
    disabled: "#aeb9ae",
    font: "Cinzel",
    fontSize: "22px",
    buttonFontSize: "18px",
    eraserCursor: "eraser-jedi.svg",
  },
  {
    name: "Sith",
    background: "#210d0d",
    text: "#ff4d4d",
    border: "#8f1d1d",
    active: "#ff0000",
    activeCell: "#4d1919",
    errorCell: "#7a2020",
    disabledCell: "#351919",
    link: "#ff8080",
    disabled: "#633838",
    font: "UnifrakturCook",
    fontSize: "25px",
    buttonFontSize: "20px",
    eraserCursor: "eraser-sith.svg",
  },
  {
    name: "Cyberpunk",
    background: "#120d24",
    text: "#f5eaff",
    border: "#d946ef",
    active: "#00ffff",
    activeCell: "#35244d",
    errorCell: "#542344",
    disabledCell: "#292038",
    link: "#ff70e7",
    disabled: "#51435a",
    font: "Orbitron",
    fontSize: "21px",
    buttonFontSize: "18px",
    eraserCursor: "eraser-cyberpunk.svg",
  },
  {
    name: "Galaxy",
    background: "#0b1026",
    text: "#e4e9ff",
    border: "#5969b8",
    active: "#8c7cff",
    activeCell: "#252d5c",
    errorCell: "#54253d",
    disabledCell: "#202642",
    link: "#8cb4ff",
    disabled: "#414865",
    font: "Audiowide",
    fontSize: "20px",
    buttonFontSize: "18px",
    eraserCursor: "eraser-galaxy.svg",
  },
  {
    name: "Vampire",
    background: "#1c0b10",
    text: "#f5d6d6",
    border: "#8f263d",
    active: "#ff1744",
    activeCell: "#4a1825",
    errorCell: "#702033",
    disabledCell: "#352027",
    link: "#ff8098",
    disabled: "#57333c",
    font: "Creepster",
    fontSize: "27px",
    buttonFontSize: "24px",
    eraserCursor: "eraser-vampire.svg",
  },
  {
    name: "Forest",
    background: "#102018",
    text: "#dcebdc",
    border: "#4f7959",
    active: "#8bc34a",
    activeCell: "#284a32",
    errorCell: "#702033",
    disabledCell: "#1d2d22",
    link: "#82b8ff",
    disabled: "#3d5142",
    font: "Alegreya",
    fontSize: "23px",
    buttonFontSize: "20px",
    eraserCursor: "eraser-forest.svg",
  },
  {
    name: "Pirate",
    background: "#21170d",
    text: "#f5d98a",
    border: "#9b7435",
    active: "#ffd700",
    activeCell: "#493716",
    errorCell: "#63302a",
    disabledCell: "#392e1c",
    link: "#6eb5ff",
    disabled: "#5a4b30",
    font: "Pirata One",
    fontSize: "24px",
    buttonFontSize: "20px",
    eraserCursor: "eraser-pirate.svg",
  },
  {
    name: "Retro Terminal",
    background: "#071007",
    text: "#39ff5a",
    border: "#1c8c2e",
    active: "#39ff14",
    activeCell: "#163b1c",
    errorCell: "#4d2020",
    disabledCell: "#142016",
    link: "#39d9ff",
    disabled: "#315a35",
    font: "VT323",
    fontSize: "30px",
    buttonFontSize: "24px",
    eraserCursor: "eraser-retro-terminal.svg",
  },
];

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

  const settingsControls = document.createElement("div");
  settingsControls.className = "settings-modal__controls";
  settingsModal.append(settingsControls);

  const saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.disabled = true;
  saveButton.className = "settings-modal__controls__save";
  settingsControls.append(saveButton);

  saveButton.addEventListener("click", () => {
    if (soundLast !== undefined) {
      settings.sound = soundLast;
    }
    if (themeLast !== undefined) {
      settings.theme = themeLast;
    }
    saveSettings();
    applyTheme();
    closeSettings();
  });

  settingsContainer.append(createSoundSettingsPanel(saveButton));
  settingsContainer.append(createThemeSettingsPanel(saveButton));

  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.className = "settings-modal__controls__cancel";
  settingsControls.append(cancelButton);

  cancelButton.addEventListener("click", () => {
    closeSettings();
  });

  return overlay;
}

function createSoundSettingsPanel(saveButton) {
  const soundSettingsContainer = document.createElement("div");
  soundSettingsContainer.className = "settings-modal__settings__sound";

  const soundSettingsTitle = document.createElement("label");
  soundSettingsTitle.textContent = "Sound";
  soundSettingsTitle.className = "settings-modal__settings__sound__title";
  soundSettingsContainer.append(soundSettingsTitle);

  let lastVolume = settings["sound"];

  const volumeControlContainer = document.createElement("div");
  volumeControlContainer.className =
    "settings-modal__settings__sound__volume-control";
  soundSettingsContainer.append(volumeControlContainer);

  const volumeRange = document.createElement("input");
  volumeRange.className =
    "settings-modal__settings__sound__volume-control__range";
  volumeRange.type = "range";
  volumeRange.min = "0";
  volumeRange.max = "";
  volumeRange.value = lastVolume;

  const volumeLabel = document.createElement("label");
  volumeLabel.className =
    "settings-modal__settings__sound__volume-control__value";
  volumeLabel.textContent = volumeRange.value;

  volumeControlContainer.append(volumeRange, volumeLabel);

  volumeRange.addEventListener("input", () => {
    volumeLabel.textContent = volumeRange.value;
    soundLast = volumeRange.value;
    saveButton.disabled = false;
  });

  return soundSettingsContainer;
}

function createThemeSettingsPanel(saveButton) {
  const themeSettingsContainer = document.createElement("div");
  themeSettingsContainer.className = "settings-modal__settings__theme";

  const themeSettingsTitle = document.createElement("label");
  themeSettingsTitle.textContent = "Theme";
  themeSettingsTitle.className = "settings-modal__settings__theme__title";
  themeSettingsContainer.append(themeSettingsTitle);

  const themesContainer = document.createElement("div");
  themesContainer.className = "settings-modal__settings__theme__container";
  themeSettingsContainer.append(themesContainer);

  themes.forEach((theme, index) => {
    const themeInput = document.createElement("input");
    themeInput.className = "settings-modal__settings__theme__container__input";
    themeInput.type = "radio";
    themeInput.name = "theme";
    themeInput.value = theme.name;
    themeInput.id = `theme-${theme.name.toLowerCase().replaceAll(" ", "-")}`;
    if (index === settings.theme) {
      themeInput.checked = true;
    }

    const themeOption = document.createElement("label");
    themeOption.htmlFor = themeInput.id;
    themeOption.textContent = theme.name;
    themeOption.className =
      "settings-modal__settings__theme__container__option";

    themeOption.style.backgroundColor = theme.background;
    themeOption.style.color = theme.text;
    themeOption.style.fontFamily = `"${theme.font}", sans-serif`;
    themeOption.style.fontSize = theme.fontSize;
    themeOption.style.border = `3px solid ${theme.border}`;
    themeOption.style.setProperty("--theme-active", theme.active);

    themesContainer.append(themeInput, themeOption);

    themeInput.addEventListener("input", () => {
      saveButton.disabled = false;
      themeLast = index;
    });
  });

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

function applyTheme() {
  if (!settings.theme || settings.theme >= themes.length) {
    settings.theme = 0;
    saveSettings();
  }
  const theme = themes[settings.theme];

  document.documentElement.style.setProperty(
    "--theme-background",
    theme.background,
  );
  document.documentElement.style.setProperty("--theme-text", theme.text);
  document.documentElement.style.setProperty("--theme-border", theme.border);
  document.documentElement.style.setProperty("--theme-active", theme.active);
  document.documentElement.style.setProperty(
    "--theme-font",
    `"${theme.font}", sans-serif`,
  );
  document.documentElement.style.setProperty(
    "--theme-font-size",
    theme.fontSize,
  );
  document.documentElement.style.setProperty(
    "--theme-button-font-size",
    theme.buttonFontSize,
  );
  document.documentElement.style.setProperty("--theme-link", theme.link);
  document.documentElement.style.setProperty(
    "--theme-disabled",
    theme.disabled,
  );
  document.documentElement.style.setProperty(
    "--theme-active-cell",
    theme.activeCell,
  );
  document.documentElement.style.setProperty(
    "--theme-error-cell",
    theme.errorCell,
  );
  document.documentElement.style.setProperty(
    "--theme-disabled-cell",
    theme.disabledCell,
  );
  document.documentElement.style.setProperty(
    "--eraser-cursor",
    `url("${theme.eraserCursor}")`,
  );
}

function saveSettings() {
  localStorage.setItem("settings", JSON.stringify(settings));
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

export { openSettings, closeSettings, loadSettings, applyTheme };
