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
      onNewGame: (mode) =>
        startNewGame(mode, { onMainMenu: () => showStartScreen() }),
      onContinue: (mode) =>
        continueGame(mode, { onMainMenu: () => showStartScreen() }),
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
  renderScreen(newGameScreen(mode, { onMainMenu: () => showStartScreen() }));
}

function continueGame(mode) {
  renderScreen(
    continueGameScreen(mode, { onMainMenu: () => showStartScreen() }),
  );
}

export { gameArea };
