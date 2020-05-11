"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function selectElement(id, valueToSelect) {
    var element = document.getElementById(id);
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
            Notification.requestPermission().then(function (permission) {
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

var Timer = function () {
    function Timer(timerSettings, timerElements, isWorkingInterval) {
        _classCallCheck(this, Timer);

        this.full_dash_array = 283;
        this.warning_threshold = 10;
        this.alert_threshold = 5;
        this.currIntervalID = null;

        this.timerElements = timerElements;
        this.update_settings(timerSettings, isWorkingInterval);

        this.notificationTitle = "Interval Complete";
        this.notificationBody = "Next interval started";
        this.isFinished = false;
        this.isPaused = false;
    }

    _createClass(Timer, [{
        key: "update_settings",
        value: function update_settings(timerSettings, isWorkingInterval) {
            this.timerSettings = timerSettings;
            this.isWorkingInterval = isWorkingInterval;
            if (this.isWorkingInterval) {
                this.timerElements.intervalLabel.textContent = "Working Interval";
                this.currTimeLeft = moment(new Date().getTime()).add(this.timerSettings.working_timeVal, this.timerSettings.working_timeUnit).diff(moment(new Date().getTime()));
            } else {
                this.timerElements.intervalLabel.textContent = "Resting Interval";
                this.currTimeLeft = moment(new Date().getTime()).add(this.timerSettings.resting_timeVal, this.timerSettings.resting_timeUnit).diff(moment(new Date().getTime()));
            }
            this.initialTimeLeft = this.currTimeLeft;
        }
    }, {
        key: "formatTimeDisplay",
        value: function formatTimeDisplay(countdownDate) {
            var _countdownDate$countd = countdownDate.countdown(),
                hours = _countdownDate$countd.hours,
                minutes = _countdownDate$countd.minutes,
                seconds = _countdownDate$countd.seconds;

            return hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0");
        }
    }, {
        key: "tickCounter",
        value: function tickCounter(countdownDate) {
            var _this = this;

            this.currTimeLeft = countdownDate.diff(moment(new Date().getTime()));
            this.setCircleDasharray(this.currTimeLeft);
            this.timerElements.timeDisplay.textContent = this.formatTimeDisplay(countdownDate);
            if (countdownDate.countdown().toString() == "") {
                this.setCircleDasharray(0);
                document.querySelector("audio").play();
                if (checkNotificationPromise()) {
                    // Send user a notification that the timer is done
                    var notification = new Notification(this.notificationTitle, { body: this.notificationBody });
                    notification.addEventListener("show", function () {
                        return _this.handleNotificationResponse(2000);
                    });
                }

                this.isFinished = true;
                // Start a dialog that the user acknowledges to move forward
                clearInterval(this.currIntervalID);
            }
        }
    }, {
        key: "startCountdown",
        value: function startCountdown() {
            var _this2 = this;

            clearInterval(this.currIntervalID);
            var countdownDate = moment(new Date().getTime()).add(this.currTimeLeft);

            this.timerElements.timeDisplay.textContent = this.formatTimeDisplay(countdownDate);
            this.currIntervalID = setInterval(function () {
                return _this2.tickCounter(countdownDate);
            }, 500);
        }
    }, {
        key: "togglePause",
        value: function togglePause(button) {
            if (this.isFinished) {
                if (!checkNotificationPromise()) {
                    this.handleNotificationResponse(0);
                }
            } else {
                if (this.isPaused) {
                    this.isPaused = false;
                    this.startCountdown();
                    button.innerHTML = "<i class=\"material-icons\">pause</i>";
                } else {
                    this.isPaused = true;
                    clearInterval(this.currIntervalID);
                    button.innerHTML = "<i class=\"material-icons\">play_arrow</i>";
                }
            }
        }
    }, {
        key: "stop",
        value: function stop() {
            clearInterval(this.currIntervalID);
            // Return pause buttons to unpaused state
            var pauseBtns = document.querySelectorAll(".pauseBtn");
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = pauseBtns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var button = _step.value;

                    button.innerHTML = "<i class=\"material-icons\">pause</i>";
                    this.isPaused = false;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this.setCircleDasharray(this.initialTimeLeft);
        }
    }, {
        key: "skip",
        value: function skip() {
            clearInterval(this.currIntervalID);
            this.isFinished = false;
            this.setCircleDasharray(this.initialTimeLeft);
            // Return pause buttons to unpaused state
            var pauseBtns = document.querySelectorAll(".pauseBtn");
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = pauseBtns[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var button = _step2.value;

                    button.innerHTML = "<i class=\"material-icons\">pause</i>";
                    this.isPaused = false;
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            if (this.isWorkingInterval) {
                this.isWorkingInterval = false;
                this.timerElements.intervalLabel.textContent = "Resting Interval";
                this.currTimeLeft = moment(new Date().getTime()).add(this.timerSettings.resting_timeVal, this.timerSettings.resting_timeUnit).diff(moment(new Date().getTime()));
            } else {
                this.isWorkingInterval = true;
                this.timerElements.intervalLabel.textContent = "Working Interval";
                this.currTimeLeft = moment(new Date().getTime()).add(this.timerSettings.working_timeVal, this.timerSettings.working_timeUnit).diff(moment(new Date().getTime()));
            }
            this.initialTimeLeft = this.currTimeLeft;
            this.startCountdown();

            return false;
        }
    }, {
        key: "calculateTimeFraction",
        value: function calculateTimeFraction(timeLeft, initialTimeLeft) {
            var rawTimeFraction = timeLeft / initialTimeLeft;
            return rawTimeFraction - 1 / initialTimeLeft * (1 - rawTimeFraction);
        }
    }, {
        key: "handleNotificationResponse",
        value: function handleNotificationResponse(delay) {
            var _this3 = this;

            this.isPaused = false;
            setTimeout(function () {
                return _this3.skip();
            }, delay);
        }
    }, {
        key: "setCircleDasharray",
        value: function setCircleDasharray(timeLeft) {
            var circleDasharray = (this.calculateTimeFraction(timeLeft, this.initialTimeLeft) * this.full_dash_array).toFixed(0) + " 283";
            this.timerElements.timerLine.setAttribute("stroke-dasharray", circleDasharray);
        }
    }]);

    return Timer;
}();

// Globals


var timerElements = {
    intervalLabel: document.querySelector("#current-interval"),
    timeDisplay: document.querySelector("#time-left-display"),
    timerLine: document.getElementById("path-remaining")
};

var defaultTimerSettings = {
    working_timeVal: "20",
    working_timeUnit: "minutes",
    resting_timeVal: "20",
    resting_timeUnit: "seconds"
};

var timer = new Timer(defaultTimerSettings, timerElements, true);
window.onload = function () {
    askNotificationPermission();

    registerButtons();
};

function setFormVisiblity(isFormVisible) {
    var form = document.getElementById("time-selector");
    var startBtn = document.getElementById("start");
    var timerElem = document.getElementById("base-timer");
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

    var timerSettings = {
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
    var skipBtns = document.querySelectorAll(".skipBtn");
    var stopBtns = document.querySelectorAll(".stopBtn");
    var pauseBtns = document.querySelectorAll(".pauseBtn");
    var startBtn = document.getElementById("start");

    startBtn.addEventListener("click", startTimer);

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = skipBtns[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var button = _step3.value;

            button.addEventListener("click", function () {
                return timer.skip();
            });
        }
    } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
            }
        } finally {
            if (_didIteratorError3) {
                throw _iteratorError3;
            }
        }
    }

    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
        for (var _iterator4 = stopBtns[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var _button = _step4.value;

            _button.addEventListener("click", stopTimer);
        }
    } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
            }
        } finally {
            if (_didIteratorError4) {
                throw _iteratorError4;
            }
        }
    }

    var _loop = function _loop(_button2) {
        _button2.addEventListener("click", function () {
            return timer.togglePause(_button2);
        });
    };

    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
        for (var _iterator5 = pauseBtns[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var _button2 = _step5.value;

            _loop(_button2);
        }
    } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
            }
        } finally {
            if (_didIteratorError5) {
                throw _iteratorError5;
            }
        }
    }
}