let roomcode = window.location.pathname.replace('/', '');

document.getElementById('roomcode').innerText = roomcode;

let textarea = document.getElementById('text');

const ws = new WebSocket(`ws://${window.location.host}/${roomcode}`);

ws.onopen = function() {
    console.log('Connected to server');
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

textarea.addEventListener('input', function() {
    ws.send(JSON.stringify({text: textarea.value}));
});
