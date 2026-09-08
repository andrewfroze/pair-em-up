import { startScreenContainer } from "./start-screen";

const gameArea = document.createElement("div");
document.body.append(gameArea);

gameArea.append(startScreenContainer);

export { gameArea };
