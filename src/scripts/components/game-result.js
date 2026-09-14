import "../../styles/components/game-result.scss";
import { formatTime } from "./scores";

function showGameResult(result, { onPlayAgain, onMainMenu, onResults }) {
  const overlay = document.createElement("div");
  overlay.className = "overlay";

  const resultScreen = document.createElement("section");
  resultScreen.className = "game-result";
  overlay.append(resultScreen);

  const status = document.createElement("div");
  status.className = "game-result__status";
  status.textContent = result.won ? "🏆" : "✕";
  resultScreen.append(status);

  const title = document.createElement("h2");
  title.className = "game-result__title";
  title.textContent = result.won ? "You Win!" : "Game Over";
  resultScreen.append(title);

  const statistics = document.createElement("div");
  statistics.className = "game-result__statistics";
  resultScreen.append(statistics);

  addStatistic("Score", result.score);
  addStatistic("Time", formatTime(result.time));
  addStatistic("Moves", result.moves);

  function addStatistic(labelText, valueText) {
    const statistic = document.createElement("div");
    statistic.className = "game-result__statistics__item";

    const label = document.createElement("span");
    label.className = "game-result__statistics__item__label";
    label.textContent = labelText;

    const value = document.createElement("span");
    value.className = "game-result__statistics__item__value";
    value.textContent = valueText;

    statistic.append(label, value);
    statistics.append(statistic);
  }

  const controls = document.createElement("div");
  controls.className = "game-result__controls";
  resultScreen.append(controls);

  const playAgainButton = document.createElement("button");
  playAgainButton.textContent = "Play Again";
  playAgainButton.addEventListener("click", () => {
    overlay.remove();
    onPlayAgain();
  });

  const mainMenuButton = document.createElement("button");
  mainMenuButton.textContent = "Main Menu";
  mainMenuButton.addEventListener("click", () => {
    overlay.remove();
    onMainMenu();
  });

  controls.append(playAgainButton, mainMenuButton);

  const resultsButton = document.createElement("button");
  resultsButton.className = "game-result__results-button";
  resultsButton.textContent = "Results";
  resultsButton.addEventListener("click", () => {
    onResults();
  });

  resultScreen.append(resultsButton);

  document.body.append(overlay);
}

export { showGameResult };
