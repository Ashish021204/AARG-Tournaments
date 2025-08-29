function openRegistration() {
    const modal = document.getElementById('registrationModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeRegistration() {
    const modal = document.getElementById('registrationModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    
    // Clear form and errors
    document.getElementById('registrationForm').reset();
    clearAllErrors();
}

// Smooth scroll to home
function scrollToHome() {
    document.getElementById('home').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Form validation
function validateForm() {
    const fields = [
        { id: 'name', name: 'Name' },
        { id: 'phone', name: 'Phone Number' },
        { id: 'email', name: 'Email Address' },
        { id: 'teamName', name: 'Team Name' },
        { id: 'utrNumber', name: 'UTR Number' }
    ];
    
    let isValid = true;
    
    // Clear previous errors
    clearAllErrors();
    
    fields.forEach(field => {
        const input = document.getElementById(field.id);
        const errorElement = document.getElementById(field.id + 'Error');
        
        if (!input.value.trim()) {
            showError(errorElement, 'Please enter the field');
            isValid = false;
        }
    });
    
    // Additional email validation
    const email = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    if (email.value.trim() && !isValidEmail(email.value)) {
        showError(emailError, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Additional phone validation
    const phone = document.getElementById('phone');
    const phoneError = document.getElementById('phoneError');
    if (phone.value.trim() && !isValidPhone(phone.value)) {
        showError(phoneError, 'Please enter a valid phone number');
        isValid = false;
    }
    
    return isValid;
}

function showError(errorElement, message) {
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.classList.remove('show');
        element.textContent = '';
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9]{10,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Form submission
document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateForm()) {
        // Show success message
        showSuccessToast();
        
        // Close modal after short delay
        setTimeout(() => {
            closeRegistration();
        }, 2000);
    }
});

// Success toast notification
function showSuccessToast() {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">✅</span>
            <div class="toast-text">
                <strong>Registration Successful!</strong>
                <p>Your tournament registration has been submitted successfully.</p>
            </div>
        </div>
    `;
    
    // Add toast styles
    const toastStyles = `
        .success-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #00ffa1, #ff6b35);
            color: #000;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            z-index: 3000;
            animation: slideIn 0.3s ease-out;
            max-width: 400px;
            box-shadow: 0 10px 30px rgba(0, 255, 161, 0.3);
        }
        
        .toast-content {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
        }
        
        .toast-icon {
            font-size: 1.5rem;
        }
        
        .toast-text strong {
            display: block;
            font-weight: 600;
            margin-bottom: 0.25rem;
        }
        
        .toast-text p {
            margin: 0;
            font-size: 0.9rem;
            opacity: 0.8;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    
    // Add styles if not already added
    if (!document.getElementById('toast-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'toast-styles';
        styleSheet.textContent = toastStyles;
        document.head.appendChild(styleSheet);
    }
    
    // Add toast to body
    document.body.appendChild(toast);
    
    // Remove toast after 4 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 4000);
}

// Real-time validation (clear errors when user starts typing)
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('#registrationForm input');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            const errorElement = document.getElementById(input.id + 'Error');
            if (errorElement.classList.contains('show')) {
                errorElement.classList.remove('show');
            }
        });
    });
});

// Close modal when clicking outside
document.getElementById('registrationModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeRegistration();
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('registrationModal');
        if (modal.classList.contains('show')) {
            closeRegistration();
        }
    }
});

// Smooth scrolling for internal links
document.addEventListener('DOMContentLoaded', function() {
    // Add some interactive effects
    const cards = document.querySelectorAll('.info-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add parallax effect to hero background
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
});

// Add loading animation to submit button
document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    if (validateForm()) {
        // Show loading state
        submitBtn.innerHTML = '⏳ Submitting...';
        submitBtn.disabled = true;
        
        // Simulate processing time
        setTimeout(() => {
            showSuccessToast();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Close modal
            setTimeout(() => {
                closeRegistration();
            }, 2000);
        }, 1500);
    }
});