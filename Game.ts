class Game {
    private imgs: string[]
    private count: number
    private canRoll: boolean

    public constructor() {
        this.imgs = [
            "../images/img0.png",
            "../images/img1.png",
            "../images/img2.png"
        ]

        this.count = 1
        this.canRoll = true
    }



    private async sleep(ms: number): Promise<void> {
        return new Promise(r => setTimeout(r, ms))
    }



    public async rollHandler(handle: HTMLElement): Promise<void> {
        if (!this.canRoll)
            return

        this.canRoll = false

        // Click animation
        handle.style.transform = 'rotateX(-180deg)'
        setTimeout(() => handle.style.transform = 'rotateX(0deg)', 200);

        const wrapper: HTMLElement = document.querySelector('section.result-wrapper')!
        const MS: number = 50

        // One loop = MS + MS / 2 (ms = 50, loop = 75ms)
        for (let i = 0; i < 15; i++) {
            wrapper.style.transition = `${MS}ms`

            const section: HTMLElement = document.createElement('section')
            section.className = 'result'

            // Append a random image to each div
            for (let i = 0; i < 3; i++) {
                const div: HTMLElement = document.createElement('div'),
                      img: HTMLImageElement = document.createElement('img')

                img.src = this.imgs[Math.floor(Math.random() * this.imgs.length)]

                div.appendChild(img)
                section.appendChild(div)
            }

            wrapper.appendChild(section)

            // Make a rolling animation
            wrapper.style.transform = `translateY(-${100}%)`
            this.count++

            
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
}


export default Game