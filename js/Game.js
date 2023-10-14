class Game {
    imgs;
    possibleBets;
    currentBet;
    currentResult;
    money;
    canRoll;
    constructor() {
        this.imgs = [
            "./images/img0.png",
            "./images/img1.png",
            "./images/img2.png",
            "./images/img3.png",
            "./images/img4.png",
            "./images/img5.png",
        ];
        this.possibleBets = [100, 500, 1000];
        this.currentBet = 0;
        this.currentResult = [];
        this.money = 1000;
        this.canRoll = true;
    }
    async sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }
    getResultValue(score) {
        switch (score) {
            case "0": return 10; // seven
            case "1": return 5; // coin
            case "2": return 1.75; // cherry
            case "3": return 1.5; // banana
            case "4": return 1.25; // zombie
            case "5": return 2; // dog
            default: return 0;
        }
    }
    async rollHandler(handle) {
        if (!this.canRoll || !this.currentBet || this.money < this.currentBet)
            return false;
        this.canRoll = false;
        document.querySelector('div.roll-result')?.remove();
        // Click animation
        const handleImg = handle.children[0];
        handleImg.style.transform = 'rotateX(-180deg)';
        setTimeout(() => handleImg.style.transform = 'rotateX(0deg)', 200);
        const wrapper = document.querySelector('section.result-wrapper');
        const MS = 50;
        // One loop = MS + MS / 2 (ms = 50, loop = 75ms)
        for (let i = 0; i < 15; i++) {
            this.currentResult = [];
            wrapper.style.transition = `${MS}ms`;
            const section = document.createElement('section');
            section.className = 'result';
            // Append a random image to each div
            for (let i = 0; i < 3; i++) {
                const div = document.createElement('div'), img = document.createElement('img'), src = this.imgs[Math.floor(Math.random() * this.imgs.length)];
                img.src = src;
                div.appendChild(img);
                section.appendChild(div);
                this.currentResult.push(src);
            }
            wrapper.appendChild(section);
            // Make a rolling animation
            wrapper.style.transform = `translateY(-${100}%)`;
            // Use the sleep() func to correctly display the animation
            await this.sleep(MS);
            // After some time, delete the first image set
            // and roll back to the starting position, repeat
            wrapper.style.transition = `0ms`;
            wrapper.style.transform = `translateY(0)`;
            wrapper.children[0].remove();
            await this.sleep(MS / 2);
        }
        this.canRoll = true;
        return true;
    }
    resultPopup(newMoney) {
        const div = document.createElement('div'), hasWon = newMoney > 0;
        div.className = `roll-result ${hasWon ? 'green' : 'red'}`;
        div.textContent = `${hasWon ? `+${newMoney}` : newMoney}$`;
        document.body.appendChild(div);
        setTimeout(() => div?.remove(), 2000);
    }
    calculateRoundResult(score) {
        const scores = {};
        // Count the duplicates
        for (const val of score)
            scores[val] ? scores[val]++ : scores[val] = 1;
        // Search and return if the value is greater than 1
        const winValue = Object.entries(scores).filter(x => x[1] > 1)?.[0] ?? null;
        let moneyUpdate = -this.currentBet;
        if (winValue) {
            // Get the "image's power"
            const power = this.getResultValue(winValue[0]);
            // Calculate the earned money
            moneyUpdate = Math.trunc((winValue[1] + power) * (this.currentBet / 2));
        }
        this.money += moneyUpdate;
        return moneyUpdate;
    }
    getCurrentScore() {
        // Converts image paths to a value (img4 = 4, img3 = 3, etc...)
        const nums = this.currentResult.map(x => parseInt(x.slice(x.indexOf('img') + 3, x.lastIndexOf('.'))));
        return nums;
    }
    initHandle(handle) {
        const img = document.createElement('img');
        img.src = './images/handle.png';
        handle.appendChild(img);
    }
    initDivs() {
        const initResult = [...document.querySelector('section.result').children];
        for (const [num, div] of Object.entries(initResult)) {
            const img = document.createElement('img');
            img.src = `./images/img${num}.png`;
            div.appendChild(img);
        }
    }
    initBets() {
        const bets = [...document.querySelector('article.bet-article').children], betSpans = [...document.querySelectorAll('article.bet-article span')];
        for (const [i, bet] of Object.entries(bets)) {
            const betMoney = this.possibleBets[parseInt(i)], [para, span] = [...bet.children];
            para.textContent = `${betMoney}$`;
            span.onclick = () => {
                if (!this.canRoll)
                    return;
                for (const activeSpan of betSpans)
                    activeSpan.className = '';
                span.className = 'active';
                this.currentBet = betMoney;
            };
        }
    }
    initMoney() {
        const moneyCont = document.querySelector('h1 span');
        moneyCont.textContent = `${this.money}$`;
    }
    updateStatistics() {
        const moneyContainer = document.querySelector('h1').children[0];
        moneyContainer.textContent = `${this.money}$`;
    }
}
export default Game;
