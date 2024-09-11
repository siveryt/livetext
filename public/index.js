document.getElementById('submit').addEventListener('click', joinRoomEvent);
document.getElementById('roomcode').addEventListener("keyup", (e) => {
    if (e.key === 'Enter') {
        joinRoomEvent()
    }
})

document.getElementById('random').addEventListener('click', function() {
    let roomcode = Math.random().toString(36).substring(7);
    window.location = `${window.location.origin}/${roomcode}`;
});

function joinRoomEvent() {
    let roomcode = document.getElementById('roomcode').value;
    if (roomcode.length === 0) {
        roomcode = Math.random().toString(36).substring(7);
    }
    window.location = `${window.location.origin}/${roomcode}`;
}

const statusElement = document.getElementById('serverstatus');

const https = document.location.protocol === 'https:';
function connect(tryCount = 0) {

    if (tryCount > 60) {
        console.log('Failed to connect to server after 5 minutes');
        statusElement.innerText = 'No Connection';
        statusElement.classList.remove('is-success');
        statusElement.classList.add('is-danger');
        return;
    }

    console.log(`Connection attempt ${tryCount}`);

    const ws = new WebSocket(`ws${https ? 's' : ''}://${window.location.host}`)

    ws.onopen = function() {
        tryCount = 0;
        console.log('Connected to server');
        statusElement.innerText = 'Connected to Server';
        statusElement.classList.remove('is-danger', 'is-warning');
        statusElement.classList.add('is-success');
    }

    ws.onclose = function() {
        console.log('Disconnected from server, trying again in 5 seconds');
        statusElement.innerText = 'No Connection, trying again';
        statusElement.classList.remove('is-success');
        statusElement.classList.add('is-warning');
        setTimeout(() => connect(tryCount + 1), 5000);
    }
}

connect();