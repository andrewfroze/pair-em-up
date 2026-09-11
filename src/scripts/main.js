import "../styles/main.scss";
import { applyTheme, loadSettings } from "./components/settings";
import { createStartScreen } from "./screens/start-screen";
import { newGameScreen, continueGameScreen } from "./screens/game-screen";

loadSettings();
applyTheme();
const gameArea = document.createElement("div");
gameArea.className = "game-area";
document.body.append(gameArea);

showStartScreen();

function showStartScreen() {
  renderScreen(
    createStartScreen({
      onNewGame: (mode) => startNewGame(mode),
      onContinue: (mode) => continueGame(mode),
    }),
  );
}

function renderScreen(screen) {
  gameArea.replaceChildren(screen);

  if (screen.afterRenderAnimation) {
    requestAnimationFrame(() => {
      screen.afterRenderAnimation();
    });
  }
}

function startNewGame(mode) {
  renderScreen(newGameScreen(mode, () => showStartScreen()));
}

function continueGame(mode) {
  renderScreen(continueGameScreen(mode, () => showStartScreen()));
}

export { gameArea };
