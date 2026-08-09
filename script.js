document.addEventListener('DOMContentLoaded', () => {
    // 1. Particle Background Animation
    const canvas = document.getElementById('layer-5-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = [];
        const particleCount = 50;

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > width) this.x = 0;
            if (this.x < 0) this.x = width;
            if (this.y > height) this.y = 0;
            if (this.y < 0) this.y = height;
        }
        draw() {
            ctx.fillStyle = `rgba(0, 255, 136, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
    }

    // 2. Headline Animation (handled in CSS now)
    const title = document.querySelector('.hero-title');
    if (title) {
        title.classList.add('active');
    }

    // 3. Mouse Parallax Effect (Subtle)
    document.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
        
        const chartBg = document.querySelector('.layer-1-chart');
        if(chartBg) {
            chartBg.style.transform = `translate(${xAxis}px, ${yAxis}px) scale(1.05)`;
        }
    });

    // 4. Scroll Reveal & Counters
    const reveals = document.querySelectorAll('.reveal');
    const counters = document.querySelectorAll('.counter');
    let countersStarted = false;

    function checkScroll() {
        // Reveal elements
        const windowHeight = window.innerHeight;
        const revealPoint = 100;

        reveals.forEach(reveal => {
            const revealTop = reveal.getBoundingClientRect().top;
            if (revealTop < windowHeight - revealPoint) {
                reveal.classList.add('active');
            }
        });

        // Counters
        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            const statsTop = statsSection.getBoundingClientRect().top;
            if (statsTop < windowHeight && !countersStarted) {
                countersStarted = true;
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16); // 60fps

                    let current = 0;
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.innerText = Math.ceil(current) + '+';
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target + '+';
                        }
                    };
                    updateCounter();
                });
            }
        }
    }

    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Check on load
});
