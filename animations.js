/**
 * Advanced Animations and Effects
 */
class AdvancedAnimations {
    constructor() {
        this.initializeGSAP();
        this.initializeScrollTriggers();
        this.initializeHoverEffects();
        this.initializePageTransitions();
    }

    initializeGSAP() {
        // Hero section animation
        gsap.from('.hero-content > *', {
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power4.out',
            delay: 0.5
        });

        // Skill cards stagger animation
        gsap.from('.skill-card', {
            scrollTrigger: {
                trigger: '.skills-grid',
                start: 'top center+=100',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'back.out(1.7)'
        });
    }

    initializeScrollTriggers() {
        // Parallax background effect
        gsap.to('.parallax-bg', {
            scrollTrigger: {
                trigger: '.parallax-section',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            },
            y: (i, target) => -ScrollTrigger.maxScroll(window) * target.dataset.speed,
            ease: 'none'
        });
    }

    initializeHoverEffects() {
        // Project cards hover effect
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.createParticleEffect(e);
                this.animateProjectCard(card);
            });
        });
    }

    createParticleEffect(e) {
        const particles = 12;
        const colors = ['#2563eb', '#3b82f6', '#60a5fa'];

        for (let i = 0; i < particles; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            const size = Math.random() * 8 + 4;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            const destinationX = (Math.random() - 0.5) * 200;
            const destinationY = (Math.random() - 0.5) * 200;

            e.target.appendChild(particle);

            gsap.to(particle, {
                x: destinationX,
                y: destinationY,
                opacity: 0,
                duration: 1,
                ease: 'power4.out',
                onComplete: () => particle.remove()
            });
        }
    }

    animateProjectCard(card) {
        gsap.to(card, {
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out'
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    }

    initializePageTransitions() {
        barba.init({
            transitions: [{
                name: 'opacity-transition',
                leave(data) {
                    return gsap.to(data.current.container, {
                        opacity: 0,
                        duration: 0.5
                    });
                },
                enter(data) {
                    return gsap.from(data.next.container, {
                        opacity: 0,
                        duration: 0.5
                    });
                }
            }]
        });
    }
} 