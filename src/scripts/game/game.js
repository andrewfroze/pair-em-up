import {
  getRandomNumber,
  getShuffledSequence,
  shuffleSequence,
} from "./random";

class Game {
  constructor(mode, isNew = true) {
    this.mode = mode;
    this.board = [];
    this.isRevertAvailable = false;
    this.addNumbersAvailable = 10;
    this.shufflesAvailable = 5;
    this.eraserAvailable = 5;
    if (isNew) {
      this.createBoard(mode);
    } else {
      this.loadSavedState(mode);
    }
    this.hints = [];
    this.hintsAvailable = this.collectHints();
    this.maxHintsToShow = 5;
  }

  collectHints() {
    // todo fill this.hints
    return this.hints.length;
  }

  loadSavedState(mode) {
    const savedState = localStorage.getItem(mode);
    if (savedState) {
      this.board = JSON.parse(savedState);
      return this;
    }
    throw new Error("There are no saved states");
  }

  createBoard(mode) {
    switch (mode) {
      case "classic":
        this.createClassicSequence();
        break;
      case "random":
        this.createRandomSequence();
        break;
      case "chaotic":
        this.createChaoticSequence();
        break;
    }
    this.placeSequenceToBoard();
  }

  createClassicSequence() {
    this.sequence = Array.from({ length: 19 }, (_, index) => index + 1);
  }

  createRandomSequence() {
    this.sequence = getShuffledSequence();
  }

  createChaoticSequence() {
    this.sequence = Array.from({ length: 27 }, () => getRandomNumber());
  }

  placeSequenceToBoard() {
    this.board = [];
    let lastFilled = 0;
    for (const item of this.sequence) {
      if (item % 10) {
        for (const number of item.toString().split("")) {
          this.board[lastFilled++] = +number;
        }
      }
    }
  }

  shuffle() {
    if (this.shufflesAvailable) {
      this.board = shuffleSequence(this.board);
      this.shufflesAvailable -= 1;
      return true;
    }
    return false;
  }
}

export { Game };
