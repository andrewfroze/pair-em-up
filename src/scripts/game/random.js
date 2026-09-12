function getRandomNumber() {
  return Math.floor(Math.random() * 9) + 1;
}

function getShuffledSequence() {
  return shuffleSequence(Array.from({ length: 19 }, (_, index) => index + 1));
}

function shuffleSequence(sequence) {
  for (let i = sequence.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));

    [sequence[i], sequence[randomIndex]] = [sequence[randomIndex], sequence[i]];
  }

  return sequence;
}

export { getRandomNumber, getShuffledSequence, shuffleSequence };
