document.addEventListener('DOMContentLoaded', () => {
    const confettiAudio = new Audio('confetti.mp3');
    const songAudio = new Audio('cumpleanos.mp3');
    let hasPlayedFinaleAudio = false;

    function playPopFallback() {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
    }

    function playSongFallback() {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [
            { f: 392.00, d: 0.25 }, { f: 392.00, d: 0.25 }, { f: 440.00, d: 0.5 }, { f: 392.00, d: 0.5 }, { f: 523.25, d: 0.5 }, { f: 493.88, d: 1.0 },
            { f: 392.00, d: 0.25 }, { f: 392.00, d: 0.25 }, { f: 440.00, d: 0.5 }, { f: 392.00, d: 0.5 }, { f: 587.33, d: 0.5 }, { f: 523.25, d: 1.0 },
            { f: 392.00, d: 0.25 }, { f: 392.00, d: 0.25 }, { f: 783.99, d: 0.5 }, { f: 659.25, d: 0.5 }, { f: 523.25, d: 0.5 }, { f: 493.88, d: 0.5 }, { f: 440.00, d: 1.0 },
            { f: 698.46, d: 0.25 }, { f: 698.46, d: 0.25 }, { f: 659.25, d: 0.5 }, { f: 523.25, d: 0.5 }, { f: 587.33, d: 0.5 }, { f: 523.25, d: 1.0 }
        ];
        
        let startTime = ctx.currentTime + 0.1;
        const tempo = 1.3;
        
        notes.forEach(note => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'triangle';
            osc.frequency.value = note.f;
            gain.gain.setValueAtTime(0.3, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + note.d * tempo - 0.05);
            osc.start(startTime);
            osc.stop(startTime + note.d * tempo);
            startTime += note.d * tempo;
        });
    }

    const enterBubble = document.getElementById('enterBubble');
    enterBubble.addEventListener('click', () => {
        enterBubble.style.opacity = '0';
        setTimeout(() => enterBubble.style.display = 'none', 500);
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        ctx.resume();
        confettiAudio.load();
        songAudio.load();
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                if (entry.target.id === 'finale-card' && !hasPlayedFinaleAudio) {
                    hasPlayedFinaleAudio = true;
                    
                    confettiAudio.play().catch(e => {
                        playPopFallback();
                    });
                    
                    songAudio.play().catch(e => {
                        playSongFallback();
                    });
                }
            }
        });
    }, {
        threshold: 0.5
    });

    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => observer.observe(card));

    const background = document.querySelector('.background');
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        background.style.transform = `translate(-${x * 20}px, -${y * 20}px)`;
    });
});
