import * as common from "./common.js";

function selectElement(id, valueToSelect) {
    let element = document.getElementById(id);
    element.value = valueToSelect;
}

window.onload = function () {
    if (window.location.search.length !== 0) {
        let info = common.parseQuery(window.location.search);

        selectElement("first_timeunit", info.first_timeunit);
        selectElement("first_timeval", info.first_timeval);
        selectElement("second_timeunit", info.second_timeunit);
        selectElement("second_timeval", info.second_timeval);
    }
};
