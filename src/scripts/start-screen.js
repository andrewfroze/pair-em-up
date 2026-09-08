import "../styles/start-screen.scss";

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

const gameTitle = document.createElement("h1");
gameTitle.textContent = "Pair 'em Up";
startScreenContainer.append(gameTitle);

const gameModsButtonsContainer = document.createElement("section");
startScreenContainer.append(gameModsButtonsContainer);

for (const gameMod of gameMods) {
  const gameModButton = document.createElement("button");
  gameModButton.className = "game-mod-button";
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
startScreenContainer.append(startGameButtonsContainer);

const newGameButton = document.createElement("button");
newGameButton.textContent = "New Game";
newGameButton.addEventListener("click", () => {
  startNewGame(activeGameMod);
});

startGameButtonsContainer.append(newGameButton);

const continueGameButton = document.createElement("button");
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
settingsButton.textContent = "Settings";
startScreenContainer.append(settingsButton);

settingsButton.addEventListener("click", () => {
  openSettingsModal();
});

const scoresButton = document.createElement("button");
scoresButton.textContent = "Scores";
startScreenContainer.append(scoresButton);

scoresButton.addEventListener("click", () => {
  openScoresModal();
});

const authorCreditFooter = document.createElement("div");
startScreenContainer.append(authorCreditFooter);

const authorCreditLink = document.createElement("a");
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

function openSettingsModal() {
  console.log("open settings");
}

function openScoresModal() {
  console.log("open scores");
}

export { startScreenContainer };
