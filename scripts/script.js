
function parseQuery(queryString) {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}

const timeLeft = document.querySelector('#timeLeft')
const activity = document.querySelector('#activity')

window.onload = function() {
    info = this.parseQuery(window.location.search);

    let currentDate = new this.Date().getTime();
    let countDowndate = moment(currentDate).add(info.first_timeval, info.first_timeunit);

    activity.textContent = info.activity.replace(/\+/g, ' ')

    timeLeft.textContent = countDowndate.countdown().toString()
    this.setInterval(function(){
        timeLeft.textContent = countDowndate.countdown().toString()
    },1000)
}
