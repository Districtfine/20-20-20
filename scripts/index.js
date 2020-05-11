function selectElement(id, valueToSelect) {
    let element = document.getElementById(id);
    element.value = valueToSelect;
}

// From https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API
function askNotificationPermission() {
    // function to actually ask the permissions
    function handlePermission(permission) {
        // Whatever the user answers, we make sure Chrome stores the information
        if (!("permission" in Notification)) {
            Notification.permission = permission;
        }
    }

    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        console.log("This browser does not support notifications.");
    }
    else {
        if (checkNotificationPromise()) {
            Notification.requestPermission()
                .then((permission) => {
                    handlePermission(permission);
                });
        }
        else {
            Notification.requestPermission(function (permission) {
                handlePermission(permission);
            });
        }
    }
}

function checkNotificationPromise() {
    try {
        Notification.requestPermission().then();
    } catch (e) {
        return false;
    }

    return true;
}

class Timer {
    full_dash_array = 283;
    warning_threshold = 10;
    alert_threshold = 5;
    currIntervalID = null;

    constructor(timerSettings, timerElements, isWorkingInterval) {
        this.timerElements = timerElements;
        this.update_settings(timerSettings, isWorkingInterval);

        this.notificationTitle = "Interval Complete";
        this.notificationBody = "Next interval started";
        this.isFinished = false;
        this.isPaused = false;
    }

    update_settings(timerSettings, isWorkingInterval) {
        this.timerSettings = timerSettings;
        this.isWorkingInterval = isWorkingInterval;
        if (this.isWorkingInterval) {
            this.timerElements.intervalLabel.textContent = "Working Interval";
            this.currTimeLeft = moment(new Date().getTime()).add(this.timerSettings.working_timeVal,
                this.timerSettings.working_timeUnit).diff(moment(new Date().getTime()));
        }
        else {
            this.timerElements.intervalLabel.textContent = "Resting Interval";
            this.currTimeLeft = moment(new Date().getTime()).add(this.timerSettings.resting_timeVal,
                this.timerSettings.resting_timeUnit).diff(moment(new Date().getTime()));
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
        this.timerElements.timeDisplay.textContent = this.formatTimeDisplay(countdownDate);
        if (countdownDate.countdown().toString() == "") {
            this.setCircleDasharray(0);
            document.querySelector("audio").play();
            if (checkNotificationPromise()) {
                // Send user a notification that the timer is done
                let notification = new Notification(this.notificationTitle,
                    { body: this.notificationBody });
                notification.addEventListener("show", () => this.handleNotificationResponse(2000));
            }

            this.isFinished = true;
            // Start a dialog that the user acknowledges to move forward
            clearInterval(this.currIntervalID);
        }
    }

    startCountdown() {
        clearInterval(this.currIntervalID);
        let countdownDate = moment(new Date().getTime()).add(this.currTimeLeft);

        this.timerElements.timeDisplay.textContent = this.formatTimeDisplay(countdownDate);
        this.currIntervalID = setInterval(() => this.tickCounter(countdownDate), 500);
    }

    togglePause(button) {
        if (this.isFinished) {
            if (!checkNotificationPromise()) {
                this.handleNotificationResponse(0);
            }
        }
        else {
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
    }

    stop() {
        clearInterval(this.currIntervalID);
        // Return pause buttons to unpaused state
        const pauseBtns = document.querySelectorAll(".pauseBtn");
        for (let button of pauseBtns) {
            button.innerHTML = `<i class="material-icons">pause</i>`;
            this.isPaused = false;
        }
        this.setCircleDasharray(this.initialTimeLeft);
    }

    skip() {
        clearInterval(this.currIntervalID);
        this.isFinished = false;
        this.setCircleDasharray(this.initialTimeLeft);
        // Return pause buttons to unpaused state
        const pauseBtns = document.querySelectorAll(".pauseBtn");
        for (let button of pauseBtns) {
            button.innerHTML = `<i class="material-icons">pause</i>`;
            this.isPaused = false;
        }

        if (this.isWorkingInterval) {
            this.isWorkingInterval = false;
            this.timerElements.intervalLabel.textContent = "Resting Interval";
            this.currTimeLeft = moment(new Date().getTime()).add(this.timerSettings.resting_timeVal,
                this.timerSettings.resting_timeUnit).diff(moment(new Date().getTime()));
        } else {
            this.isWorkingInterval = true;
            this.timerElements.intervalLabel.textContent = "Working Interval";
            this.currTimeLeft = moment(new Date().getTime()).add(this.timerSettings.working_timeVal,
                this.timerSettings.working_timeUnit).diff(moment(new Date().getTime()));
        }
        this.initialTimeLeft = this.currTimeLeft;
        this.startCountdown();

        return false;
    }

    calculateTimeFraction(timeLeft, initialTimeLeft) {
        const rawTimeFraction = timeLeft / initialTimeLeft;
        return rawTimeFraction - (1 / initialTimeLeft) * (1 - rawTimeFraction);
    }

    handleNotificationResponse(delay) {
        this.isPaused = false;
        setTimeout(() => this.skip(), delay);
    }

    setCircleDasharray(timeLeft) {
        const circleDasharray = `${(
            this.calculateTimeFraction(timeLeft, this.initialTimeLeft) * this.full_dash_array
        ).toFixed(0)} 283`;
        this.timerElements.timerLine.setAttribute("stroke-dasharray", circleDasharray);
    }
}

// Globals
let timerElements = {
    intervalLabel: document.querySelector("#current-interval"),
    timeDisplay: document.querySelector("#time-left-display"),
    timerLine: document.getElementById("path-remaining")
};

const defaultTimerSettings = {
    working_timeVal: "20",
    working_timeUnit: "minutes",
    resting_timeVal: "20",
    resting_timeUnit: "seconds"
};

let timer = new Timer(defaultTimerSettings, timerElements, true);
window.onload = function () {
    askNotificationPermission();

    registerButtons();
};

function setFormVisiblity(isFormVisible) {
    const form = document.getElementById("time-selector");
    const startBtn = document.getElementById("start");
    const timerElem = document.getElementById("base-timer");
    if (isFormVisible) {
        timerElem.setAttribute("hidden", " ");
        startBtn.removeAttribute("hidden");
        form.removeAttribute("hidden");
    }
    else {
        timerElem.removeAttribute("hidden");
        startBtn.setAttribute("hidden", " ");
        form.setAttribute("hidden", " ");
    }
}

function startTimer(event) {
    setFormVisiblity(false);

    let timerSettings = {
        working_timeVal: document.getElementById("working_timeVal").value,
        working_timeUnit: document.getElementById("working_timeUnit").value,
        resting_timeVal: document.getElementById("resting_timeVal").value,
        resting_timeUnit: document.getElementById("resting_timeUnit").value
    };

    timer.update_settings(timerSettings, true);

    timer.startCountdown();

    event.preventDefault();
}


function stopTimer() {
    setFormVisiblity(true);

    timer.stop();
}

function registerButtons() {
    const skipBtns = document.querySelectorAll(".skipBtn");
    const stopBtns = document.querySelectorAll(".stopBtn");
    const pauseBtns = document.querySelectorAll(".pauseBtn");
    const startBtn = document.getElementById("start");

    startBtn.addEventListener("click", startTimer);

    for (let button of skipBtns) {
        button.addEventListener("click", () => timer.skip());
    }
    for (let button of stopBtns) {
        button.addEventListener("click", stopTimer);
    }
    for (let button of pauseBtns) {
        button.addEventListener("click", () => timer.togglePause(button));
    }
}
