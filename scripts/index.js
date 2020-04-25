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

const form = document.querySelector("#timeSelector");
form.onsubmit = function () {
    askNotificationPermission();
    return true;
};

// From https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API
function askNotificationPermission() {
    // function to actually ask the permissions
    function handlePermission(permission) {
        // Whatever the user answers, we make sure Chrome stores the information
        if (!("permission" in Notification)) {
            Notification.permission = permission;
        }
    }

    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        console.log("This browser does not support notifications.");
    }
    else {
        if (checkNotificationPromise()) {
            Notification.requestPermission()
                .then((permission) => {
                    handlePermission(permission);
                });
        }
        else {
            Notification.requestPermission(function (permission) {
                handlePermission(permission);
            });
        }
    }
}

function checkNotificationPromise() {
    try {
        Notification.requestPermission().then();
    } catch (e) {
        return false;
    }

    return true;
}
