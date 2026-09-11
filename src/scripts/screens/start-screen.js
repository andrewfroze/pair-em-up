import "../../styles/start-screen.scss";
import { openSettings } from "../components/settings";
import { openScores } from "../components/scores";

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

  const gameModsButtonsContainer = document.createElement("section");
  gameModsButtonsContainer.className = "start-screen__game-menu__game-mods";
  gameMenu.append(gameModsButtonsContainer);

  const gameModIndicator = document.createElement("div");
  gameModIndicator.className = "start-screen__game-menu__game-mods__indicator";
  gameModsButtonsContainer.append(gameModIndicator);

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
    continueGameButton.disabled = !isGameSaved(activeGameMod);
  }

  updateStartGameButtons();

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

  return startScreenContainer;
}

function isGameSaved(gameMod) {
  console.log("checking game: " + gameMod);
  return false;
}

function openScoresModal() {
  openScores();
}

export { createStartScreen };
