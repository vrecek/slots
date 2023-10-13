import Game from "./Game.js"


const handle: HTMLElement = document.querySelector('div.handle') as HTMLElement,
      GAME: Game = new Game()


handle.onclick = async (): Promise<void> => {
    await GAME.rollHandler(handle)
    console.log('rolled')
}

GAME.initHandle(handle)
GAME.initDivs()