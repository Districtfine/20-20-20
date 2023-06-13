const embedDiv = document.getElementById("20-20-20-timer-embed");

function createEmbedElements() {
  let content =
    '<audio> <source src="https://districtfine.github.io/20-20-20/media/alarm.mp3" /> <source src="https://districtfine.github.io/20-20-20/media/ogg.mp3" /> </audio> <header> <h2> <u>20-20-20 Interval Timer</u> </h2> <div id="time-selector"> Every <input type="number" id="working_timeVal" name="working_timeVal" value="20" max="120" /> <select id="working_timeUnit" name="working_timeUnit"> <option value="minutes">minutes</option> <option value="seconds">seconds</option> </select><p>look 20 feet away from your screen for</p><input type="number" id="resting_timeVal" name="resting_timeVal" value="20" max="120" /> <select id="resting_timeUnit" name="resting_timeUnit"> <option value="seconds">seconds</option> <option value="minutes">minutes</option> </select> <br /> <button id="start">Start</button> </div><div id="base-timer" hidden> <svg class="svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" > <g class="circle"> <circle class="path-elapsed" cx="50" cy="50" r="45" /> <path id="path-remaining" stroke-dasharray="283" d=" M 50,50 m -45,0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0 " ></path> </g> </svg> <span class="inside-timer"> <var id="current-interval"></var> <var id="time-left-display"></var> <span class="timer-controls"> <button class="stopBtn"> <i class="material-icons">stop</i> </button> <button class="pauseBtn"> <i class="material-icons">pause</i> </button> <button class="skipBtn"> <i class="material-icons">skip_next</i> </button> </span> </span> </div> </header><style>#start,h2,header,input,main,select{font-family:Montserrat,sans-serif}#first-para,body{margin:0}.inside-timer,.timer-controls{display:grid;grid-template-columns:1fr 1fr 1fr}#start,input,select{box-sizing:border-box}#time-selector{font-size:1.2rem;color:#fff}h2{color:#fff;font-size:2rem}body{padding:0}input{width:70px}input,select{font-size:1rem}#start{height:auto;width:auto;margin-top:20px}#base-timer,.inside-timer{width:var(--timer-width);height:var(--timer-height)}header{text-align:center;padding-top:1em;padding-bottom:1em;background-color:#172a3a}main{text-align:left;font-size:1.1rem;background-color:#fff;padding:1rem}main p{color:#000}@media (min-width:1100px){main{margin:0 21% auto}}:root{--path-time-color:#09bc8a;--timer-height:500px;--timer-width:500px}@media (max-width:500px){:root{--timer-height:100vw;--timer-width:100vw}}#base-timer{position:relative;margin:auto;font-family:"Courier Prime",monospace;color:#fff}#base-timer .circle{fill:none;stroke:none}#base-timer .path-elapsed{stroke-width:5px;stroke:white}.inside-timer{position:absolute;top:0;grid-template-rows:1fr 1fr 1fr}#current-interval{grid-column:2/3;font-size:35px;text-align:center;margin:40% auto auto}#time-left-display{font-size:48px;grid-column:2/3;margin:auto}.timer-controls{grid-column:2/3}#path-remaining{stroke-width:5px;stroke-linecap:round;transform:rotate(90deg);transform-origin:center;transition:.5s linear;stroke:currentColor;color:var(--path-time-color)}.timer-controls button{box-sizing:border-box;margin:0 auto;padding:1px;border:2px solid #fff;border-radius:20%;width:40px;height:40px;background:#172a3a;color:#fff;cursor:pointer;transition:background 250ms ease-in-out,transform 150ms;-webkit-appearance:none;-moz-appearance:none}@media (min-width:500px){.timer-controls button{margin:40% auto auto}}.timer-controls button::-moz-focus-inner{border:none}.timer-controls button:hover{background:#0053ba}svg{transform:scaleX(-1)}</style>';

  embedDiv.innerHTML = content;
}

document
  .getElementsByTagName("head")[0]
  .insertAdjacentHTML(
    "beforeend",
    '<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />'
  );

let momentScriptReady = false;
const momentScript = document.createElement("script");
momentScript.type = "text/javascript";
momentScript.onload = () => {
  momentScriptReady = true;
  if (momentScriptReady && countdownScriptReady) start();
};
momentScript.src =
  "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js";
document.head.appendChild(momentScript);

