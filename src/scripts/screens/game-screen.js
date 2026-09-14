import "../../styles/game-screen.scss";
import { Game } from "../game/game";

let board;
let assistButtons;
let statisticsPanel;
let timer;
let score;
let timerInterval;

function newGameScreen(mode) {
  const game = new Game(mode);
  const gameScreen = document.createElement("div");
  gameScreen.className = "game-screen";

  const assistButtonsContainer = document.createElement("div");
  assistButtonsContainer.className = "game-screen__assist-buttons";
  assistButtons = assistButtonsContainer;

  const gameBoardContainer = document.createElement("div");
  gameBoardContainer.className = "game-screen__game-board-container";
  board = gameBoardContainer;

  renderAssistButtons(game);
  gameScreen.append(gameBoardContainer);

  statisticsPanel = renderStatisticsPanel(game);
  gameBoardContainer.append(statisticsPanel);

  gameBoardContainer.append(renderBoard(game));
  gameScreen.append(assistButtonsContainer);

  return gameScreen;
}

function renderStatisticsPanel(game) {
  const statisticsPanel = document.createElement("div");
  statisticsPanel.className = "game-screen__game-board-container__stats";

  timer = document.createElement("label");
  timer.className = "game-screen__game-board-container__stats__timer";
  updateTimer(timer, 0);

  score = document.createElement("label");
  score.className = "game-screen__game-board-container__stats__score";
  updateScore(score, game.score);

  statisticsPanel.append(score, timer);
  return statisticsPanel;
}

function updateTimer(timerElement, seconds) {
  timerElement.textContent = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function updateScore(scoreElement, score) {
  scoreElement.textContent = `Score: ${score}`;
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
      game.canNumbersBeAdded(),
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

function renderBoard(game) {
  const gameBoard = document.createElement("section");
  gameBoard.className = "game-screen__game-board-container__game-board";

  let selectedLabel;

  game.board.forEach((item, index) => {
    const itemCell = document.createElement("div");
    itemCell.className = "game-screen__game-board-container__game-board__item";
    gameBoard.append(itemCell);

    const itemLabel = document.createElement("label");
    itemLabel.textContent = item ?? "";
    itemLabel.dataset.index = index;
    itemLabel.className =
      "game-screen__game-board-container__game-board__item__label";

    if (!item) {
      itemLabel.classList.add("disabled");
    }
    itemCell.append(itemLabel);

    itemLabel.addEventListener("click", async () => {
      if (!timerInterval) {
        timerInterval = setInterval(() => {
          game.time++;
          updateTimer(timer, game.time);
        }, 1000);
      }

      if (itemLabel.classList.contains("selected")) {
        itemLabel.classList.remove("selected");
        selectedLabel = undefined;
        return;
      }

      if (!selectedLabel) {
        itemLabel.classList.add("selected");
        selectedLabel = itemLabel;
        return;
      }

      const result = game.checkNumbers(
        selectedLabel.dataset.index,
        itemLabel.dataset.index,
      );

      if (result) {
        game.score += result;
        rerenderBoard(game);
        updateScore(score, game.score);
        return;
      }

      selectedLabel.classList.remove("selected");
      selectedLabel.classList.add("error");
      itemLabel.classList.add("error");

      await new Promise((resolve) => setTimeout(resolve, 300));

      selectedLabel.classList.remove("error");
      itemLabel.classList.remove("error");
      selectedLabel = undefined;
    });
  });

  return gameBoard;
}

function rerenderBoard(game) {
  board.replaceChildren(statisticsPanel, renderBoard(game));
}

function addNumbers(game) {
  if (game.addNumbers()) {
    rerenderBoard(game);
    renderAssistButtons(game);
  }
}

function getHint(board) {
  board.getHint();
}

function revert(board) {
  board.revert();
}

function shuffle(game) {
  if (game.shuffle()) {
    rerenderBoard(game);
    renderAssistButtons(game);
  }
}

function eraser(board) {
  board.eraser();
}

export { newGameScreen, continueGameScreen };
