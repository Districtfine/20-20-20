function selectElement(id, valueToSelect) {    
    let element = document.getElementById(id);
    element.value = valueToSelect;
}

window.onload = function() {
    if(window.location.search.length !== 0){
        let info = this.parseQuery(window.location.search);

        this.selectElement("first_timeunit", info.first_timeunit);
        this.selectElement("first_timeval", info.first_timeval);
        this.selectElement("second_timeunit", info.second_timeunit);
        this.selectElement("second_timeval", info.second_timeval);
    }
};

const form = document.querySelector("#timeSelector");
form.onsubmit = function () {
    askNotificationPermission();
    return true;
};
