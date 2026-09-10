import "../styles/main.scss";
import { applyTheme, loadSettings } from "./components/settings";
import { startScreenContainer } from "./start-screen";

loadSettings();
applyTheme();
const gameArea = document.createElement("div");
gameArea.className = "game-area";
document.body.append(gameArea);

gameArea.append(startScreenContainer);

export { gameArea };
