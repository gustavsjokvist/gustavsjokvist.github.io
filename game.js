let score = 0;

document.getElementById('click-button').addEventListener('click', function() {
    score++;
    document.getElementById('score').textContent = 'Score: ' + score;
});
