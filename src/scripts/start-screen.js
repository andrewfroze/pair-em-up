import "../styles/start-screen.scss";
import { openSettings } from "./components/settings";

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
let activeGameModButton;

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

for (const gameMod of gameMods) {
  const gameModButton = document.createElement("button");
  gameModButton.className =
    "start-screen__game-menu__game-mods__game-mod-button";
  gameModButton.textContent = gameMod.type;

  if (gameMod.type === activeGameMod) {
    gameModButton.classList.add("focused");
    activeGameModButton = gameModButton;
  }

  gameModButton.addEventListener("click", () => {
    console.log(activeGameModButton);
    activeGameMod = gameMod.type;
    gameModButton.classList.add("focused");
    if (activeGameModButton) {
      activeGameModButton.classList.remove("focused");
    }
    activeGameModButton = gameModButton;

    updateStartGameButtons();
  });

  gameModsButtonsContainer.append(gameModButton);
}

const startGameButtonsContainer = document.createElement("section");
startGameButtonsContainer.className = "start-screen__game-menu__start-game";
gameMenu.append(startGameButtonsContainer);

const newGameButton = document.createElement("button");
newGameButton.className = "start-screen__game-menu__start-game__new-game";
newGameButton.textContent = "New Game";
newGameButton.addEventListener("click", () => {
  startNewGame(activeGameMod);
});

startGameButtonsContainer.append(newGameButton);

const continueGameButton = document.createElement("button");
continueGameButton.className = "start-screen__game-menu__start-game__continue";
continueGameButton.textContent = "Continue";

continueGameButton.addEventListener("click", () => {
  continueGame(activeGameMod);
});

startGameButtonsContainer.append(continueGameButton);

function updateStartGameButtons() {
  continueGameButton.disabled = !isGameSaved(activeGameMod);
}

updateStartGameButtons();

const settingsButton = document.createElement("button");
settingsButton.className = "start-screen__game-menu__settings-button";
settingsButton.textContent = "Settings";
gameMenu.append(settingsButton);

settingsButton.addEventListener("click", () => {
  openSettings();
});

const scoresButton = document.createElement("button");
scoresButton.className = "start-screen__game-menu__scores-button";
scoresButton.textContent = "Scores";
gameMenu.append(scoresButton);

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

function startNewGame(gameMod) {
  console.log("start new game: " + gameMod);
}

function continueGame(gameMod) {
  loadGameState(gameMod);
  console.log("continue game: " + gameMod);
}

function loadGameState(gameMod) {
  console.log("loading game: " + gameMod);
}

function isGameSaved(gameMod) {
  console.log("checking game: " + gameMod);
  return false;
}

function openScoresModal() {
  console.log("open scores");
}

export { startScreenContainer };
