// ============================================================
//  SUDE KAZAN — Portfolio Shared Script
//  Features: navbar scroll, hamburger, active link,
//            fade-up animations, typing effect,
//            dark/light theme toggle, TR/EN language toggle,
//            contact form validation
// ============================================================

(function () {

    /* ─────────────────────────────────────────
       1. THEME TOGGLE (dark / light)
    ───────────────────────────────────────── */
    const html = document.documentElement;
    const themeBtn = document.getElementById('theme-toggle');
    const THEME_KEY = 'sk-theme';

    function applyTheme(theme) {
        if (theme === 'light') {
            html.setAttribute('data-theme', 'light');
            if (themeBtn) themeBtn.textContent = '☀️';
        } else {
            html.removeAttribute('data-theme');
            if (themeBtn) themeBtn.textContent = '🌙';
        }
        localStorage.setItem(THEME_KEY, theme);
    }

    // Load saved theme (default: dark)
    applyTheme(localStorage.getItem(THEME_KEY) || 'dark');

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const current = localStorage.getItem(THEME_KEY) || 'dark';
            applyTheme(current === 'dark' ? 'light' : 'dark');
        });
    }

    /* ─────────────────────────────────────────
       2. LANGUAGE TOGGLE (tr / en)
    ───────────────────────────────────────── */
    const langBtn = document.getElementById('lang-toggle');
    const LANG_KEY = 'sk-lang';
    const T = window.TRANSLATIONS || {};

    // Detect which page we are on
    const pageName = (() => {
        const f = location.pathname.split('/').pop().replace('.html', '') || 'index';
        return f === '' ? 'index' : f;
    })();

    function applyLang(lang) {
        // Update button label
        if (langBtn) langBtn.textContent = lang === 'tr' ? 'EN' : 'TR';
        localStorage.setItem(LANG_KEY, lang);

        // Update all elements that have data-i18n attributes
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');       // e.g. "index.greeting"
            const [ns, k] = key.split('.');
            const entry = T[ns] && T[ns][k];
            if (!entry) return;
            const val = entry[lang];
            if (val === undefined) return;
            // Use innerHTML for strings that may contain HTML tags (<span>, <strong>…)
            el.innerHTML = val;
        });

        // Update placeholders separately
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const [ns, k] = key.split('.');
            const entry = T[ns] && T[ns][k];
            if (!entry) return;
            el.setAttribute('placeholder', entry[lang]);
        });

        // Update html lang attribute
        html.setAttribute('lang', lang === 'tr' ? 'tr' : 'en');
    }

    // Load saved lang (default: tr)
    const savedLang = localStorage.getItem(LANG_KEY) || 'tr';
    // Apply after DOM is ready (defer a tick so data-i18n elements exist)
    setTimeout(() => applyLang(savedLang), 0);

    if (langBtn) {
        langBtn.addEventListener('click', () => {
            const current = localStorage.getItem(LANG_KEY) || 'tr';
            applyLang(current === 'tr' ? 'en' : 'tr');
        });
    }

    /* ─────────────────────────────────────────
       3. NAVBAR — scroll state
    ───────────────────────────────────────── */
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 20);
        });
    }

    /* ─────────────────────────────────────────
       4. HAMBURGER MENU
    ───────────────────────────────────────── */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            navLinks.classList.toggle('open');
        });
        navLinks.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                hamburger.classList.remove('open');
                navLinks.classList.remove('open');
            });
        });
    }

    /* ─────────────────────────────────────────
       5. ACTIVE NAV LINK
    ───────────────────────────────────────── */
    const page = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(a => {
        const href = a.getAttribute('href');
        if (href === page || (page === '' && href === 'index.html')) {
            a.classList.add('active');
        }
    });

    /* ─────────────────────────────────────────
       6. SCROLL FADE-UP ANIMATIONS
    ───────────────────────────────────────── */
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    observer.unobserve(e.target);
                }
            });
        },
        { threshold: 0.12 }
    );
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    /* ─────────────────────────────────────────
       7. TYPING EFFECT (hero page)
    ───────────────────────────────────────── */
    const typingEl = document.getElementById('typing-text');
    if (typingEl) {
        const phrasesTR = ['Yazılım Mühendisi', 'Flutter Geliştirici', 'Web Geliştirici', 'Mobil Uygulama Geliştirici'];
        const phrasesEN = ['Software Engineer', 'Flutter Developer', 'Web Developer', 'Mobile App Developer'];

        let phraseIdx = 0, charIdx = 0, deleting = false;

        function getCurrentPhrases() {
            return (localStorage.getItem(LANG_KEY) || 'tr') === 'tr' ? phrasesTR : phrasesEN;
        }

        function type() {
            const phrases = getCurrentPhrases();
            if (phraseIdx >= phrases.length) phraseIdx = 0;
            const current = phrases[phraseIdx];
            typingEl.textContent = current.substring(0, charIdx);
            if (!deleting) {
                charIdx++;
                if (charIdx > current.length) { deleting = true; setTimeout(type, 1500); return; }
            } else {
                charIdx--;
                if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; }
            }
            setTimeout(type, deleting ? 50 : 90);
        }
        type();
    }

    /* ─────────────────────────────────────────
       8. CONTACT FORM
    ───────────────────────────────────────── */
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let valid = true;
            const lang = localStorage.getItem(LANG_KEY) || 'tr';

            form.querySelectorAll('[required]').forEach(field => {
                const err = field.parentElement.querySelector('.form-error');
                if (!field.value.trim()) {
                    if (err) { err.style.display = 'block'; }
                    field.style.borderColor = '#f87171';
                    valid = false;
                } else {
                    if (err) err.style.display = 'none';
                    field.style.borderColor = '';
                }
            });

            // Email validation
            const emailField = form.querySelector('#email');
            if (emailField && emailField.value.trim()) {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const emailErr = emailField.parentElement.querySelector('.form-error');
                if (!re.test(emailField.value.trim())) {
                    if (emailErr) {
                        emailErr.textContent = T.contact?.errEmail?.[lang] || 'Geçerli bir e-posta adresi girin.';
                        emailErr.style.display = 'block';
                    }
                    emailField.style.borderColor = '#f87171';
                    valid = false;
                }
            }

            if (valid) {
                // Submit to Formspree
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<span class="spinner" style="font-size:14px;">⏳</span> <span data-i18n="contact.btnSend">Gönderiliyor...</span>';
                submitBtn.disabled = true;

                const formData = new FormData(form);

                fetch(form.action, {
                    method: form.method,
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                }).then(response => {
                    if (response.ok) {
                        const success = document.getElementById('form-success');
                        if (success) {
                            const lang2 = localStorage.getItem(LANG_KEY) || 'tr';
                            success.innerHTML = T.contact?.successMsg?.[lang2] || '✅ Mesajınız alındı!';
                            success.style.display = 'block';
                            form.reset();
                            setTimeout(() => { success.style.display = 'none'; }, 5000);
                        }
                    } else {
                        alert("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
                    }
                }).catch(error => {
                    alert("Ağ hatası oluştu. Lütfen bağlantınızı kontrol edin.");
                }).finally(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                });
            }
        });

        form.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('input', () => {
                const err = field.parentElement.querySelector('.form-error');
                if (err) err.style.display = 'none';
                field.style.borderColor = '';
            });
        });
    }

})();
