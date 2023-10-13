import Game from "./Game.js"


const handle: HTMLElement = document.querySelector('div.handle') as HTMLElement,
      GAME: Game = new Game()


handle.onclick = async (): Promise<void> => {
    const shouldConinue: boolean = await GAME.rollHandler(handle)

    if (!shouldConinue)
        return

        
    const score = GAME.getCurrentScore()
    GAME.calculateRoundResult(score)

    GAME.updateStatistics()
}

GAME.initHandle(handle)
GAME.initBets()
GAME.initDivs()
GAME.initMoney()