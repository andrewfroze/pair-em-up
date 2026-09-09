import "../styles/main.scss";
import { startScreenContainer } from "./start-screen";

const gameArea = document.createElement("div");
gameArea.className = "game-area";
document.body.append(gameArea);

gameArea.append(startScreenContainer);

export { gameArea };
