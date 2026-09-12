import "../../styles/game-screen.scss";
import { Game } from "../game/game";

function newGameScreen(mode) {
  const game = new Game(mode);
  const gameScreen = document.createElement("div");
  gameScreen.className = "game-screen";

  const assistButtonsContainer = document.createElement("div");
  assistButtonsContainer.className = "game-screen__assist-buttons";
  gameScreen.append(assistButtonsContainer);

  const gameBoardContainer = document.createElement("div");
  gameBoardContainer.className = "game-screen__game-board-container";

  assistButtonsContainer.append(
    createButton("Hints", "game-screen__assist-buttons__hints", () =>
      getHint(game),
    ),
    createButton("Revert", "game-screen__assist-buttons__revert", () =>
      revert(game),
    ),
    createButton(
      "Add Numbers",
      "game-screen__assist-buttons__add-numbers",
      () => addNumbers(game),
    ),
    createButton("Shuffle", "game-screen__assist-buttons__shuffle", () =>
      shuffle(game, gameBoardContainer),
    ),
    createButton("Eraser", "game-screen__assist-buttons__eraser", () =>
      eraser(game),
    ),
  );

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

function createButton(label, buttonClass, onClick = () => console.log(label)) {
  const button = document.createElement("button");
  button.textContent = buttonClass;
  button.textContent = label;
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

function addNumbers(board) {
  board.addNumbers();
}

function getHint(board) {
  board.getHint();
}

function revert(board) {
  board.revert();
}

function shuffle(game, boardElement) {
  game.shuffle();
  boardElement.replaceChildren(renderBoard(game.board));
}

function eraser(board) {
  board.eraser();
}

export { newGameScreen, continueGameScreen };
