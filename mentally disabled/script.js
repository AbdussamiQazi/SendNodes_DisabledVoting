document.getElementById('audio-icon').addEventListener('click', function() {
    var audio = document.getElementById('audio');

    // Check if the audio file is loaded
    audio.play().catch(function(error) {
        console.error('Error playing audio:', error);
    });
});
