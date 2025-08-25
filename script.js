// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
  
    initializeInteractions();
});

// Animation System
function initializeAnimations() {
    // Setup Intersection Observer for fade-in animations
    const fadeElements = document.querySelectorAll('.intro-content, .skill-card, .todo-item, .section-title, .section-subtitle');
    
    fadeElements.forEach(element => {
        element.classList.add('fade-in-element');
    });
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add a small delay for staggered animations
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, 100);
                // Stop observing once animated
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all fade elements
    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });
    
    // Special handling for intro content on mobile
    if (window.innerWidth <= 768) {
        const introContent = document.querySelector('.intro-content');
        if (introContent) {
            // Ensure intro content is immediately visible on mobile
            setTimeout(() => {
                introContent.classList.add('visible');
            }, 100);
        }
    }
    
    // Typing effect for subtitle
    const subtitle = document.querySelector('.intro-subtitle');
    if (subtitle && window.innerWidth > 768) {
        const originalText = subtitle.textContent;
        subtitle.textContent = '';
        setTimeout(() => {
            typeWriter(subtitle, originalText, 30);
        }, 500);
    }
}

// Navigation System
function initializeNavigation() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const offset = window.innerWidth <= 768 ? 20 : 0;
                const targetPosition = target.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const mobileMenu = document.querySelector('.mobile-menu');
                const overlay = document.querySelector('.mobile-menu-overlay');
                const toggle = document.querySelector('.mobile-nav-toggle');
                
                if (mobileMenu && mobileMenu.classList.contains('open')) {
                    mobileMenu.classList.remove('open');
                    overlay.classList.remove('active');
                    toggle.classList.remove('active');
                }
            }
        });
    });
    
    // Update active nav link on scroll
    function updateActiveLink() {
        const scrollPosition = window.scrollY + window.innerHeight / 3;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Update desktop nav
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLinks[index]) {
                    navLinks[index].classList.add('active');
                }
                
                // Update mobile nav
                const mobileLinks = document.querySelectorAll('.mobile-menu-link');
                mobileLinks.forEach(link => link.classList.remove('active'));
                if (mobileLinks[index]) {
                    mobileLinks[index].classList.add('active');
                }
            }
        });
    }
    
    // Throttle scroll events for better performance
    let scrollTimer;
    window.addEventListener('scroll', () => {
        if (scrollTimer) {
            window.cancelAnimationFrame(scrollTimer);
        }
        scrollTimer = window.requestAnimationFrame(updateActiveLink);
    });
    
    // Initial update
    updateActiveLink();
    
    // No parallax or scroll effects - content stays visible
}

// Mobile Menu System
function initializeMobileMenu() {
    // Create mobile menu structure
    const body = document.body;
    
    // Create toggle button
    const toggle = document.createElement('div');
    toggle.className = 'mobile-nav-toggle';
    toggle.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    
    // Create mobile menu
    const mobileMenu = document.createElement('nav');
    mobileMenu.className = 'mobile-menu';
    
    // Create menu links
    const menuLinks = document.createElement('ul');
    menuLinks.className = 'mobile-menu-links';
    
    const sections = [
        { href: '#intro', text: 'Introduction' },
        { href: '#why-me', text: 'Why Me' },
        { href: '#together', text: 'What We Can Do' }
    ];
    
    sections.forEach(section => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = section.href;
        a.className = 'mobile-menu-link';
        a.textContent = section.text;
        li.appendChild(a);
        menuLinks.appendChild(li);
    });
    
    mobileMenu.appendChild(menuLinks);
    
    // Add contact info to mobile menu
    const contactInfo = document.createElement('div');
    contactInfo.style.marginTop = '2rem';
    contactInfo.style.paddingTop = '2rem';
    contactInfo.style.borderTop = '1px solid var(--border-color)';
    contactInfo.innerHTML = `
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">Contact</p>
        <a href="https://www.linkedin.com/in/javierriveroe/" target="_blank" class="mobile-menu-link" style="font-size: 0.95rem;">LinkedIn</a>
        <a href="mailto:josejavier.re@gmail.com" class="mobile-menu-link" style="font-size: 0.95rem;">Email</a>
    `;
    mobileMenu.appendChild(contactInfo);
    
    // Append elements to body
    body.appendChild(toggle);
    body.appendChild(overlay);
    body.appendChild(mobileMenu);
    
    // Toggle menu functionality
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        overlay.classList.toggle('active');
        body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    
    // Close menu when clicking overlay
    overlay.addEventListener('click', () => {
        toggle.classList.remove('active');
        mobileMenu.classList.remove('open');
        overlay.classList.remove('active');
        body.style.overflow = '';
    });
    
    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(() => {
                toggle.classList.remove('active');
                mobileMenu.classList.remove('open');
                overlay.classList.remove('active');
                body.style.overflow = '';
            }, 300);
        });
    });
    
    // Show/hide toggle based on screen size
    function checkScreenSize() {
        if (window.innerWidth > 768) {
            toggle.style.display = 'none';
            mobileMenu.classList.remove('open');
            overlay.classList.remove('active');
            body.style.overflow = '';
        } else {
            toggle.style.display = 'block';
        }
    }
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
}

