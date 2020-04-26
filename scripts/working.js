import * as common from "./common.js";

class Timer {
    constructor(workingTimeVal, workingTimeUnit, restingTimeVal, restingTimeUnit, workingInterval) {
        this.workingTimeval = workingTimeVal;
        this.workingTimeUnit = workingTimeUnit;
        this.restingTimeVal = restingTimeVal;
        this.restingTimeUnit = restingTimeUnit;
        this.workingInterval = workingInterval;
        this.notificationTitle = "Interval Complete";
        this.notificationBody = "Next interval started";
        this.isPaused = false;
        this.currIntervalID = null;
        if (this.workingInterval) {
            this.currTimeLeft = moment(new Date().getTime()).add(this.workingTimeval, this.workingTimeUnit).diff(moment(new Date().getTime()));
        }
        else {
            this.currTimeLeft = moment(new Date().getTime()).add(this.workingTimeval, this.workingTimeUnit).diff(moment(new Date().getTime()));
        }
    }

    formatTimeDisplay(countdownDate) {
        const { hours, minutes, seconds } = countdownDate.countdown();
        return `${hours.toString().padStart(2, "0")}:\
${minutes.toString().padStart(2, "0")}:\
${seconds.toString().padStart(2, "0")}`;
    }

    tickCounter(countdownDate) {
        this.currTimeLeft = countdownDate.diff(moment(new Date().getTime()));
        timeDisplay.textContent = this.formatTimeDisplay(countdownDate);
        if (countdownDate.countdown().toString() == "") {
            // Send user a notification that the timer is done
            let notification = new Notification(this.notificationTitle, { body: this.notificationBody });
            notification.addEventListener("show", () => this.handleNotificationResponse());

            // Start a dialog that the user acknowledges to move forward
            document.querySelector("audio").play();
            clearInterval(this.currIntervalID);
        }
    }

    startCountdown() {
        clearInterval(this.currIntervalID);
        let countdownDate = moment(new Date().getTime()).add(this.currTimeLeft);

        timeDisplay.textContent = this.formatTimeDisplay(countdownDate);
        this.currIntervalID = setInterval(() => this.tickCounter(countdownDate), 1000);
    }

    togglePause(button) {
        if (this.isPaused) {
            this.isPaused = false;
            this.startCountdown();
            button.textContent = "pause";
        }
        else {
            this.isPaused = true;
            clearInterval(this.currIntervalID);
            button.textContent = "resume";
        }
    }

    skip() {
        // Return pause buttons to unpaused state
        const pauseBtns = document.querySelectorAll(".pauseBtn");
        for (let button of pauseBtns) {
            button.textContent = "pause";
            this.isPaused = false;
        }

        if (this.workingInterval) {
            this.workingInterval = false;
            intervalLabel.textContent = "Resting Interval";
            this.currTimeLeft = moment(new Date().getTime()).add(this.restingTimeVal, this.restingTimeUnit).diff(moment(new Date().getTime()));
            this.startCountdown();
        } else {
            this.workingInterval = true;
            intervalLabel.textContent = "Working Interval";
            this.currTimeLeft = moment(new Date().getTime()).add(this.workingTimeval, this.workingTimeUnit).diff(moment(new Date().getTime()));
            this.startCountdown();
        }

        return false;
    }

    handleNotificationResponse() {
        this.isPaused = false;
        this.skip();
    }
}

// Globals
const intervalLabel = document.querySelector("#currentInterval");
const timeDisplay = document.querySelector("#timeLeft");
const info = common.parseQuery(window.location.search);
let timer = new Timer(info.first_timeval, info.first_timeunit, info.second_timeval, info.second_timeunit, true);


window.onload = function () {
    intervalLabel.textContent = "Working Interval";

    registerButtons();

    timer.startCountdown();
};



function registerButtons() {
    const skipBtns = document.querySelectorAll(".skipBtn");
    const stopBtns = document.querySelectorAll(".stopBtn");
    const pauseBtns = document.querySelectorAll(".pauseBtn");

    for (let button of skipBtns) {
        button.addEventListener("click", () => timer.skip());
    }
    for (let button of stopBtns) {
        button.addEventListener("click", function () {
            window.location.assign("./index.html" + window.location.search);
            return false;
        });
    }
    for (let button of pauseBtns) {
        button.addEventListener("click", () => timer.togglePause(button));
    }
}
