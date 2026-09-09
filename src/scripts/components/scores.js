import "../../styles/components/scores.scss";

let topResults;

function createScoresModal() {
  const overlay = document.createElement("div");
  overlay.className = "overlay";

  const scoresModal = document.createElement("div");
  scoresModal.className = "scores-modal";
  overlay.append(scoresModal);

  const scoresModalTitle = document.createElement("h2");
  scoresModalTitle.className = "scores-modal__title";
  scoresModalTitle.textContent = "Top 10 Results";
  scoresModal.append(scoresModalTitle);

  const scoresContainer = document.createElement("div");
  scoresContainer.className = "scores-modal__top-results";
  scoresModal.append(scoresContainer);

  const topResultsList = createTopResultsList();
  scoresContainer.append(topResultsList);

  const scoresControls = document.createElement("div");
  scoresControls.className = "scores-modal__controls";
  scoresModal.append(scoresControls);

  const fakeButton = createFakeResultsButton(topResultsList);
  if (fakeButton) {
    scoresControls.append(fakeButton);
  }

  const clearButton = createClearButton(topResultsList);
  if (clearButton) {
    scoresControls.append(clearButton);
  }

  const closeButton = createCloseButton();
  scoresControls.append(closeButton);

  return overlay;
}

let scoresModal;

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

function loadTopResults() {
  topResults = JSON.parse(localStorage.getItem("topResults"));
}

function createTopResultsList() {
  loadTopResults();

  if (!topResults || topResults.length < 1) {
    const noResultsLabel = document.createElement("label");
    noResultsLabel.textContent = "There are no results yet.";
    noResultsLabel.className = "scores-modal__top-results__no-results";
    return noResultsLabel;
  }

  const topResultsList = document.createElement("ul");
  topResultsList.className = "scores-modal__top-results__list";
  for (const resultItem of topResults) {
    const topResultsItem = document.createElement("li");
    topResultsItem.className = "scores-modal__top-results__list__item";
    topResultsList.append(topResultsItem);

    const nicknameLabel = document.createElement("label");
    nicknameLabel.className = "scores-modal__top-results__list__item__name";
    nicknameLabel.textContent = resultItem["name"];
    topResultsItem.append(nicknameLabel);

    const scoreLabel = document.createElement("label");
    scoreLabel.className = "scores-modal__top-results__list__item__score";
    scoreLabel.textContent = resultItem["score"];
    topResultsItem.append(scoreLabel);
  }
  return topResultsList;
}

function createClearButton(topResultsList) {
  if (topResults && topResults.length > 0) {
    const clearButton = document.createElement("button");
    clearButton.textContent = "Clear";
    clearButton.className = "scores-modal__controls__clear";

    clearButton.addEventListener("click", () => {
      clearScores();
      const newTopResults = createTopResultsList();
      topResultsList.replaceWith(newTopResults);

      clearButton.replaceWith(createFakeResultsButton(newTopResults));
    });

    return clearButton;
  }
}

function createFakeResultsButton(topResultsList) {
  if (!topResults || topResults.length < 1) {
    const fakeButton = document.createElement("button");
    fakeButton.textContent = "Fake";
    fakeButton.className = "scores-modal__controls__fake";

    fakeButton.addEventListener("click", () => {
      fillTopScores();
      const newTopResults = createTopResultsList();
      topResultsList.replaceWith(newTopResults);

      fakeButton.replaceWith(createClearButton(newTopResults));
    });

    return fakeButton;
  }
}

function createCloseButton() {
  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.className = "scores-modal__controls__close";

  closeButton.addEventListener("click", () => {
    closeScores();
  });

  return closeButton;
}

function fillTopScores() {
  localStorage.setItem(
    "topResults",
    '[{"name":"andrewfroze", "score":100},{"name":"nemesida", "score":99},{"name":"player1", "score":98},{"name":"player2", "score":97},{"name":"player3", "score":96},{"name":"player4", "score":95},{"name":"player5", "score":94},{"name":"player6", "score":93},{"name":"player7", "score":92},{"name":"player8", "score":91}]',
  );
}

function clearScores() {
  localStorage.setItem("topResults", "[]");
}

export { openScores, closeScores };
