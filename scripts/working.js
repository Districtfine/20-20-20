const timeLeft = document.querySelector('#timeLeft');
const activity = document.querySelector('#activity');
const skipBtn = document.querySelector('#skipBtn');

window.onload = function() {
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
    this.setInterval(function(){
        countdownString = countDowndate.countdown().toString();
        if (countdownString == ""){
            window.location.assign("./resting.html" + window.location.search);
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
