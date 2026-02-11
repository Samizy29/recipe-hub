export class CookingTimer {
    constructor(container) {
        this.container = container;
        this.timer = null;
        this.timeLeft = 0;
        this.isRunning = false;
    }

    render() {
        this.container.innerHTML = `
            <div class="cooking-timer">
                <h3>Cooking Timer</h3>
                <div class="timer-display">${this.formatTime(this.timeLeft)}</div>
                <div class="timer-controls">
                    <input type="number" id="timer-minutes" placeholder="Minutes" min="1" max="120">
                    <button id="start-timer" ${this.isRunning ? 'disabled' : ''}>Start</button>
                    <button id="pause-timer" ${!this.isRunning ? 'disabled' : ''}>Pause</button>
                    <button id="reset-timer">Reset</button>
                </div>
                <div class="timer-presets">
                    <button data-minutes="5">5 min</button>
                    <button data-minutes="10">10 min</button>
                    <button data-minutes="15">15 min</button>
                    <button data-minutes="30">30 min</button>
                </div>
            </div>
        `;

        this.attachEvents();
    }

    attachEvents() {
        const startBtn = this.container.querySelector('#start-timer');
        const pauseBtn = this.container.querySelector('#pause-timer');
        const resetBtn = this.container.querySelector('#reset-timer');
        const minutesInput = this.container.querySelector('#timer-minutes');

        startBtn?.addEventListener('click', () => {
            const minutes = parseInt(minutesInput.value) || 0;
            if (minutes > 0 && !this.isRunning) {
                this.timeLeft = minutes * 60;
                this.start();
            }
        });

        pauseBtn?.addEventListener('click', () => this.pause());
        resetBtn?.addEventListener('click', () => this.reset());

        this.container.querySelectorAll('.timer-presets button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const minutes = parseInt(e.target.dataset.minutes);
                this.timeLeft = minutes * 60;
                this.updateDisplay();
            });
        });
    }

    start() {
        this.isRunning = true;
        this.updateControls();
        
        this.timer = setInterval(() => {
            if (this.timeLeft <= 0) {
                this.complete();
                return;
            }
            this.timeLeft--;
            this.updateDisplay();
        }, 1000);
    }

    pause() {
        this.isRunning = false;
        clearInterval(this.timer);
        this.updateControls();
    }

    reset() {
        this.pause();
        this.timeLeft = 0;
        this.updateDisplay();
        this.updateControls();
    }

    complete() {
        this.pause();
        this.timeLeft = 0;
        this.updateDisplay();
        alert('Timer complete! ⏰');
    }

    updateDisplay() {
        const display = this.container.querySelector('.timer-display');
        if (display) {
            display.textContent = this.formatTime(this.timeLeft);
        }
    }

    updateControls() {
        const startBtn = this.container.querySelector('#start-timer');
        const pauseBtn = this.container.querySelector('#pause-timer');
        
        if (startBtn) startBtn.disabled = this.isRunning;
        if (pauseBtn) pauseBtn.disabled = !this.isRunning;
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}