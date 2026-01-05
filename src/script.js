document.addEventListener('DOMContentLoaded', () => {
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
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
            logo.src = '../images/coloredlogo.svg';
        } else {
            header.classList.remove('scrolled');
            logo.src = '../images/whitelogo.svg';
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

    // Start auto-scroll if elements exist
    if (timelineItems.length > 0) {
        startAutoScroll();
    }

    // Waitlist Form Handling
    const waitlistForm = document.getElementById('waitlistForm');
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                useCase: document.getElementById('useCase').value,
                timestamp: new Date().toLocaleString()
            };

            const messageEl = document.getElementById('formMessage');
            const submitBtn = waitlistForm.querySelector('button[type="submit"]');
            
            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'SUBMITTING...';
            
            try {
                // Use Vercel API endpoint (secure proxy to Google Apps Script)
                const response = await fetch('/api/submit-waitlist', {
                    method: 'POST',
                    body: JSON.stringify(formData),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    messageEl.textContent = '✓ Successfully joined the waitlist!';
                    messageEl.className = 'form-message success';
                    messageEl.style.display = 'block';
                    waitlistForm.reset();
                    
                    setTimeout(() => {
                        messageEl.style.display = 'none';
                        messageEl.className = 'form-message';
                    }, 5000);
                } else {
                    throw new Error(result.message || 'Submission failed');
                }
            } catch (error) {
                messageEl.textContent = '✗ Error joining waitlist. Please try again.';
                messageEl.className = 'form-message error';
                messageEl.style.display = 'block';
                console.error('Error:', error);
            } finally {
                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.textContent = 'SUBMIT';
            }
        });
    }
});
