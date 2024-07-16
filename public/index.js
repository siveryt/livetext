document.getElementById('submit').addEventListener('click', function() {
    let roomcode = document.getElementById('roomcode').value;
    window.location = `${window.location.origin}/${roomcode}`;
});

document.getElementById('random').addEventListener('click', function() {
    let roomcode = Math.random().toString(36).substring(7);
    window.location = `${window.location.origin}/${roomcode}`;
});

const statusElement = document.getElementById('serverstatus');

const https = document.location.protocol === 'https:';
function connect() {
    const ws = new WebSocket(`ws${https ? 's' : ''}://${window.location.host}`)

    ws.onopen = function() {
        console.log('Connected to server');
        statusElement.innerText = 'Connected to Server';
        statusElement.classList.remove('is-danger');
        statusElement.classList.add('is-success');
    }

    ws.onclose = function() {
        console.log('Disconnected from server, trying again in 5 seconds');
        statusElement.innerText = 'No Connection';
        statusElement.classList.remove('is-success');
        statusElement.classList.add('is-danger');
        setTimeout(connect, 5000);
    }
}

connect();