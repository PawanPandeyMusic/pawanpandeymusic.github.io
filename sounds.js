// Audio Manager for Background Music
class AudioManager {
    constructor() {
        this.audio = new Audio('assets/piano-loop.mp3');
        this.audio.loop = true;
        this.audio.autoplay = true; // Attempt auto-play
        this.audio.volume = 0.3;
        this.audio.playbackRate = 0.85; // Slower playback for elegant feel
        this.isPlaying = false;
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;

        this.initialized = true;

        // Try to play immediately
        try {
            await this.audio.play();
            this.isPlaying = true;
            return true;
        } catch (error) {
            // If blocked, try again on any user interaction
            console.log('Autoplay blocked, will try on user interaction');

            // Listen for ANY user interaction
            const tryPlay = async () => {
                try {
                    await this.audio.play();
                    this.isPlaying = true;
                    // Remove all listeners once playing
                    document.removeEventListener('click', tryPlay);
                    document.removeEventListener('keydown', tryPlay);
                    document.removeEventListener('scroll', tryPlay);
                    document.removeEventListener('mousemove', tryPlay);
                } catch (e) {
                    console.log('Still blocked');
                }
            };

            document.addEventListener('click', tryPlay, { once: true });
            document.addEventListener('keydown', tryPlay, { once: true });
            document.addEventListener('scroll', tryPlay, { once: true });
            document.addEventListener('mousemove', tryPlay, { once: true });

            return false;
        }
    }

    play() {
        if (!this.initialized) return;

        this.audio.play().then(() => {
            this.isPlaying = true;
        }).catch(error => {
            console.error('Error playing audio:', error);
        });
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
    }

    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
        return this.isPlaying;
    }

    setVolume(volume) {
        this.audio.volume = Math.max(0, Math.min(1, volume));
    }
}

// Export for use in main.js
window.audioManager = new AudioManager();
