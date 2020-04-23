function parseQuery(queryString) {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}

function checkNotificationPromise() {
    try {
      Notification.requestPermission().then();
    } catch(e) {
      return false;
    }

    return true;
  }

// From https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API
function askNotificationPermission() {
    // function to actually ask the permissions
    function handlePermission(permission) {
        // Whatever the user answers, we make sure Chrome stores the information
        if(!('permission' in Notification)) {
            Notification.permission = permission;
        }
    }

    // Let's check if the browser supports notifications
    if (!('Notification' in window)) {
        console.log("This browser does not support notifications.");
    } else {
        if(checkNotificationPromise()) {
            Notification.requestPermission()
            .then((permission) => {
                handlePermission(permission);
        })
        } else {
            Notification.requestPermission(function(permission) {
                handlePermission(permission);
            });
        }
    }
}

const stopBtn = document.querySelector('#stopBtn');

stopBtn.onclick = function () {
    window.location.assign("./index.html" + window.location.search);
    return false;
}
