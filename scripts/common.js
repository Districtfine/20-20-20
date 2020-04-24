// Globals
var isPaused = false;


export function parseQuery(queryString) {
    let query = {};
    let pairs = (queryString[0] === "?" ? queryString.substr(1) : queryString).split("&");
    for (let i = 0; i < pairs.length; i++) {
        let pair = pairs[i].split("=");
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || "");
    }
    return query;
}

function checkNotificationPromise() {
    try {
        Notification.requestPermission().then();
    } catch(e) {
        return false;
    }

    return true;
}

// From https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API
export function askNotificationPermission() {
    // function to actually ask the permissions
    function handlePermission(permission) {
        // Whatever the user answers, we make sure Chrome stores the information
        if(!("permission" in Notification)) {
            Notification.permission = permission;
        }
    }

    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        console.log("This browser does not support notifications.");
    } else {
        if(checkNotificationPromise()) {
            Notification.requestPermission()
                .then((permission) => {
                    handlePermission(permission);
                });
        } else {
            Notification.requestPermission(function(permission) {
                handlePermission(permission);
            });
        }
    }
}

export function registerButtons (skipTargetURL) {
    const skipBtns = document.querySelectorAll(".skipBtn");
    const stopBtns = document.querySelectorAll(".stopBtn");
    const pauseBtns = document.querySelectorAll(".pauseBtn");

    for (let button of skipBtns) {
        button.addEventListener("click", function () {
            window.location.assign(skipTargetURL + window.location.search);
            return false;
        });
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

export function handleCountdown(notificationTitle, notificationText, targetURL, info)
{
    const timeLeft = document.querySelector("#timeLeft");
    let currentDate = new Date().getTime();
    let countDowndate = moment(currentDate).add(info.first_timeval, info.first_timeunit);

    let countdownString = `${countDowndate.countdown().hours.toString().padStart(2,"0")}:${countDowndate.countdown().minutes.toString().padStart(2,"0")}:${countDowndate.countdown().seconds.toString().padStart(2,"0")}`;
    timeLeft.textContent = countdownString; 
    let interval = setInterval(function(){
        if(isPaused) { // Continually bring forward the countDowndate so that timer won't drift
            countDowndate = moment(countDowndate).add(1, "second");
        } 
        else {
            countdownString = `${countDowndate.countdown().hours.toString().padStart(2,"0")}:${countDowndate.countdown().minutes.toString().padStart(2,"0")}:${countDowndate.countdown().seconds.toString().padStart(2,"0")}`;
            timeLeft.textContent=countdownString;
            if (countDowndate.countdown().toString() == ""){
                clearInterval(interval);

                // Send user a notification that the timer is done
                let notification = new Notification(notificationTitle, {body: notificationText});
                notification.addEventListener("click", function (){
                    window.location.assign(targetURL+window.location.search);
                });
                notification.addEventListener("close", function (){
                    window.location.assign(targetURL+window.location.search);
                });

                // Start a dialog that the user acknowledges to move forward
                document.querySelector("audio").play();

            }
        }
    },1000);
}
