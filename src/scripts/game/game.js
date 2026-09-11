class Game {
  constructor(mode, isNew = true) {
    this.mode = mode;
    this.createNewField();
    if (isNew) {
      this.fillCells(mode);
    } else {
      this.loadSavedState(mode);
    }
  }

  createNewField() {
    this.board = new Array(27);
  }

  loadSavedState(mode) {
    const savedState = localStorage.getItem(mode);
    if (savedState) {
      this.board = JSON.parse(savedState);
      return this;
    }
    throw new Error("There are no saved states");
  }

  fillCells(mode) {
    switch (mode) {
      case "classic":
        return this.createClassicField();
      case "random":
        return this.createRandomGame();
      case "chaotic":
        return this.createChaoticGame();
    }
    throw new Error("Unknown game mode selected");
  }

  createClassicField() {
    for (let i = 0; i < this.board.length; i += 1) {
      this.board[i] = i + 1;
    }
    return this.board;
  }
}

export { Game };
