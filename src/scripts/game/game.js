import {
  getRandomNumber,
  getShuffledSequence,
  shuffleSequence,
} from "./random";

class Game {
  constructor(mode, isNew = true, score = 0, time = 0, moves = 0) {
    this.score = score;
    this.time = time;
    this.moves = moves;
    this.mode = mode;

    this.board = [];

    this.addNumbersAvailable = 10;
    this.numbersLimit = 450;
    this.shufflesAvailable = 5;
    this.eraserAvailable = 5;

    if (isNew) {
      this.createBoard(mode);
    } else {
      this.loadSavedState(mode);
    }

    this.hint = [];
    this.hintsAvailable = this.collectHints();
    this.maxHintsToShow = 5;

    this.lastStep = {
      score: this.score,
      numbers: [],
    };
  }

  collectHints() {
    this.hint = undefined;

    const hints = [];

    for (let firstIndex = 0; firstIndex < this.board.length; firstIndex += 1) {
      if (this.board[firstIndex] == null) {
        continue;
      }

      const applicableCells = this.getApplicableCells(firstIndex);

      for (const secondIndex of applicableCells) {
        if (secondIndex <= firstIndex) {
          continue;
        }

        const first = this.board[firstIndex];
        const second = this.board[secondIndex];

        if (
          (first === 5 && second === 5) ||
          first + second === 10 ||
          first === second
        ) {
          if (!this.hint) {
            this.hint = [firstIndex, secondIndex];
          }

          hints.push([firstIndex, secondIndex]);

          if (hints.length > 5) {
            this.hintsAvailable = "5+";
            return this.hintsAvailable;
          }
        }
      }
    }

    this.hintsAvailable = hints.length;
    return this.hintsAvailable;
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
      this.dropLastStep();
      this.hintsAvailable = this.collectHints();
      return true;
    }
    return false;
  }

  canNumbersBeAdded() {
    return this.addNumbersAvailable && this.board.length < this.numbersLimit;
  }

  addNumbers() {
    if (this.canNumbersBeAdded()) {
      switch (this.mode) {
        case "classic":
          this.addNumbersClassic();
          break;
        case "random":
          this.addNumbersRandom();
          break;
        case "chaotic":
          this.addNumbersChaotic();
          break;
      }

      this.addNumbersAvailable -= 1;
      this.limitNumbers();
      this.dropLastStep();
      this.hintsAvailable = this.collectHints();
      return true;
    }
    return false;
  }

  addNumbersClassic() {
    this.board.push(...this.getNumbersLeft());
  }

  addNumbersRandom() {
    this.board.push(...shuffleSequence(this.getNumbersLeft()));
  }

  addNumbersChaotic() {
    const numbersLeft = this.getNumbersLeft().length;
    for (let i = 0; i < numbersLeft; i += 1) {
      this.board.push(getRandomNumber());
    }
  }

  limitNumbers() {
    if (this.board.length > this.numbersLimit) {
      this.board = this.board.slice(0, this.numbersLimit);
    }
  }

  getNumbersLeft() {
    return this.board.filter((val) => val);
  }

  checkNumbers(firstIndex, secondIndex) {
    if (!this.board[firstIndex] || !this.board[secondIndex]) {
      return 0;
    }

    if (!this.getApplicableCells(firstIndex).includes(+secondIndex)) {
      return 0;
    }

    const first = +this.board[firstIndex];
    const second = +this.board[secondIndex];

    let result = 0;

    if (first === 5 && second === 5) {
      result = 3;
    }

    if (first + second === 10) {
      result = 2;
    }

    if (first === second) {
      result = 1;
    }

    this.removeNumbers(firstIndex, secondIndex);
    this.moves += 1;

    return result;
  }

  getApplicableCells(index) {
    index = +index;
    const applicableCells = [];

    const directions = [1, -1, 9, -9];

    directions.forEach((direction) => {
      let currentIndex = index + direction;

      while (currentIndex >= 0 && currentIndex < this.board.length) {
        if (this.board[currentIndex] !== null) {
          applicableCells.push(currentIndex);
          break;
        }

        currentIndex += direction;
      }
    });
    return applicableCells;
  }

  removeNumbers(firstIndex, secondIndex) {
    this.lastStep.score = this.score;
    this.lastStep.numbers = [
      {
        index: firstIndex,
        value: this.board[firstIndex],
      },
      {
        index: secondIndex,
        value: this.board[secondIndex],
      },
    ];
    this.board[firstIndex] = null;
    this.board[secondIndex] = null;
    this.hintsAvailable = this.collectHints();
  }

  revert() {
    this.lastStep.numbers.forEach((item) => {
      this.board[item.index] = item.value;
    });
    this.score = this.lastStep.score;
    this.lastStep.numbers = [];
    this.hintsAvailable = this.collectHints();
  }

  dropLastStep() {
    this.lastStep["score"] = this.score;
    this.lastStep["numbers"] = [];
  }

  eraser(index) {
    if (!this.eraserAvailable || this.board[index] == null) {
      return false;
    }

    this.board[index] = null;
    this.eraserAvailable -= 1;
    this.moves += 1;

    this.collectHints();
    this.dropLastStep();

    return true;
  }

  hasWon() {
    return this.score >= 100;
  }

  hasReachedBoardLimit() {
    return this.board.length >= this.numbersLimit;
  }

  hasValidMoves() {
    return Boolean(this.hint);
  }

  areAllAssistsUsed() {
    return (
      this.hintsAvailable === 0 &&
      this.addNumbersAvailable === 0 &&
      this.shufflesAvailable === 0 &&
      this.eraserAvailable === 0
    );
  }

  hasLost() {
    return (
      this.hasReachedBoardLimit() ||
      (!this.hasValidMoves() && this.areAllAssistsUsed())
    );
  }

  getResult() {
    if (this.hasWon()) {
      return {
        won: true,
        score: this.score,
        time: this.time,
        moves: this.moves,
        mode: this.mode,
      };
    }

    if (this.hasLost()) {
      return {
        won: false,
        score: this.score,
        time: this.time,
        moves: this.moves,
        mode: this.mode,
      };
    }

    return null;
  }
}

export { Game };
