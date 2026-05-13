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
        
        // Aplica el color dinámico '--accent' a la propiedad CSS del documento
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
                    // Corrección: Garantiza un color fallback seguro si falta 'data-color'
                    const streamUrl = activeBtn.getAttribute('data-stream');
                    const streamName = activeBtn.getAttribute('data-name');
                    const streamColor = activeBtn.getAttribute('data-color') || '#2563eb';
                    
                    loadStream(streamUrl, streamName, streamColor);
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

    // Función para actualizar el reloj y la fecha en 2 líneas
    function initDateTime() {
        const clockElement = document.getElementById('live-clock');
        const dateElement = document.getElementById('live-date');
        
        // Validar que los elementos existen en el HTML para evitar errores en consola
        if (!clockElement || !dateElement) return;
        
        function updateDateTime() {
            const now = new Date();
            
            // 1. Obtener y formatear componentes de la Hora
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            clockElement.textContent = `${hours}:${minutes}:${seconds}`;
            
            // 2. Obtener y formatear componentes de la Fecha (Día/Mes/Año)
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            dateElement.textContent = `${day}/${month}/${year}`;
        }
        
        updateDateTime(); 
        setInterval(updateDateTime, 1000); 
    }
    
    initDateTime(); 
}); // Único cierre correcto y limpio del DOMContentLoaded
