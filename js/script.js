document.addEventListener('DOMContentLoaded', () => {
    // Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
        });
        
        // Close menu when a link is clicked
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }

    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    
    const cursorOutline = document.createElement('div');
    cursorOutline.className = 'cursor-outline';
    
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);

    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Dot follows immediately
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
        
        // Show cursor when mouse moves (in case it was hidden initially or off screen)
        cursorDot.style.opacity = 1;
        cursorOutline.style.opacity = 1;
    });

    // Outline follows with delay
    const animate = () => {
        // Smooth movement for outline
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
        
        requestAnimationFrame(animate);
    }
    
    animate();

    // Sticky Navbar with Logo Change
    const header = document.querySelector('header');
    const logo = document.querySelector('.logo img');
    const isHomePage = document.body.classList.contains('home-page');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
            // Only change logo on home page
            if (isHomePage) {
                logo.src = '../images/coloredlogo.svg';
            }
        } else {
            header.classList.remove('scrolled');
            // Only revert logo on home page
            if (isHomePage) {
                logo.src = '../images/whitelogo.svg';
            }
        }
    });

    // How It Works Section - Timeline Navigation
    let currentIndex = 0;
    let autoScrollInterval;
    const timelineItems = document.querySelectorAll('.timeline-item');
    const hiwImages = document.querySelectorAll('.hiw-image');
    const navArrowLeft = document.querySelector('.nav-arrow-left');
    const navArrowRight = document.querySelector('.nav-arrow-right');

    function showItem(index) {
        // Remove active class from all items
        timelineItems.forEach(item => item.classList.remove('active'));
        hiwImages.forEach(img => img.classList.remove('active'));
        
        // Add active class to current item
        if (timelineItems[index]) {
            timelineItems[index].classList.add('active');
        }
        if (hiwImages[index]) {
            hiwImages[index].classList.add('active');
        }
        
        currentIndex = index;
    }

    function nextItem() {
        const nextIndex = (currentIndex + 1) % timelineItems.length;
        showItem(nextIndex);
    }

    function prevItem() {
        const prevIndex = (currentIndex - 1 + timelineItems.length) % timelineItems.length;
        showItem(prevIndex);
    }

    function startAutoScroll() {
        autoScrollInterval = setInterval(nextItem, 15000); // 15 seconds
    }

    function resetAutoScroll() {
        clearInterval(autoScrollInterval);
        startAutoScroll();
    }

    // Arrow navigation
    if (navArrowRight) {
        navArrowRight.addEventListener('click', () => {
            nextItem();
            resetAutoScroll();
        });
    }

    if (navArrowLeft) {
        navArrowLeft.addEventListener('click', () => {
            prevItem();
            resetAutoScroll();
        });
    }

    // Timeline item click navigation
    timelineItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            showItem(index);
            resetAutoScroll();
        });
    });

    // Make images clickable to show corresponding text
    hiwImages.forEach((img, index) => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            showItem(index);
            resetAutoScroll();
        });
    });

    // Start auto-scroll if elements exist
    if (timelineItems.length > 0) {
        startAutoScroll();
    }

    // Waitlist Form Handling with FormSubmit
    const waitlistForm = document.getElementById('waitlistForm');
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', (e) => {
            // Show success message
            const messageEl = document.getElementById('formMessage');
            messageEl.textContent = '✓ Thank you! Your submission has been received. Redirecting...';
            messageEl.className = 'form-message success';
            messageEl.style.display = 'block';
            
            // Redirect after 2 seconds
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 2000);
        });
    }

});
