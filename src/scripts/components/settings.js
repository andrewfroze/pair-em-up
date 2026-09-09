import "../../styles/components/settings.scss";

let isSettingsChanged = false;

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
