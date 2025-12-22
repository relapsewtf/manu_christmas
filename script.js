document.addEventListener('DOMContentLoaded', () => {
    const enterBubble = document.getElementById('enter-bubble');
    const introScreen = document.getElementById('intro-screen');
    const mainContent = document.getElementById('main-content');
    const bgm = document.getElementById('bgm');

    enterBubble.addEventListener('click', () => {
        // Fade out intro
        introScreen.style.transition = 'opacity 0.8s ease';
        introScreen.style.opacity = '0';

        // Initialize Audio Context on click (browser requirement)
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();

        // Procedural Audio: Natural "Wind" and "Chimes"
        function playAmbient() {
            // 1. Wind (Pink/Brownian Noise approximation via filtered White Noise)
            const bufferSize = 2 * audioCtx.sampleRate;
            const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            let lastOut = 0;

            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                output[i] = (lastOut + (0.02 * white)) / 1.02; // Simple Brownian-ish smoothing
                lastOut = output[i];
                output[i] *= 3.5; // Gain compensation
            }

            const noiseNode = audioCtx.createBufferSource();
            noiseNode.buffer = noiseBuffer;
            noiseNode.loop = true;

            const gainNode = audioCtx.createGain();
            gainNode.gain.value = 0.15; // Volume

            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 400;
            filter.Q.value = 1;

            // Modulate filter for "breeze" effect
            const oscillator = audioCtx.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.value = 0.1; // Slow modulation
            const oscGain = audioCtx.createGain();
            oscGain.gain.value = 200; // Depth of modulation

            oscillator.connect(oscGain);
            oscGain.connect(filter.frequency);
            oscillator.start();

            noiseNode.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            noiseNode.start();

            // 2. Occasional Chimes
            setInterval(() => {
                if (Math.random() > 0.7) playChime(audioCtx);
            }, 5000 + Math.random() * 4000);
        }

        function playChime(ctx) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.value = 800 + Math.random() * 600; // High frequency
            osc.type = 'sine';

            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 2);
        }

        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        try {
            playAmbient();
        } catch (e) {
            console.error("Audio generation failed:", e);
        }

        setTimeout(() => {
            introScreen.style.display = 'none';
            mainContent.classList.remove('hidden');

            // Trigger reflow
            void mainContent.offsetWidth;

            mainContent.classList.add('visible');
        }, 800);
    });
});
