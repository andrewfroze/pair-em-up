import "../../styles/game-screen.scss";
import { Game } from "../game/game";
import { showGameResult } from "../components/game-result";
import { openScores, addResult } from "../components/scores";

let gameScreen;
let board;
let assistButtons;
let statisticsPanel;
let timer;
let score;
let timerInterval;
let game;
let eraserMode = false;
let gameBoard;
let onMainMenuGlobal;

function newGameScreen(mode, { onMainMenu }) {
  startGame(mode, true);
  onMainMenuGlobal = onMainMenu;

  gameScreen = document.createElement("div");
  gameScreen.className = "game-screen";

  const assistButtonsContainer = document.createElement("div");
  assistButtonsContainer.className = "game-screen__assist-buttons";
  assistButtons = assistButtonsContainer;

  const gameBoardContainer = document.createElement("div");
  gameBoardContainer.className = "game-screen__game-board-container";
  board = gameBoardContainer;

  renderAssistButtons();
  gameScreen.append(gameBoardContainer);

  statisticsPanel = renderStatisticsPanel();
  gameBoardContainer.append(statisticsPanel);

  gameBoardContainer.append(renderBoard());
  gameScreen.append(assistButtonsContainer);

  return gameScreen;
}

function continueGameScreen(mode, { onMainMenu }) {
  startGame(mode, false);
  onMainMenuGlobal = onMainMenu;

  gameScreen = document.createElement("div");
  gameScreen.className = "game-screen";

  const assistButtonsContainer = document.createElement("div");
  assistButtonsContainer.className = "game-screen__assist-buttons";
  assistButtons = assistButtonsContainer;

  const gameBoardContainer = document.createElement("div");
  gameBoardContainer.className = "game-screen__game-board-container";
  board = gameBoardContainer;

  renderAssistButtons();
  gameScreen.append(gameBoardContainer);

  statisticsPanel = renderStatisticsPanel();
  gameBoardContainer.append(statisticsPanel);

  gameBoardContainer.append(renderBoard());
  gameScreen.append(assistButtonsContainer);

  if (game.time > 0) {
    startTimer();
  }

  return gameScreen;
}

function renderStatisticsPanel() {
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

function updateTimer() {
  timer.textContent = `${String(Math.floor(game.time / 60)).padStart(2, "0")}:${String(game.time % 60).padStart(2, "0")}`;
}

function updateScore() {
  score.textContent = `Score: ${game.score}`;
}

function renderAssistButtons() {
  assistButtons.replaceChildren(
    createAssistButton(
      `Hints (${game.hintsAvailable})`,
      "game-screen__assist-buttons__button",
      () => getHint(),
      game.hintsAvailable,
      true,
    ),
    createAssistButton(
      "Revert",
      "game-screen__assist-buttons__button",
      () => revert(),
      game.lastStep.numbers.length,
      true,
    ),
    createAssistButton(
      `Add Numbers (${game.addNumbersAvailable})`,
      "game-screen__assist-buttons__button",
      () => addNumbers(),
      game.canNumbersBeAdded(),
      true,
    ),
    createAssistButton(
      `Shuffle (${game.shufflesAvailable})`,
      "game-screen__assist-buttons__button",
      () => shuffle(),
      game.shufflesAvailable,
      true,
    ),
    createAssistButton(
      `Eraser (${game.eraserAvailable})`,
      "game-screen__assist-buttons__button eraser",
      () => toggleEraser(),
      game.eraserAvailable,
      false,
    ),
  );
}

function createAssistButton(
  label,
  buttonClass,
  onClick,
  enabled,
  isBlockedByEraser,
) {
  const button = document.createElement("button");
  button.className = buttonClass;
  button.textContent = label;
  button.disabled = !enabled || (eraserMode && isBlockedByEraser);
  if (eraserMode) {
    button.classList.add("selected");
  }
  button.addEventListener("click", () => onClick());
  return button;
}

function renderBoard() {
  gameBoard = document.createElement("section");
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
      startTimer();

      if (eraserMode) {
        if (game.eraser(index)) {
          eraserMode = false;

          rerenderBoard();
          renderAssistButtons();
        }

        return;
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
        game.saveState();

        rerenderBoard(game);
        updateScore(score, game.score);
        renderAssistButtons(game);

        checkGameEnd();
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

function rerenderBoard() {
  const scrollTop = gameBoard?.scrollTop ?? 0;
  board.replaceChildren(statisticsPanel, renderBoard());
  gameBoard.scrollTop = scrollTop;
}

function addNumbers() {
  if (game.addNumbers()) {
    rerenderBoard();
    renderAssistButtons();

    checkGameEnd();
  }
}

function getHint() {
  const hintPair = game.hint;

  if (!hintPair) {
    return;
  }

  const labels = board.querySelectorAll(
    ".game-screen__game-board-container__game-board__item__label",
  );

  const [firstIndex, secondIndex] = hintPair;

  const label = labels[firstIndex];

  gameBoard.scrollTo({
    top: label.offsetTop - gameBoard.clientHeight / 2 + label.offsetHeight / 2,
    behavior: "smooth",
  });
  labels[firstIndex].classList.add("hint");
  labels[secondIndex].classList.add("hint");

  setTimeout(() => {
    labels[firstIndex].classList.remove("hint");
    labels[secondIndex].classList.remove("hint");
  }, 2100);
}

function revert() {
  game.revert();
  rerenderBoard();
  renderAssistButtons();
  updateScore();
}

function shuffle() {
  if (game.shuffle()) {
    rerenderBoard();
    renderAssistButtons();

    checkGameEnd();
  }
}

function toggleEraser() {
  eraserMode = !eraserMode;
  renderAssistButtons();
}

function startGame(mode, isNew = true) {
  game = new Game(mode, isNew);

  window.removeEventListener("beforeunload", saveGame);
  window.addEventListener("beforeunload", saveGame);
}

function saveGame() {
  if (game) {
    game.saveState();
  }
}

let saveCounter = 0;

function startTimer() {
  if (timerInterval) {
    return;
  }

  timerInterval = setInterval(() => {
    game.time += 1;
    updateTimer();

    saveCounter += 1;

    if (saveCounter >= 5) {
      game.saveState();
      saveCounter = 0;
    }
  }, 1000);
}

function checkGameEnd() {
  const result = game.getResult();

  if (!result) {
    return false;
  }

  stopTimer();

  localStorage.removeItem(game.mode);

  saveGameResult(result, "Player");

  showGameResult(result, {
    onPlayAgain: () => restartGame(),
    onMainMenu: onMainMenuGlobal,
    onResults: () => openScores(),
  });

  return true;
}

function saveGameResult(result, name) {
  addResult(result, name);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = undefined;
  }
}

function restartGame() {
  stopTimer();

  eraserMode = false;

  game = new Game(game.mode);

  statisticsPanel = renderStatisticsPanel();
  rerenderBoard();
  renderAssistButtons();

  checkGameEnd();
}

export { newGameScreen, continueGameScreen };
