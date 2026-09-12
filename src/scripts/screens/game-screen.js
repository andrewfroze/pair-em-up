import "../../styles/game-screen.scss";
import { Game } from "../game/game";

let board;
let assistButtons;

function newGameScreen(mode) {
  const game = new Game(mode);
  const gameScreen = document.createElement("div");
  gameScreen.className = "game-screen";

  const assistButtonsContainer = document.createElement("div");
  assistButtonsContainer.className = "game-screen__assist-buttons";
  gameScreen.append(assistButtonsContainer);
  assistButtons = assistButtonsContainer;

  const gameBoardContainer = document.createElement("div");
  gameBoardContainer.className = "game-screen__game-board-container";
  board = gameBoardContainer;

  renderAssistButtons(game);
  gameScreen.append(gameBoardContainer);
  gameBoardContainer.append(renderBoard(game.board));
  return gameScreen;
}

function continueGameScreen(mode) {
  const gameScreen = document.createElement("div");
  gameScreen.className = "game-screen";
  gameScreen.textContent = `Continue Game (${mode}): Coming soon...`;
  return gameScreen;
}

function renderAssistButtons(game) {
  assistButtons.replaceChildren(
    createAssistButton(
      `Hints (${game.hintsAvailable})`,
      "game-screen__assist-buttons__button",
      () => getHint(game),
      game.hintsAvailable,
    ),
    createAssistButton(
      "Revert",
      "game-screen__assist-buttons__button",
      () => revert(game),
      game.isRevertAvailable,
    ),
    createAssistButton(
      `Add Numbers (${game.addNumbersAvailable})`,
      "game-screen__assist-buttons__button",
      () => addNumbers(game),
      game.addNumbersAvailable,
    ),
    createAssistButton(
      `Shuffle (${game.shufflesAvailable})`,
      "game-screen__assist-buttons__button",
      () => shuffle(game, board),
      game.shufflesAvailable,
    ),
    createAssistButton(
      `Eraser (${game.eraserAvailable})`,
      "game-screen__assist-buttons__button",
      () => eraser(game),
      game.eraserAvailable,
    ),
  );
}

function createAssistButton(label, buttonClass, onClick, enabled) {
  const button = document.createElement("button");
  button.className = buttonClass;
  button.textContent = label;
  button.disabled = !enabled;
  button.addEventListener("click", () => onClick());
  return button;
}

function renderBoard(boardArray) {
  const gameBoard = document.createElement("section");
  gameBoard.className = "game-screen__game-board-container__game-board";

  for (const item of boardArray) {
    const itemCell = document.createElement("div");
    itemCell.className = "game-screen__game-board-container__game-board__item";
    gameBoard.append(itemCell);

    const itemLabel = document.createElement("label");
    itemLabel.textContent = item ?? "";
    itemLabel.className =
      "game-screen__game-board-container__game-board__item__label";
    itemCell.append(itemLabel);
  }
  return gameBoard;
}

function rerenderBoard(game) {
  board.replaceChildren(renderBoard(game.board));
}

function addNumbers(board) {
  board.addNumbers();
}

function getHint(board) {
  board.getHint();
}

function revert(board) {
  board.revert();
}

function shuffle(game) {
  game.shuffle();
  rerenderBoard(game);
  renderAssistButtons(game);
}

function eraser(board) {
  board.eraser();
}

export { newGameScreen, continueGameScreen };
