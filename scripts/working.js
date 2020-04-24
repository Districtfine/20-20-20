import * as common from "./common.js";

const activity = document.querySelector("#activity");
// const dialog = document.querySelector("dialog");


// document.querySelector("#closeDialog").onclick = function() {
//     dialog.close();
// };

window.onload = function() {
    common.registerButtons("./resting.html");
    //dialogPolyfill.registerDialog(dialog);

    let info = common.parseQuery(window.location.search);


    if (info.activity.length === 0) {
        activity.textContent = "look away from your screen";
    }
    else {
        activity.textContent = info.activity.replace(/\+/g, " ");
    }

    let notificationText = "Time to " + activity.textContent;
    let notificationTitle = "Interval Complete";
    common.handleCountdown(notificationTitle, notificationText, "./resting.html", info);
};
