
        /*==============================
        //  Headroom
        ===============================*/
        const header = document.querySelector('.headroom');

        const headroom = new Headroom(header, {
            offset: 100, 
            tolerance: {
                up: 5,  
                down: 10 
            },
            classes: {
                initial: "headroom",              
                pinned: "headroom-pinned",        
                unpinned: "headroom-unpinned",    
                top: "headroom--top",             
                notTop: "headroom--scrolled"     
            }
        });

        /*==============================
        //  Header Nav
        ===============================*/

        const sections = document.querySelectorAll('section');
        const links = document.querySelectorAll('.nav-links a');

        const highlightActiveLink = () => {
            let currentSection = '';
    
            sections.forEach((section) => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                    currentSection = section.id;
                }
            });
    
            links.forEach((link) => {
                link.classList.remove('active');
            });
    
            if (currentSection) {
                const activeLink = document.querySelector(`.nav-links a[href="#${currentSection}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        };
        window.addEventListener('scroll', highlightActiveLink);
    
        window.addEventListener('load', highlightActiveLink);
        headroom.init();
        
        /*==============================
        //  Marque
        ===============================*/
        const menuToggle = document.getElementById('menuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const closeMenu = document.getElementById('closeMenu');

        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closeMenu.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('active') && 
                !mobileMenu.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        // Prevent clicks inside the menu from closing it
        mobileMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Two-Part Marquee slider functionality
        const marqueeContainerRight = document.getElementById('marqueeContainerRight');
        const marqueeContainerLeft = document.getElementById('marqueeContainerLeft');
        const templateImages = [
        'images/hero/1.png', 
        'images/hero/2.png',
        'images/hero/3.png',
        'images/hero/4.png'
        ];

        function createTemplateCard(imgSrc) {
            const card = document.createElement('div');
            card.className = 'template-card';
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = 'Template';
            card.appendChild(img);
            return card;
        }

        function populateMarquee(container) {
            templateImages.forEach(imgSrc => {
                container.appendChild(createTemplateCard(imgSrc));
            });

            const initialCards = container.innerHTML;
            container.innerHTML += initialCards;
        }

        populateMarquee(marqueeContainerRight);
        populateMarquee(marqueeContainerLeft);

        [marqueeContainerRight, marqueeContainerLeft].forEach(container => {
            container.addEventListener('mouseenter', () => {
                container.style.animationPlayState = 'paused';
            });

            container.addEventListener('mouseleave', () => {
                container.style.animationPlayState = 'running';
            });
        }); 

        /*==============================
        //  Animation 
        ===============================*/

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const animationClass = entry.target.getAttribute('data-animation');
                    entry.target.classList.add(animationClass, 'animate__animated-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        document.querySelectorAll('.animate__animated').forEach((element) => {
            observer.observe(element);
        });


        /*==============================
        //  Counter
        ===============================*/
        document.addEventListener('DOMContentLoaded', () => {
            const counters = document.querySelectorAll('.stat-number');
            const animationDuration = 2000; // 2 seconds
            
            function easeOutCubic(t) {
                return 1 - Math.pow(1 - t, 3);
            }

            function animateCounter(counter, target) {
                const digitElement = counter.querySelector('.digit');
                const plusElement = counter.querySelector('.plus');
                let startTime;

                function updateCounter(currentTime) {
                    if (!startTime) startTime = currentTime;
                    const elapsedTime = currentTime - startTime;
                    const progress = Math.min(elapsedTime / animationDuration, 1);
                    const easedProgress = easeOutCubic(progress);
                    const currentValue = Math.floor(target * easedProgress);

                    digitElement.textContent = currentValue;
                    digitElement.style.transform = `translateY(${(1 - easedProgress) * 100}%)`;

                    if (plusElement) {
                        plusElement.style.opacity = easedProgress;
                        plusElement.style.transform = `translateY(${(1 - easedProgress) * 1}rem)`;
                    }

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    }
                }

                requestAnimationFrame(updateCounter);
            }

            function startCounters() {
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    animateCounter(counter, target);
                });
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        startCounters();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(document.querySelector('.banner'));
        });




