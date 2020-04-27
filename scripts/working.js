import * as common from "./common.js";

class Timer {
    full_dash_array = 283;
    warning_threshold = 10;
    alert_threshold = 5;
    currIntervalID = null;

    constructor(workingTimeVal, workingTimeUnit, restingTimeVal, restingTimeUnit, workingInterval) {
        this.workingTimeval = workingTimeVal;
        this.workingTimeUnit = workingTimeUnit;
        this.restingTimeVal = restingTimeVal;
        this.restingTimeUnit = restingTimeUnit;
        this.workingInterval = workingInterval;
        this.notificationTitle = "Interval Complete";
        this.notificationBody = "Next interval started";
        this.isPaused = false;
        if (this.workingInterval) {
            this.currTimeLeft = moment(new Date().getTime()).add(this.workingTimeval, this.workingTimeUnit).diff(moment(new Date().getTime()));
        }
        else {
            this.currTimeLeft = moment(new Date().getTime()).add(this.workingTimeval, this.workingTimeUnit).diff(moment(new Date().getTime()));
        }
        this.initialTimeLeft = this.currTimeLeft;
    }

    formatTimeDisplay(countdownDate) {
        const { hours, minutes, seconds } = countdownDate.countdown();
        return `${hours.toString().padStart(2, "0")}:\
${minutes.toString().padStart(2, "0")}:\
${seconds.toString().padStart(2, "0")}`;
    }

    tickCounter(countdownDate) {
        this.currTimeLeft = countdownDate.diff(moment(new Date().getTime()));
        this.setCircleDasharray(this.currTimeLeft);
        timeDisplay.textContent = this.formatTimeDisplay(countdownDate);
        if (countdownDate.countdown().toString() == "") {
            this.setCircleDasharray(0);
            // Send user a notification that the timer is done
            let notification = new Notification(this.notificationTitle, { body: this.notificationBody });
            notification.addEventListener("show", () => this.handleNotificationResponse());

            // Sleep for a second to allow timer to run out

            // Start a dialog that the user acknowledges to move forward
            document.querySelector("audio").play();
            clearInterval(this.currIntervalID);
        }
    }

    startCountdown() {
        clearInterval(this.currIntervalID);
        let countdownDate = moment(new Date().getTime()).add(this.currTimeLeft);

        timeDisplay.textContent = this.formatTimeDisplay(countdownDate);
        this.currIntervalID = setInterval(() => this.tickCounter(countdownDate), 500);
    }

    togglePause(button) {
        if (this.isPaused) {
            this.isPaused = false;
            this.startCountdown();
            button.innerHTML = `<i class="material-icons">pause</i>`;
        }
        else {
            this.isPaused = true;
            clearInterval(this.currIntervalID);
            button.innerHTML = `<i class="material-icons">play_arrow</i>`;
        }
    }

    skip() {
        timerLine.setAttribute("transition", "0s linear all");
        this.setCircleDasharray(this.initialTimeLeft);
        timerLine.setAttribute("transition", "1s linear all");
        // Return pause buttons to unpaused state
        const pauseBtns = document.querySelectorAll(".pauseBtn");
        for (let button of pauseBtns) {
            button.innerHTML = `<i class="material-icons">pause</i>`;
            this.isPaused = false;
        }

        if (this.workingInterval) {
            this.workingInterval = false;
            intervalLabel.textContent = "Resting Interval";
            this.currTimeLeft = moment(new Date().getTime()).add(this.restingTimeVal, this.restingTimeUnit).diff(moment(new Date().getTime()));
        } else {
            this.workingInterval = true;
            intervalLabel.textContent = "Working Interval";
            this.currTimeLeft = moment(new Date().getTime()).add(this.workingTimeval, this.workingTimeUnit).diff(moment(new Date().getTime()));
        }
        this.initialTimeLeft = this.currTimeLeft;
        this.startCountdown();

        return false;
    }

    calculateTimeFraction(timeLeft, initialTimeLeft) {
        const rawTimeFraction = timeLeft / initialTimeLeft;
        return rawTimeFraction - (1 / initialTimeLeft) * (1 - rawTimeFraction);
    }

    handleNotificationResponse() {
        this.isPaused = false;
        setTimeout(() => this.skip(), 2500);
    }

    setCircleDasharray(timeLeft) {
        const circleDasharray = `${(
            this.calculateTimeFraction(timeLeft, this.initialTimeLeft) * this.full_dash_array
        ).toFixed(0)} 283`;
        timerLine.setAttribute("stroke-dasharray", circleDasharray);
    }
}

// Globals
const intervalLabel = document.querySelector("#current-interval");
const timeDisplay = document.querySelector("#time-left-display");
const timerLine = document.getElementById("path-remaining");
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
