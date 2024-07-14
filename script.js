let roomcode = window.location.pathname.replace('/', '');

console.log(roomcode);
let textarea = document.getElementById('text');

const ws = new WebSocket(`ws://${window.location.host}/${roomcode}`);

ws.onopen = function() {
    console.log('Connected to server');
}

ws.onmessage = function(event) {
    console.log('received:', event.data);
    const payload = JSON.parse(event.data);

    if (payload.text) {
        textarea.value = payload.text
    }

    if (payload.clients) {
        document.getElementById('clients').innerText = payload.clients;
    }
    
}

textarea.addEventListener('input', function() {
    ws.send(JSON.stringify({text: textarea.value}));
});
