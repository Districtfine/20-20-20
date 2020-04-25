import * as common from "./common.js";

// Globals
let isPaused = false,
    workingInterval = true,
    currIntervalID = null;

const intervalLabel = document.querySelector("#currentInterval");
const timeLeft = document.querySelector("#timeLeft");

window.onload = function () {
    intervalLabel.textContent = "Working Interval";

    let notificationTitle = "Interval Complete";
    registerButtons();
    currIntervalID = startCountdown(notificationTitle, "");

};

function executeSkip() {
    if (workingInterval) {
        workingInterval = false;
        intervalLabel.textContent = "Resting Interval";
    } else {
        workingInterval = true;
        intervalLabel.textContent = "Working Interval";
    }
    let notificationTitle = "Interval Complete";
    currIntervalID = startCountdown(notificationTitle, "");
    return false;
}

function registerButtons() {
    const skipBtns = document.querySelectorAll(".skipBtn");
    const stopBtns = document.querySelectorAll(".stopBtn");
    const pauseBtns = document.querySelectorAll(".pauseBtn");

    for (let button of skipBtns) {
        button.addEventListener("click", executeSkip);
    }
    for (let button of stopBtns) {
        button.addEventListener("click", function () {
            window.location.assign("./index.html" + window.location.search);
            return false;
        });
    }
    for (let button of pauseBtns) {
        button.addEventListener("click", function () {
            if (isPaused) {
                isPaused = false;
                button.textContent = "pause";
            }
            else {
                isPaused = true;
                button.textContent = "resume";
            }
        });
    }
}

function formatTimeDisplay(countdownDate) {
    const { hours, minutes, seconds } = countdownDate.countdown();
    return `${hours.toString().padStart(2, "0")}:\
${minutes.toString().padStart(2, "0")}:\
${seconds.toString().padStart(2, "0")}`;
}

function handleNotificationResponse() {
    isPaused = false;
    executeSkip();
}

function startCountdown(notificationTitle, notificationText) {
    clearInterval(currIntervalID); // Remove any currently running countdowns

    const info = common.parseQuery(window.location.search);

    let currentDate = new Date().getTime();
    let countdownDate = moment(currentDate).add(info.first_timeval, info.first_timeunit);

    timeLeft.textContent = formatTimeDisplay(countdownDate);
    let intervalID = setInterval(function () {
        if (isPaused) { // Continually bring forward the countDowndate while timer paused so that timer won't drift
            countdownDate = moment(countdownDate).add(1, "second");
        }
        else {
            timeLeft.textContent = formatTimeDisplay(countdownDate);
            if (countdownDate.countdown().toString() == "") {
                isPaused = true;
                // Send user a notification that the timer is done
                let notification = new Notification(notificationTitle, { body: notificationText });
                notification.addEventListener("click", handleNotificationResponse);
                notification.addEventListener("close", handleNotificationResponse);

                // Start a dialog that the user acknowledges to move forward
                document.querySelector("audio").play();
            }
        }
    }, 1000);

    return intervalID;
}
