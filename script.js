document.addEventListener('DOMContentLoaded', () => {
    // Disable all animations until page is fully loaded to eliminate CLS
    const body = document.body;
    body.classList.add('no-animations');

    // Font loading - wait longer to prevent CLS
    const enableAnimations = () => {
        setTimeout(() => {
            body.classList.remove('no-animations');
        }, 1000); // Extended delay to ensure fonts and layout are stable
    };

    // Check if fonts are already loaded
    if ('fonts' in document) {
        const fonts = ['400 1em Inter', '600 1em Inter', '700 1em Inter', '800 1em Inter'];
        let fontsLoaded = 0;

        fonts.forEach(font => {
            if (document.fonts.check(font)) {
                fontsLoaded++;
            } else {
                document.fonts.load(font).then(() => {
                    fontsLoaded++;
                    if (fontsLoaded === fonts.length) {
                        enableAnimations();
                    }
                });
            }
        });

        if (fontsLoaded === fonts.length) {
            enableAnimations();
        }
    } else {
        // No font loading API, enable animations after delay
        enableAnimations();
    }

    // Scroll Reveal Animation - only start after animations enabled
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const startReveals = () => {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !document.body.classList.contains('no-animations')) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    };

    // Start reveals immediately, but respect animation state
    startReveals();

    // Typing Effect with stable height
    const typingTextElement = document.querySelector('.typing-text');
    const textToType = "Kami bantu fix webmu hingga siap dipakai.";
    let charIndex = 0;
    let isTyping = false;

    if (typingTextElement) {
        typingTextElement.style.minHeight = '2.5rem';
        typingTextElement.style.minWidth = '420px';
        typingTextElement.style.display = 'inline-block';
        typingTextElement.style.lineHeight = '2.5rem';

        // Clear any existing content
        typingTextElement.textContent = '';
    }

    const typeWriter = () => {
        if (charIndex < textToType.length && !document.body.classList.contains('no-animations')) {
            typingTextElement.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 50);
        }
    };

    const typingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isTyping && !document.body.classList.contains('no-animations')) {
                isTyping = true;
                typeWriter();
                typingObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (typingTextElement) {
        typingObserver.observe(typingTextElement.parentElement);
    }

    // Count Up Animation - prevent layout shifts with stable dimensions
    const countUpElements = document.querySelectorAll('.count-up');

    countUpElements.forEach(element => {
        const originalDisplay = element.style.display;
        element.style.display = 'inline-flex';
        element.style.minWidth = '3ch'; // Reserve space for 3 digits
        element.style.fontVariantNumeric = 'tabular-nums'; // Monospaced digits

        const countUp = () => {
            const target = +element.getAttribute('data-target');
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCount = () => {
                if (!document.body.classList.contains('no-animations')) {
                    current += increment;
                    if (current < target) {
                        element.textContent = Math.ceil(current);
                        requestAnimationFrame(updateCount);
                    } else {
                        element.textContent = target;
                        element.style.minWidth = target.toString().length + 'ch';
                    }
                }
            };

            if (!document.body.classList.contains('no-animations')) {
                updateCount();
            }
        };

        const countObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    countUp();
                    countObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        countObserver.observe(element);
    });

    // Smooth Scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Prevent layout shifts from images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete) {
            img.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
        } else {
            img.addEventListener('load', () => {
                img.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
            });
        }
    });
});
