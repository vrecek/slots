import Game from "./Game.js"


const handle: HTMLElement = document.querySelector('div.handle') as HTMLElement,
      GAME: Game = new Game()


handle.onclick = async (): Promise<void> => {
    const shouldContinue: boolean = await GAME.rollHandler(handle)

    if (!shouldContinue)
        return


    const score: number[] = GAME.getCurrentScore()
    const newMoney: number = GAME.calculateRoundResult(score)

    GAME.resultPopup(newMoney)

    GAME.updateStatistics()
}

GAME.initHandle(handle)
GAME.initBets()
GAME.initDivs()
GAME.initMoney()