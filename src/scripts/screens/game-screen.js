import "../../styles/game-screen.scss";
import { Game } from "../game/game";

function newGameScreen(mode, onClose) {
  console.log("start new game");
  const gameScreen = document.createElement("div");
  gameScreen.className = "game-screen";

  const game = new Game(mode);
  gameScreen.append(renderBoard(game.board));

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

function renderBoard(boardArray) {
  const gameBoard = document.createElement("section");
  gameBoard.className = "game-screen__game-board";

  for (const item of boardArray) {
    const itemCell = document.createElement("div");
    itemCell.className = "game-screen__game-board__item";
    gameBoard.append(itemCell);

    const itemLabel = document.createElement("label");
    itemLabel.textContent = item ?? "";
    itemLabel.className = "game-screen__game-board__item__label";
    itemCell.append(itemLabel);
  }
  return gameBoard;
}

export { newGameScreen, continueGameScreen };
