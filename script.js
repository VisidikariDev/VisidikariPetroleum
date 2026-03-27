document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('section[id]');
    const revealElements = document.querySelectorAll('.reveal');
    const progressBar = document.getElementById('progressBar');
    const contactForm = document.querySelector('.contact-form');
    const successPopup = document.getElementById('successPopup');
    const closePopup = document.getElementById('closePopup');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    navItems.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks && menuToggle) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    });

    function updateProgressBar() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    }

    function setActiveLink() {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navItems.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');

            if (href === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    function handleHeaderScroll() {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    if (contactForm) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            btnText.textContent = 'Sending...';

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json'
                    },
                    body: formData
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    contactForm.reset();

                    successPopup.classList.remove('active');
                    void successPopup.offsetWidth;
                    successPopup.classList.add('active');

                    setTimeout(() => {
                        successPopup.classList.remove('active');
                    }, 3200);
                } else {
                    alert(result.message || 'Something went wrong. Please try again.');
                }
            } catch (error) {
                alert('Network error. Please try again.');
                console.error(error);
            } finally {
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                btnText.textContent = 'Send Message';
            }
        });
    }

    if (closePopup) {
        closePopup.addEventListener('click', () => {
            successPopup.classList.remove('active');
        });
    }

    if (successPopup) {
        successPopup.addEventListener('click', (e) => {
            if (e.target === successPopup) {
                successPopup.classList.remove('active');
            }
        });
    }

    function revealOnScroll() {
        const triggerBottom = window.innerHeight * 0.88;

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < triggerBottom) {
                element.classList.add('active');
            }
        });
    }

    const backToTop = document.getElementById('backToTop');

    function handleBackToTop() {
        if (window.scrollY > 300) {
            backToTop.style.display = 'block';
        } else {
            backToTop.style.display = 'none';
        }
    }

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', () => {
        setActiveLink();
        handleHeaderScroll();
        revealOnScroll();
        handleBackToTop();
        updateProgressBar();
    });
});