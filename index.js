document.getElementById('submit').addEventListener('click', function() {
    let roomcode = document.getElementById('roomcode').value;
    window.location = `${window.location.origin}/${roomcode}`;
});