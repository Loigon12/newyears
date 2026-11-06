// --- Lógica del Reproductor de Audio ---
const audio = document.getElementById('main-audio');
const playPauseBtn = document.getElementById('play-pause-btn');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const currentTrackTitle = document.getElementById('current-track-title');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');
const fixedPlayer = document.getElementById('fixed-player');
const tracks = document.querySelectorAll('.track');

let isPlaying = false;
let currentTrackIndex = -1;

function playTrack(index) {
    if (index === currentTrackIndex && isPlaying) {
        pauseTrack();
        return;
    }

    const selectedTrack = tracks[index];
    const src = selectedTrack.getAttribute('data-src');
    const title = selectedTrack.querySelector('span:first-child').innerText;

    audio.src = src;
    audio.load();

    currentTrackIndex = index;
    currentTrackTitle.innerText = title.split('.').slice(1).join('.').trim();

    tracks.forEach(t => t.classList.remove('playing'));
    selectedTrack.classList.add('playing');

    fixedPlayer.classList.add('active');
    startPlayback();
}

function startPlayback() {
    audio.play().then(() => {
        isPlaying = true;
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    }).catch(error => console.error("Error al reproducir:", error));
}

function pauseTrack() {
    audio.pause();
    isPlaying = false;
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
}

playPauseBtn.addEventListener('click', () => {
    if (currentTrackIndex === -1) {
        playTrack(0);
    } else if (isPlaying) {
        pauseTrack();
    } else {
        startPlayback();
    }
});

audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
});

audio.addEventListener('ended', () => {
    const nextIndex = currentTrackIndex + 1;
    if (nextIndex < tracks.length) {
        playTrack(nextIndex);
    } else {
        pauseTrack();
    }
});

progressContainer.addEventListener('click', (e) => {
    if (!audio.duration) return;
    const rect = progressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    audio.currentTime = (clickX / rect.width) * audio.duration;
});

// --- Polvo flotante (partículas) ---
const canvas = document.getElementById('mistCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.2;
        this.speedX = Math.random() * 0.2 - 0.1;
        this.speedY = Math.random() * 0.2 - 0.1;
        this.opacity = Math.random() * 0.4;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }
    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function createParticles() {
    for (let i = 0; i < 40; i++) particles.push(new Particle());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
}

window.addEventListener('resize', initCanvas);
initCanvas();
createParticles();
animate();

// --- Letras de crayón: efecto "línea que hierve" (animación a mano, a pocos fps) ---
(function crayonBoil() {
    const wobble = document.getElementById('wobble');
    if (!wobble) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let seed = 1;
    setInterval(() => {
        seed = (seed % 6) + 1; // 6 fotogramas distintos en bucle
        wobble.setAttribute('seed', seed);
    }, 160);
})();

// --- Fade-in al hacer scroll ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.featured-release, .track, .socials, .reveal-section').forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 0.8s cubic-bezier(0.22, 1, 0.36, 1)";
    observer.observe(el);
});

// --- Desmutear el video del live session al hacer click ---
const video = document.getElementById('main-video');
if (video) {
    video.addEventListener('click', () => {
        if (video.muted) video.muted = false;
    });
}