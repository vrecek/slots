import Game from "./Game.js";
const handle = document.querySelector('div.handle'), GAME = new Game();
handle.onclick = async () => {
    const shouldContinue = await GAME.rollHandler(handle);
    if (!shouldContinue)
        return;
    const score = GAME.getCurrentScore();
    const newMoney = GAME.calculateRoundResult(score);
    GAME.resultPopup(newMoney);
    GAME.updateStatistics();
};
GAME.initHandle(handle);
GAME.initBets();
GAME.initDivs();
GAME.initMoney();
