import * as common from "./common.js";

window.onload = function() {
    common.registerButtons("./working.html");

    let info = common.parseQuery(window.location.search);

    let notificationTitle ="Interval Complete";
    common.handleCountdown(notificationTitle,"", "./working.html", info);
};
