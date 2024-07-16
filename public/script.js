let roomcode = window.location.pathname.replace('/', '');

document.getElementById('roomcode').innerText = roomcode;

let textarea = document.getElementById('text');

const statusElement = document.getElementById('serverstatus');

const https = document.location.protocol === 'https:';

function connect() {

    const ws = new WebSocket(`ws${https ? 's' : ''}://${window.location.host}/${roomcode}`);

    ws.onopen = function() {
        console.log('Connected to server');
        statusElement.innerText = 'Connected to Server';
        statusElement.classList.remove('is-danger');
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
        
    }

    ws.onclose = function() {
        console.log('Disconnected from server, trying again in 5 seconds');
        statusElement.innerText = 'No Connection';
        statusElement.classList.remove('is-success');
        statusElement.classList.add('is-danger');

        textarea.removeEventListener('input', sendText);

        setTimeout(connect, 5000);
    }

    textarea.addEventListener('input', sendText);

    function sendText() {
        ws.send(JSON.stringify({text: textarea.value}));
    }
}

connect();