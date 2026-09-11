function newGameScreen(mode, onClose) {
  console.log("start new game");
  const gameScreen = document.createElement("div");
  gameScreen.className = "game-screen";
  gameScreen.textContent = `New Game (${mode}): Coming soon...`;

  gameScreen.append(closeButton(onClose));
  return gameScreen;
}

function continueGameScreen(mode, onClose) {
  const gameScreen = document.createElement("div");
  gameScreen.className = "game-screen";
  gameScreen.textContent = `Continue Game (${mode}): Coming soon...`;
  gameScreen.append(closeButton(onClose));
  return gameScreen;
}

function closeButton(onClose) {
  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";

  closeButton.addEventListener("click", () => onClose());

  return closeButton;
}

export { newGameScreen, continueGameScreen };
