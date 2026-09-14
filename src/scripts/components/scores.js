import "../../styles/components/scores.scss";
import { getPlayerName } from "../screens/start-screen";

const MODES = ["classic", "random", "chaotic"];
const MAX_RESULTS = 5;

let scoresModal;

function loadResults() {
  const savedResults = localStorage.getItem("topResults");

  if (!savedResults) {
    return {
      classic: [],
      random: [],
      chaotic: [],
    };
  }

  try {
    const parsedResults = JSON.parse(savedResults);

    return {
      classic: Array.isArray(parsedResults.classic)
        ? parsedResults.classic
        : [],
      random: Array.isArray(parsedResults.random) ? parsedResults.random : [],
      chaotic: Array.isArray(parsedResults.chaotic)
        ? parsedResults.chaotic
        : [],
    };
  } catch {
    return {
      classic: [],
      random: [],
      chaotic: [],
    };
  }
}

function saveResults(results) {
  localStorage.setItem("topResults", JSON.stringify(results));
}

function formatTime(seconds) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
    seconds % 60,
  ).padStart(2, "0")}`;
}

function isTopResult(result) {
  const results = loadResults()[result.mode] || [];

  if (results.length < MAX_RESULTS) {
    return true;
  }

  return result.time <= results[results.length - 1].time;
}

function addResult(result) {
  const results = loadResults();

  const modeResults = results[result.mode] || [];

  modeResults.unshift({
    name: getPlayerName(),
    score: result.score,
    won: result.won,
    time: result.time,
    moves: result.moves,
    date: Date.now(),
  });

  results[result.mode] = modeResults.slice(0, MAX_RESULTS);

  saveResults(results);
}

function createResultList(mode) {
  const results = loadResults()[mode] || [];

  if (!results.length) {
    const emptyLabel = document.createElement("label");
    emptyLabel.className = "scores-modal__top-results__no-results";
    emptyLabel.textContent = "There are no results yet.";
    return emptyLabel;
  }

  const list = document.createElement("ol");
  list.className = "scores-modal__top-results__list";

  results.forEach((result) => {
    const item = document.createElement("li");
    item.className = "scores-modal__top-results__list__item";

    const status = document.createElement("span");
    status.className = "scores-modal__top-results__list__item__status";
    status.textContent = result.won ? "🏆" : "✕";
    item.append(status);

    const name = document.createElement("span");
    name.className = "scores-modal__top-results__list__item__name";
    name.textContent = result.name;

    const score = document.createElement("span");
    score.className = "scores-modal__top-results__list__item__score";
    score.textContent = `${result.score} pts`;

    const metadata = document.createElement("span");
    metadata.className = "scores-modal__top-results__list__item__metadata";

    metadata.textContent = `${formatTime(result.time)} · ${result.moves} moves`;

    item.append(name, score, metadata);
    list.append(item);
  });

  return list;
}

function createScoresModal() {
  const overlay = document.createElement("div");
  overlay.className = "overlay";

  const modal = document.createElement("div");
  modal.className = "scores-modal";
  overlay.append(modal);

  const title = document.createElement("h2");
  title.className = "scores-modal__title";
  title.textContent = "Last 5 Results";
  modal.append(title);

  const tabs = document.createElement("div");
  tabs.className = "scores-modal__tabs";
  modal.append(tabs);

  const resultsContainer = document.createElement("div");
  resultsContainer.className = "scores-modal__top-results";
  modal.append(resultsContainer);

  let activeMode = "classic";

  function renderResults() {
    resultsContainer.replaceChildren(createResultList(activeMode));

    tabs.querySelectorAll("button").forEach((button) => {
      button.classList.toggle("active", button.dataset.mode === activeMode);
    });
    updateClearButton();
  }

  MODES.forEach((mode) => {
    const button = document.createElement("button");

    button.className = "scores-modal__tabs__button";
    button.dataset.mode = mode;
    button.textContent = mode.charAt(0).toUpperCase() + mode.slice(1);

    button.addEventListener("click", () => {
      activeMode = mode;
      renderResults();
    });

    tabs.append(button);
  });

  const controls = document.createElement("div");
  controls.className = "scores-modal__controls";
  modal.append(controls);

  const clearButton = document.createElement("button");
  clearButton.className = "scores-modal__controls__clear";
  clearButton.textContent = "Clear";

  function updateClearButton() {
    const results = loadResults()[activeMode] || [];
    clearButton.disabled = results.length === 0;
  }

  clearButton.addEventListener("click", () => {
    const results = loadResults();
    results[activeMode] = [];
    saveResults(results);
    renderResults();
  });

  const closeButton = document.createElement("button");
  closeButton.className = "scores-modal__controls__close";
  closeButton.textContent = "Close";
  closeButton.addEventListener("click", closeScores);

  controls.append(clearButton, closeButton);

  renderResults();

  return overlay;
}

function openScores() {
  scoresModal = createScoresModal();
  document.body.append(scoresModal);
}

function closeScores() {
  if (scoresModal) {
    scoresModal.remove();
    scoresModal = undefined;
  }
}

function saveGameResult(result) {
  addResult(result);
}

export {
  openScores,
  closeScores,
  isTopResult,
  saveGameResult,
  formatTime,
  addResult,
};
