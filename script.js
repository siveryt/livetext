let roomcode = window.location.pathname.replace('/', '');

console.log(roomcode);
let textarea = document.getElementById('text');

const ws = new WebSocket(`ws://${window.location.host}/${roomcode}`);

ws.onopen = function() {
    console.log('Connected to server');
}

ws.onmessage = function(event) {
    console.log('received:', event.data);
    textarea.value = event.data;
}

textarea.addEventListener('input', function() {
    ws.send(textarea.value);
});
