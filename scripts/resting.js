const timeLeft = document.querySelector('#timeLeft');
const skipBtn = document.querySelector('#skipBtn');

window.onload = function() {
    info = this.parseQuery(window.location.search);

    let currentDate = new this.Date().getTime();
    let countDowndate = moment(currentDate).add(info.second_timeval, info.second_timeunit);

    timeLeft.textContent = countDowndate.countdown().toString();
    this.setInterval(function(){
        countdownString = countDowndate.countdown().toString();
        if (countdownString == ""){
            window.open("./working.html" + window.location.search, "_self");
        }
        else{
            timeLeft.textContent=countdownString;
        }
    },1000);
}

skipBtn.onclick = function () {
    window.location.assign("./working.html" + window.location.search);
    return false;
}
