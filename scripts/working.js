import * as common from "./common.js";

// Globals
const intervalLabel = document.querySelector("#currentInterval");
const timer = document.querySelector("#timeLeft");
const info = common.parseQuery(window.location.search);

let isPaused = false,
    workingInterval = true,
    currIntervalID = null,
    currTimeLeft = moment(new Date().getTime()).add(info.first_timeval, info.first_timeunit);


window.onload = function () {
    intervalLabel.textContent = "Working Interval";

    let notificationTitle = "Interval Complete";
    registerButtons();

    let countdownDate = moment(new Date().getTime()).add(info.first_timeval, info.first_timeunit);
    currIntervalID = startCountdown(notificationTitle, "Next interval started", countdownDate);
};

function skip() {
    let countdownDate = moment(new Date().getTime()).add(info.second_timeval, info.second_timeunit);
    if (workingInterval) {
        workingInterval = false;
        intervalLabel.textContent = "Resting Interval";
    } else {
        workingInterval = true;
        intervalLabel.textContent = "Working Interval";
        countdownDate = moment(new Date().getTime()).add(info.first_timeval, info.first_timeunit);
    }

    let notificationTitle = "Interval Complete";
    currIntervalID = startCountdown(notificationTitle, "Next interval started", countdownDate);
    return false;
}

function pause(button) {
    if (isPaused) {
        isPaused = false;
        let notificationTitle = "Interval Complete";
        currIntervalID = startCountdown(notificationTitle, "Next interval started",
            moment(new Date().getTime()).add(currTimeLeft));
        button.textContent = "pause";
    }
    else {
        isPaused = true;
        clearInterval(currIntervalID);
        button.textContent = "resume";
    }
}

function registerButtons() {
    const skipBtns = document.querySelectorAll(".skipBtn");
    const stopBtns = document.querySelectorAll(".stopBtn");
    const pauseBtns = document.querySelectorAll(".pauseBtn");

    for (let button of skipBtns) {
        button.addEventListener("click", skip);
    }
    for (let button of stopBtns) {
        button.addEventListener("click", function () {
            window.location.assign("./index.html" + window.location.search);
            return false;
        });
    }
    for (let button of pauseBtns) {
        button.addEventListener("click", () => pause(button));
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
    skip();
}

function startCountdown(notificationTitle, notificationText, countdownDate) {
    clearInterval(currIntervalID); // Remove any currently running countdowns

    timer.textContent = formatTimeDisplay(countdownDate);
    let intervalID = setInterval(function () {
        currTimeLeft = countdownDate.diff(moment(new Date().getTime()));
        timer.textContent = formatTimeDisplay(countdownDate);
        if (countdownDate.countdown().toString() == "") {
            // Send user a notification that the timer is done
            let notification = new Notification(notificationTitle, { body: notificationText });
            notification.addEventListener("click", handleNotificationResponse);
            notification.addEventListener("close", handleNotificationResponse);

            // Start a dialog that the user acknowledges to move forward
            document.querySelector("audio").play();
            clearInterval(intervalID);
        }
    }, 1000);

    return intervalID;
}
