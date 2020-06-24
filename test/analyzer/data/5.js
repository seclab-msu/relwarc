// var config = {
//   apiKey: "AIzaSyAAPUtHMPgFBxy2PdkW5q8TLR9rhZhPEXQ",
//   authDomain: "push-notification-dd3ea.firebaseapp.com",
//   projectId: "push-notification-dd3ea",
//   databaseURL: "http://push-notification-dd3ea.firebaseio.com/",
//   storageBucket: "gs://push-notification-dd3ea.appspot.com",
//   messagingSenderId: "855936105235"
// };
var config = {
    apiKey: "AIzaSyBQUz4w3JLOjrHc6h76X1EtYY9QK5CXAVc",
    authDomain: "aninews-43dbe.firebaseapp.com",
    databaseURL: "http://aninews-43dbe.firebaseio.com",
    projectId: "aninews-43dbe",
    storageBucket: "aninews-43dbe.appspot.com",
    messagingSenderId: "905596020",
};
firebase.initializeApp(config);

const messaging = firebase.messaging();

// Add a message to the messages element.
function appendMessage(payload) {
    const messagesElement = document.querySelector("#messages");
    const dataHeaderELement = document.createElement("h5");
    const dataElement = document.createElement("pre");
    dataElement.style = "overflow-x:hidden;";
    dataHeaderELement.textContent = "Received message:";
    dataElement.textContent = JSON.stringify(payload, null, 2);
    messagesElement.appendChild(dataHeaderELement);
    messagesElement.appendChild(dataElement);
}

// Clear the messages element of all children.
function clearMessages() {
    const messagesElement = document.querySelector("#messages");
    while (messagesElement.hasChildNodes()) {
        // console.log("Has children")
        messagesElement.removeChild(messagesElement.lastChild);
    }
}

// messaging.onMessage(function(payload) {
//   // console.log("Message received. ", payload);
//   appendMessage(payload);
// });

function resetUI() {
    clearMessages();
    // console.log("getting token")
    messaging.getToken().then((resp) => {
        // console.log(resp)
    });
    messaging
        .getToken()
        .then(function (currentToken) {
            // console.log("Got current token")
            if (currentToken) {
                sendTokenToServer(currentToken);
            } else {
                // console.log('No Instance ID token available. Request permission to generate one.');
                // Show permission UI.
                // updateUIForPushPermissionRequired();
                setTokenSentToServer(false);
            }
        })
        .catch(function (err) {
            // console.log('An error occurred while retrieving token. ', err);
            setTokenSentToServer(false);
        });
    // console.log("End get token")
}

function sendTokenToServer(currentToken) {
    if (!isTokenSentToServer()) {
        // console.log('Sending token to server...');
        fetch("http://www.aninews.in/devices/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                registration_id: currentToken,
                type: "web",
            }),
            credentials: "include",
        }).then(function (response) {
            // console.log(response);
        });
        setTokenSentToServer(true);
    } else {
        // console.log('Token already sent to server so won\'t send it again ' +
        // 'unless it changes');
    }
}

function isTokenSentToServer() {
    if (window.localStorage.getItem("sentToServer") == 1) {
        return true;
    }
    return false;
}

function setTokenSentToServer(sent) {
    if (sent) {
        window.localStorage.setItem("sentToServer", 1);
    } else {
        window.localStorage.setItem("sentToServer", 0);
    }
}

function requestPermission() {
    // console.log('Requesting permission...');
    messaging
        .requestPermission()
        .then(function () {
            // console.log('Notification permission granted.');
            resetUI();
        })
        .catch(function (err) {
            // console.log('Unable to get permission to notify.', err);
        });
}

requestPermission();
