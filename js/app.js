document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audio-stream');
    const playBtn = document.getElementById('play-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const trackTitle = document.getElementById('track-title');
    const channelButtons = document.querySelectorAll('.channel-btn');
    const playerContainer = document.querySelector('.player-container');
    
    let hls = null;

    function loadStream(url, name, color) {
        if (hls) {
            hls.destroy();
            hls = null;
        }

        trackTitle.textContent = name;
        
        // Aplica el color dinámico 'data-color' a la propiedad CSS del documento
        document.documentElement.style.setProperty('--accent', color);

        if (url.includes('.m3u8')) {
            if (typeof Hls !== 'undefined' && Hls.isSupported()) {
                hls = new Hls();
                hls.loadSource(url);
                hls.attachMedia(audio);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    audio.play().catch(err => console.log("Autoplay bloqueado:", err));
                });
            } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
                audio.src = url;
                audio.play().catch(err => console.log("Error Safari:", err));
            } else {
                alert('Tu navegador no soporta streaming HLS (.m3u8)');
            }
        } else {
            audio.src = url;
            audio.play().catch(err => console.log("Error MP3:", err));
        }

        playerContainer.classList.add('playing');
        playBtn.innerHTML = '<i class="ph-fill ph-pause"></i>';
    }

    channelButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('.channel-btn.active')?.classList.remove('active');
            button.classList.add('active');

            const streamUrl = button.getAttribute('data-stream');
            const streamName = button.getAttribute('data-name');
            const streamColor = button.getAttribute('data-color') || '#2563eb';

            loadStream(streamUrl, streamName, streamColor);
        });
    });

    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            if (!audio.src && !hls) {
                const activeBtn = document.querySelector('.channel-btn.active');
                if (activeBtn) {
                    loadStream(
                        activeBtn.getAttribute('data-stream'), 
                        activeBtn.getAttribute('data-name'),
                        activeBtn.getAttribute('data-color')
                    );
                    return;
                }
            }
            audio.play().catch(err => console.log("Error al reproducir:", err));
            playerContainer.classList.add('playing');
            playBtn.innerHTML = '<i class="ph-fill ph-pause"></i>';
        } else {
            audio.pause();
            playerContainer.classList.remove('playing');
            playBtn.innerHTML = '<i class="ph-fill ph-play"></i>';
        }
    });

    volumeSlider.addEventListener('input', (e) => {
        audio.volume = e.target.value;
    });
});
