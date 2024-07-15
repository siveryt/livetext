document.getElementById('submit').addEventListener('click', function() {
    let roomcode = document.getElementById('roomcode').value;
    window.location = `${window.location.origin}/${roomcode}`;
});

document.getElementById('random').addEventListener('click', function() {
    let roomcode = Math.random().toString(36).substring(7);
    window.location = `${window.location.origin}/${roomcode}`;
});