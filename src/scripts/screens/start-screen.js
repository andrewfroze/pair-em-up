import "../../styles/start-screen.scss";
import { openSettings } from "../components/settings";
import { openScores } from "../components/scores";

const PLAYER_NAME_MIN_LENGTH = 3;
const PLAYER_NAME_INPUT_DELAY = 300;
const gameMods = [
  {
    type: "classic",
  },
  {
    type: "random",
  },
  {
    type: "chaotic",
  },
];

let activeGameMod = gameMods[0].type;
let activeGameModLabel;

function createStartScreen({ onNewGame, onContinue }) {
  const startScreenContainer = document.createElement("div");
  startScreenContainer.className = "start-screen";

  const gameTitle = document.createElement("h1");
  gameTitle.className = "start-screen__game-title";
  gameTitle.textContent = "Pair 'em Up";
  startScreenContainer.append(gameTitle);

  const gameMenu = document.createElement("section");
  gameMenu.className = "start-screen__game-menu";
  startScreenContainer.append(gameMenu);

  const playerNameContainer = document.createElement("div");
  playerNameContainer.className = "start-screen__game-menu__player-name";

  const playerNameInput = document.createElement("input");
  playerNameInput.className = "start-screen__game-menu__player-name__input";
  playerNameInput.type = "text";
  playerNameInput.placeholder = "Enter your nickname";
  playerNameInput.maxLength = 20;

  const confirmPlayerNameButton = document.createElement("button");
  confirmPlayerNameButton.className =
    "start-screen__game-menu__player-name__confirm";
  confirmPlayerNameButton.textContent = "✓";
  confirmPlayerNameButton.title = "Confirm nickname";

  const editPlayerNameButton = document.createElement("button");
  editPlayerNameButton.className = "start-screen__game-menu__player-name__edit";
  editPlayerNameButton.textContent = "✎";
  editPlayerNameButton.title = "Edit nickname";

  editPlayerNameButton.addEventListener("click", () => {
    playerNameConfirmed = false;

    playerNameInput.disabled = false;
    playerNameInput.focus();

    updatePlayerNameState();
  });

  playerNameContainer.append(
    playerNameInput,
    confirmPlayerNameButton,
    editPlayerNameButton,
  );

  gameMenu.append(playerNameContainer);

  const gameModsButtonsContainer = document.createElement("section");
  gameModsButtonsContainer.className = "start-screen__game-menu__game-mods";
  gameMenu.append(gameModsButtonsContainer);

  const gameModIndicator = document.createElement("div");
  gameModIndicator.className = "start-screen__game-menu__game-mods__indicator";
  gameModsButtonsContainer.append(gameModIndicator);

  const labels = [];

  gameMods.forEach((gameMod) => {
    const gameModInput = document.createElement("input");
    gameModInput.type = "radio";
    gameModInput.name = "game-mod";
    gameModInput.value = gameMod.type;
    gameModInput.id = `game-mod-${gameMod.type.toLowerCase().replaceAll(" ", "-")}`;
    gameModInput.className =
      "start-screen__game-menu__game-mods__game-mod-input";

    const gameModLabel = document.createElement("label");
    gameModLabel.className =
      "start-screen__game-menu__game-mods__game-mod-label";
    gameModLabel.htmlFor = gameModInput.id;
    gameModLabel.textContent = gameMod.type;

    labels.push(gameModLabel);

    if (gameMod.type === activeGameMod) {
      gameModInput.checked = true;
      activeGameModLabel = gameModLabel;
    }

    gameModInput.addEventListener("input", () => {
      activeGameMod = gameMod.type;
      activeGameModLabel = gameModLabel;
      updateStartGameButtons();
      updateGameModIndicator();
    });

    gameModsButtonsContainer.append(gameModInput, gameModLabel);
  });

  const labelsResizeObserver = new ResizeObserver(() => {
    updateGameModIndicator();
  });

  labels.forEach((label) => {
    labelsResizeObserver.observe(label);
  });

  function updateGameModIndicator() {
    gameModIndicator.style.width = `${activeGameModLabel.offsetWidth}px`;
    gameModIndicator.style.transform = `translateX(${activeGameModLabel.offsetLeft}px)`;
  }

  startScreenContainer.afterRenderAnimation = updateGameModIndicator;

  const startGameButtonsContainer = document.createElement("section");
  startGameButtonsContainer.className = "start-screen__game-menu__start-game";
  gameMenu.append(startGameButtonsContainer);

  const newGameButton = document.createElement("button");
  newGameButton.className = "start-screen__game-menu__start-game__new-game";
  newGameButton.textContent = "New Game";
  newGameButton.addEventListener("click", () => {
    onNewGame(activeGameMod);
  });

  startGameButtonsContainer.append(newGameButton);

  const continueGameButton = document.createElement("button");
  continueGameButton.className =
    "start-screen__game-menu__start-game__continue";
  continueGameButton.textContent = "Continue";

  continueGameButton.addEventListener("click", () => {
    onContinue(activeGameMod);
  });

  startGameButtonsContainer.append(continueGameButton);

  function updateStartGameButtons() {
    continueGameButton.disabled =
      !playerNameConfirmed || !isGameSaved(activeGameMod);
  }

  let playerName = getPlayerName();
  let playerNameConfirmed = playerName.length >= PLAYER_NAME_MIN_LENGTH;

  playerNameInput.value = playerName;

  function updatePlayerNameState() {
    const isValid =
      playerNameInput.value.trim().length >= PLAYER_NAME_MIN_LENGTH;

    confirmPlayerNameButton.hidden = !isValid || playerNameConfirmed;
    editPlayerNameButton.hidden = !playerNameConfirmed;

    playerNameInput.disabled = playerNameConfirmed;

    newGameButton.disabled = !playerNameConfirmed;
    updateStartGameButtons();

    let playerNameInputTimeout;

    playerNameInput.addEventListener("input", () => {
      playerNameConfirmed = false;

      clearTimeout(playerNameInputTimeout);

      playerNameInputTimeout = setTimeout(() => {
        updatePlayerNameState();
      }, PLAYER_NAME_INPUT_DELAY);
    });

    confirmPlayerNameButton.addEventListener("click", () => {
      const name = playerNameInput.value.trim();

      if (name.length < PLAYER_NAME_MIN_LENGTH) {
        return;
      }

      playerName = name;
      playerNameConfirmed = true;

      savePlayerName(playerName);
      updatePlayerNameState();
    });
  }

  const additionButtonsContainer = document.createElement("div");
  additionButtonsContainer.className = "start-screen__game-menu__additional";
  gameMenu.append(additionButtonsContainer);

  const settingsButton = document.createElement("button");
  settingsButton.className = "start-screen__game-menu__settings-button";
  settingsButton.textContent = "Settings";
  additionButtonsContainer.append(settingsButton);

  settingsButton.addEventListener("click", () => {
    openSettings();
  });

  const scoresButton = document.createElement("button");
  scoresButton.className = "start-screen__game-menu__scores-button";
  scoresButton.textContent = "Scores";
  additionButtonsContainer.append(scoresButton);

  scoresButton.addEventListener("click", () => {
    openScoresModal();
  });

  const authorCreditFooter = document.createElement("div");
  authorCreditFooter.className = "start-screen__footer";
  startScreenContainer.append(authorCreditFooter);

  const authorCreditLink = document.createElement("a");
  authorCreditLink.className = "start-screen__footer__credits-link";
  authorCreditLink.textContent = "andrewfroze";
  authorCreditLink.href = "https://github.com/andrewfroze";
  authorCreditLink.target = "_blank";
  authorCreditLink.rel = "noopener noreferrer";
  authorCreditFooter.append(authorCreditLink);

  updatePlayerNameState();

  return startScreenContainer;
}

function isGameSaved(gameMod) {
  return localStorage.getItem(gameMod) !== null;
}

function openScoresModal() {
  openScores();
}

function getPlayerName() {
  const savedSettings = localStorage.getItem("settings");

  if (!savedSettings) {
    return "Player";
  }

  try {
    const settings = JSON.parse(savedSettings);
    return settings.playerName?.trim() || "Player";
  } catch {
    return "Player";
  }
}

function savePlayerName(playerName) {
  const savedSettings = localStorage.getItem("settings");

  let settings = {};

  if (savedSettings) {
    try {
      settings = JSON.parse(savedSettings);
    } catch {
      settings = {};
    }
  }

  settings.playerName = playerName;
  localStorage.setItem("settings", JSON.stringify(settings));
}

export { createStartScreen, getPlayerName };
