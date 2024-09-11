let roomcode = window.location.pathname.replace('/', '').toUpperCase();

document.getElementById('roomcode').innerText = roomcode.toUpperCase();
document.getElementById('roomcode_container').addEventListener('click', () => {
    navigator.clipboard.writeText(roomcode);
    document.getElementById('roomcode').innerText = 'Copied!';
    setTimeout(() => {
        document.getElementById('roomcode').innerText = roomcode.toUpperCase();
    }
    , 1000);
}
);


let textarea = document.getElementById('text');

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

    const ws = new WebSocket(`ws${https ? 's' : ''}://${window.location.host}/${roomcode}`);

    ws.onopen = function() {
        tryCount = 0;
        console.log('Connected to server');
        statusElement.innerText = 'Connected to Server';
        statusElement.classList.remove('is-danger', 'is-warning');
        statusElement.classList.add('is-success');
    }

    ws.onmessage = function(event) {
        const payload = JSON.parse(event.data);

        if (payload.text) {
            textarea.value = payload.text
        }

        if (payload.clients) {
            document.getElementById('clients').innerText = payload.clients;
            
            document.getElementById("pluralclients").innerText = payload.clients != 1 ? "s" : "";
            
        }

        if (payload.sendProgress) {
            ws.send(JSON.stringify({text: textarea.value}));
        }
        
    }

    ws.onclose = function() {
        console.log('Disconnected from server, trying again in 5 seconds');
        statusElement.innerText = 'No Connection, trying again';
        statusElement.classList.remove('is-success');
        statusElement.classList.add('is-warning');

        textarea.removeEventListener('input', sendText);

        setTimeout(() => connect(tryCount + 1), 5000);
    }

    textarea.addEventListener('input', sendText);

    function sendText() {
        ws.send(JSON.stringify({text: textarea.value}));
    }
}

connect();