// Interactive Elements
function initializeInteractions() {
    // Todo items interaction
    const todoItems = document.querySelectorAll('.todo-item');
    
    todoItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            this.classList.toggle('checked');
            
            // Visual feedback
            const checkbox = this.querySelector('.todo-checkbox');
            const checkIcon = this.querySelector('.check-icon');
            
            if (this.classList.contains('checked')) {
                celebrateCheck(this);
            }
            
            updateProgress();
        });
    });
    
    // Progress indicator
    function updateProgress() {
        const total = todoItems.length;
        const checked = document.querySelectorAll('.todo-item.checked').length;
        const percentage = (checked / total) * 100;
        
        // Create or update progress bar
        let progressBar = document.querySelector('.progress-bar');
        if (!progressBar && checked > 0) {
            progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            progressBar.style.cssText = `
                position: fixed;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%);
                padding: 0.75rem 1.5rem;
                background: var(--bg-primary);
                border: 2px solid var(--border-color);
                border-radius: 25px;
                box-shadow: var(--shadow-lg);
                font-weight: 600;
                color: var(--text-primary);
                z-index: 100;
                transition: all 0.3s ease;
                font-size: 0.9rem;
            `;
            document.body.appendChild(progressBar);
        }
        
        if (progressBar) {
            progressBar.textContent = `${checked}/${total} Goals Set`;
            progressBar.style.opacity = checked > 0 ? '1' : '0';
            
            if (percentage === 100) {
                progressBar.style.background = 'var(--text-primary)';
                progressBar.style.color = 'var(--bg-primary)';
                progressBar.style.borderColor = 'var(--text-primary)';
                progressBar.textContent = '🎯 Ready to Build!';
                
                setTimeout(() => {
                    progressBar.style.transform = 'translateX(-50%) scale(1.1)';
                }, 100);
                
                setTimeout(() => {
                    progressBar.style.transform = 'translateX(-50%) scale(1)';
                }, 300);
            }
        }
    }
    
    // Celebrate animation
    function celebrateCheck(element) {
        const rect = element.getBoundingClientRect();
        const particles = 8;
        
        for (let i = 0; i < particles; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
                width: 6px;
                height: 6px;
                background: ${Math.random() > 0.5 ? 'var(--text-primary)' : 'var(--accent-color)'};
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
            `;
            document.body.appendChild(particle);
            
            const angle = (Math.PI * 2 * i) / particles;
            const velocity = 2 + Math.random() * 2;
            const lifetime = 800;
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / lifetime;
                
                if (progress < 1) {
                    const x = Math.cos(angle) * velocity * progress * 40;
                    const y = Math.sin(angle) * velocity * progress * 40 - progress * progress * 80;
                    particle.style.transform = `translate(${x}px, ${y}px) scale(${1 - progress})`;
                    particle.style.opacity = 1 - progress;
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            };
            
            requestAnimationFrame(animate);
        }
    }
    
    // Add hover effects for project links
    const projectLinks = document.querySelectorAll('.project-link');
    projectLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-1px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// Utility Functions
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Handle viewport changes
window.addEventListener('resize', () => {
    // Check screen size for mobile menu
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const toggle = document.querySelector('.mobile-nav-toggle');
    
    if (window.innerWidth > 768 && mobileMenu && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        overlay.classList.remove('active');
        toggle.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Performance optimization: Disable animations when page is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations
        document.querySelectorAll('.fade-in-element').forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations
        document.querySelectorAll('.fade-in-element').forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
});