let countdownScriptReady = false;
const countdownScript = document.createElement("script");
countdownScript.type = "text/javascript";
countdownScript.onload = () => {
  countdownScriptReady = true;
  if (momentScriptReady && countdownScriptReady) start();
};
countdownScript.src =
  "https://cdnjs.cloudflare.com/ajax/libs/countdown/2.6.0/countdown.min.js";
document.head.appendChild(countdownScript);

function start() {
  createEmbedElements();

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
    } else {
      if (checkNotificationPromise()) {
        Notification.requestPermission().then((permission) => {
          handlePermission(permission);
        });
      } else {
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
        this.currTimeLeft = moment(new Date().getTime())
          .add(
            this.timerSettings.working_timeVal,
            this.timerSettings.working_timeUnit
          )
          .diff(moment(new Date().getTime()));
      } else {
        this.timerElements.intervalLabel.textContent = "Resting Interval";
        this.currTimeLeft = moment(new Date().getTime())
          .add(
            this.timerSettings.resting_timeVal,
            this.timerSettings.resting_timeUnit
          )
          .diff(moment(new Date().getTime()));
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
      this.timerElements.timeDisplay.textContent =
        this.formatTimeDisplay(countdownDate);
      if (countdownDate.countdown().toString() == "") {
        this.setCircleDasharray(0);
        document.querySelector("audio").play();
        if (checkNotificationPromise()) {
          // Send user a notification that the timer is done
          let notification = new Notification(this.notificationTitle, {
            body: this.notificationBody,
          });
          notification.addEventListener("show", () =>
            this.handleNotificationResponse(2000)
          );
        }

        this.isFinished = true;
        // Start a dialog that the user acknowledges to move forward
        clearInterval(this.currIntervalID);
      }
    }

    startCountdown() {
      clearInterval(this.currIntervalID);
      let countdownDate = moment(new Date().getTime()).add(this.currTimeLeft);

      this.timerElements.timeDisplay.textContent =
        this.formatTimeDisplay(countdownDate);
      this.currIntervalID = setInterval(
        () => this.tickCounter(countdownDate),
        500
      );
    }

    togglePause(button) {
      if (this.isFinished) {
        if (!checkNotificationPromise()) {
          this.handleNotificationResponse(0);
        }
      } else {
        if (this.isPaused) {
          this.isPaused = false;
          this.startCountdown();
          button.innerHTML = `<i class="material-icons">pause</i>`;
        } else {
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
        this.currTimeLeft = moment(new Date().getTime())
          .add(
            this.timerSettings.resting_timeVal,
            this.timerSettings.resting_timeUnit
          )
          .diff(moment(new Date().getTime()));
      } else {
        this.isWorkingInterval = true;
        this.timerElements.intervalLabel.textContent = "Working Interval";
        this.currTimeLeft = moment(new Date().getTime())
          .add(
            this.timerSettings.working_timeVal,
            this.timerSettings.working_timeUnit
          )
          .diff(moment(new Date().getTime()));
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
        this.calculateTimeFraction(timeLeft, this.initialTimeLeft) *
        this.full_dash_array
      ).toFixed(0)} 283`;
      this.timerElements.timerLine.setAttribute(
        "stroke-dasharray",
        circleDasharray
      );
    }
  }

  // Globals
  let timerElements = {
    intervalLabel: document.querySelector("#current-interval"),
    timeDisplay: document.querySelector("#time-left-display"),
    timerLine: document.getElementById("path-remaining"),
  };

  const defaultTimerSettings = {
    working_timeVal: "20",
    working_timeUnit: "minutes",
    resting_timeVal: "20",
    resting_timeUnit: "seconds",
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
    } else {
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
      resting_timeUnit: document.getElementById("resting_timeUnit").value,
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

  (function () {
    var countdown,
      moment,
      ref,
      ref1,
      slice = [].slice;
    countdown =
      (ref = typeof require === "function" ? require("countdown") : void 0) !=
      null
        ? ref
        : this.countdown;
    moment =
      (ref1 = typeof require === "function" ? require("moment") : void 0) !=
      null
        ? ref1
        : this.moment;
    moment.fn.countdown = function () {
      var args, other;
      (other = arguments[0]),
        (args = 2 <= arguments.length ? slice.call(arguments, 1) : []);
      return countdown.apply(
        null,
        [this.toDate(), moment(other).toDate()].concat(slice.call(args))
      );
    };
  }).call(this);
}
