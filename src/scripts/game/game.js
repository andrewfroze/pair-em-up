import {
  getRandomNumber,
  getShuffledSequence,
  shuffleSequence,
} from "./random";

class Game {
  constructor(mode, isNew = true) {
    this.mode = mode;
    this.board = [];
    if (isNew) {
      this.createBoard(mode);
    } else {
      this.loadSavedState(mode);
    }
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
    this.board = shuffleSequence(this.board);
  }
}

export { Game };
