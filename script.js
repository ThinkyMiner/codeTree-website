// codetree — Interactions
document.addEventListener('DOMContentLoaded', () => {

    // Wait for GSAP
    function initGSAP() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            setTimeout(initGSAP, 100);
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        // Scroll reveals
        document.querySelectorAll('[data-reveal]').forEach((el, i) => {
            gsap.from(el, {
                scrollTrigger: { trigger: el, start: 'top 90%', once: true },
                y: 24,
                opacity: 0,
                duration: 0.6,
                delay: (i % 4) * 0.08,
                ease: 'power2.out'
            });
        });

        // Demo token bars
        const barBefore = document.querySelector('.bar-before');
        const barAfter = document.querySelector('.bar-after');
        if (barBefore) {
            barBefore.style.width = '0%';
            barAfter.style.width = '0%';
            gsap.to(barBefore, {
                scrollTrigger: { trigger: '.demo-terminal', start: 'top 70%', once: true },
                width: '100%',
                duration: 1,
                ease: 'power2.out'
            });
            gsap.to(barAfter, {
                scrollTrigger: { trigger: '.demo-terminal', start: 'top 70%', once: true },
                width: '4%',
                duration: 1,
                delay: 0.3,
                ease: 'power2.out'
            });
        }

        // Stat counters
        document.querySelectorAll('[data-count]').forEach(el => {
            const target = parseInt(el.getAttribute('data-count'));
            const obj = { val: 0 };
            gsap.to(obj, {
                scrollTrigger: { trigger: el, start: 'top 85%', once: true },
                val: target,
                duration: 1.2,
                ease: 'power2.out',
                onUpdate: () => { el.textContent = Math.round(obj.val); }
            });
        });

        // Hero entrance
        const tl = gsap.timeline({ delay: 0.15 });
        tl.from('.hero-label', { y: 15, opacity: 0, duration: 0.4, ease: 'power2.out' })
          .from('.hero-title', { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.25')
          .from('.hero-sub', { y: 15, opacity: 0, duration: 0.4, ease: 'power2.out' }, '-=0.25')
          .from('.hero-actions', { y: 15, opacity: 0, duration: 0.4, ease: 'power2.out' }, '-=0.15')
          .from('.hero-pitch', { y: 10, opacity: 0, duration: 0.35, ease: 'power2.out' }, '-=0.15');

        gsap.from('nav', { y: -15, opacity: 0, duration: 0.5, delay: 0.1, ease: 'power2.out' });
    }

    initGSAP();


    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const parent = btn.closest('.client-tabs') || document;
            parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            parent.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const pane = document.getElementById(btn.getAttribute('data-tab'));
            if (pane) pane.classList.add('active');
        });
    });


    // Copy to clipboard
    const copyBtn = document.querySelector('.copy-btn');
    const installCmd = document.querySelector('.install-cmd');

    if (copyBtn && installCmd) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(installCmd.innerText).then(() => {
                const copyIcon = copyBtn.querySelector('.copy-icon');
                const checkIcon = copyBtn.querySelector('.check-icon');
                if (copyIcon) copyIcon.style.display = 'none';
                if (checkIcon) checkIcon.style.display = 'block';
                copyBtn.classList.add('copied');
                setTimeout(() => {
                    if (copyIcon) copyIcon.style.display = 'block';
                    if (checkIcon) checkIcon.style.display = 'none';
                    copyBtn.classList.remove('copied');
                }, 2000);
            });
        });
    }


    // Nav scroll
    const navEl = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navEl.style.borderBottomColor = '#d4d4d4';
        } else {
            navEl.style.borderBottomColor = '#e5e5e5';
        }
    }, { passive: true });

});
