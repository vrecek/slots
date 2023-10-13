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
            "../images/img2.png"
        ]

        this.possibleBets = [10, 50, 100]
        this.currentBet = 0
        this.currentResult = []

        this.money = 1000
        this.canRoll = true
    }



    private async sleep(ms: number): Promise<void> {
        return new Promise(r => setTimeout(r, ms))
    }



    public async rollHandler(handle: HTMLElement): Promise<boolean> {
        if (!this.canRoll || !this.currentBet || this.money < this.currentBet)
            return false

        this.canRoll = false

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

    public calculateRoundResult(score: number[]): void {
        console.log(score)
        this.money -= 50
    }

    public getCurrentScore(): number[] {
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