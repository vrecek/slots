import { ScoreCount, ScoreValue } from "./interfaces/GameTypes"

class Game {
    private imgs: string[]

    private possibleBets: number[]
    private currentBet: number
    private currentResult: string[]

    private money: number
    
    private canRoll: boolean


    public constructor() {
        this.imgs = [
            "../images/img0.png",
            "../images/img1.png",
            "../images/img2.png",
            "../images/img3.png",
            "../images/img4.png",
            "../images/img5.png",
        ]

        this.possibleBets = [100, 500, 1000]
        this.currentBet = 0
        this.currentResult = []

        this.money = 1000
        this.canRoll = true
    }



    private async sleep(ms: number): Promise<void> {
        return new Promise(r => setTimeout(r, ms))
    }

    private getResultValue(score: string): number {
        switch (score) {
            case "0": return 10 // seven
            case "1": return 5 // coin
            case "2": return 1.75 // cherry
            case "3": return 1.5 // banana
            case "4": return 1.25 // zombie
            case "5": return 2 // dog

            default: return 0
        }
    }



    public async rollHandler(handle: HTMLElement): Promise<boolean> {
        if (!this.canRoll || !this.currentBet || this.money < this.currentBet)
            return false

        this.canRoll = false

        document.querySelector('div.roll-result')?.remove()

        // Click animation
        handle.style.transform = 'rotateX(-180deg)'
        setTimeout(() => handle.style.transform = 'rotateX(0deg)', 200);

        const wrapper: HTMLElement = document.querySelector('section.result-wrapper')!
        const MS: number = 50

        // One loop = MS + MS / 2 (ms = 50, loop = 75ms)
        for (let i = 0; i < 15; i++) {
            this.currentResult = []

            wrapper.style.transition = `${MS}ms`

            const section: HTMLElement = document.createElement('section')
            section.className = 'result'

            // Append a random image to each div
            for (let i = 0; i < 3; i++) {
                const div: HTMLElement = document.createElement('div'),
                      img: HTMLImageElement = document.createElement('img'),
                      src: string = this.imgs[Math.floor(Math.random() * this.imgs.length)]

                img.src = src

                div.appendChild(img)
                section.appendChild(div)

                this.currentResult.push(src)
            }

            wrapper.appendChild(section)

            // Make a rolling animation
            wrapper.style.transform = `translateY(-${100}%)`

            
            // Use the sleep() func to correctly display the animation
            await this.sleep(MS)

            // After some time, delete the first image set
            // and roll back to the starting position, repeat
            wrapper.style.transition = `0ms`
            wrapper.style.transform = `translateY(0)`
            wrapper.children[0].remove()

            await this.sleep(MS / 2)
        }

        this.canRoll = true

        return true
    }

    public resultPopup(newMoney: number): void {
        const div = document.createElement('div'),
              hasWon: boolean = newMoney > 0

        div.className = `roll-result ${ hasWon ? 'green' : 'red' }`
        div.textContent = `${ hasWon ? `+${newMoney}` : newMoney }$`

        document.body.appendChild(div)

        setTimeout(() => div?.remove(), 2000)
    }

    public calculateRoundResult(score: number[]): number {
        const scores: ScoreCount = {}

        // Count the duplicates
        for (const val of score)
            scores[val] ? scores[val]++ : scores[val] = 1

        // Search and return if the value is greater than 1
        const winValue: ScoreValue = Object.entries(scores).filter(x => x[1] > 1)?.[0] ?? null

        let moneyUpdate: number = -this.currentBet

        if (winValue) {

            // Get the "image's power"
            const power: number = this.getResultValue(winValue[0])
            
            // Calculate the earned money
            moneyUpdate = Math.trunc((winValue[1] + power) * (this.currentBet / 2))

        }

        this.money += moneyUpdate

        return moneyUpdate
    }

    public getCurrentScore(): number[] {
        // Converts image paths to a value (img4 = 4, img3 = 3, etc...)
        const nums: number[] = this.currentResult.map(x => parseInt(x.slice( x.indexOf('img') + 3, x.lastIndexOf('.')) ))

        return nums
    }

    public initHandle(handle: HTMLElement): void {
        const img: HTMLImageElement = document.createElement('img')
        img.src = '../images/handle.png'

        handle.appendChild(img)
    }

    public initDivs(): void {
        const initResult: Element[] = [...document.querySelector('section.result')!.children]

        for (const [num, div] of Object.entries(initResult)) {
            const img: HTMLImageElement = document.createElement('img')
            img.src = `../images/img${num}.png`

            div.appendChild(img)
        }
    }

    public initBets(): void {
        const bets: Element[] = [...document.querySelector('article.bet-article')!.children],
              betSpans: Element[] = [...document.querySelectorAll('article.bet-article span')]


        for (const [i, bet] of Object.entries(bets)) {

            const betMoney: number = this.possibleBets[parseInt(i)],
                  [para, span] = [...bet.children] as HTMLElement[]
                  
            para.textContent = `${betMoney}$`

            span.onclick = (): void => {
                if (!this.canRoll)
                    return

                for (const activeSpan of betSpans)
                    activeSpan.className = ''

                span.className = 'active'

                this.currentBet = betMoney
            }

        }
    }

    public initMoney(): void {
        const moneyCont: Element = document.querySelector('h1 span')!
        
        moneyCont.textContent = `${this.money}$`
    }

    public updateStatistics(): void {
        const moneyContainer: HTMLElement = document.querySelector('h1')!.children[0] as HTMLElement

        moneyContainer.textContent = `${this.money}$`
    }
}


export default Game