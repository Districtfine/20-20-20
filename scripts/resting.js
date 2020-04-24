import * as common from "./common.js";

// const dialog = document.querySelector("dialog");

window.onload = function() {
    common.registerButtons("./working.html");
    //dialogPolyfill.registerDialog(dialog);

    let info = common.parseQuery(window.location.search);

    let notificationTitle ="Interval Complete";
    common.handleCountdown(notificationTitle,"", "./working.html", info);
};
