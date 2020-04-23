const timeLeft = document.querySelector('#timeLeft');
const activity = document.querySelector('#activity');
const skipBtn = document.querySelector('#skipBtn');
const dialog = document.querySelector('dialog')

document.querySelector('#closeDialog').onclick = function() {
    dialog.close();
};

window.onload = function() {
    dialogPolyfill.registerDialog(dialog);

    info = this.parseQuery(window.location.search);

    let currentDate = new this.Date().getTime();
    let countDowndate = moment(currentDate).add(info.first_timeval, info.first_timeunit);

    if (info.activity.length === 0) {
        activity.textContent = "look away from your screen";
    }
    else {
        activity.textContent = info.activity.replace(/\+/g, ' ');
    }

    timeLeft.textContent = countDowndate.countdown().toString();
    let interval = this.setInterval(function(){
        countdownString = countDowndate.countdown().toString();
        if (countdownString == ""){
            clearInterval(interval);

            // Send user a notification that the timer is done
            let text = "Time to " + activity.textContent;
            let notification = new Notification('Time to rest', {body: text});

            dialog.show()

            // Start a dialog that the user acknoledges to move forward
            // window.location.assign("./resting.html" + window.location.search);
        }
        else{
            timeLeft.textContent=countdownString;
        }
    },1000)
}

skipBtn.onclick = function () {
    window.location.assign("./resting.html" + window.location.search);
    return false;
}
