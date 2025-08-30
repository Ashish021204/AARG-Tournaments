/***********************
  script.js (Updated)
  - Keeps your UI/validation/toast/modal code
  - Adds Google Sheets (Apps Script) posting
***********************/

/* ---------- CONFIG: paste your Google Apps Script Web App URL here ---------- */
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzeqlNC7llEUsLc7MMu-ns9EeGK4jdB-NVVaVseskV_tFOjFpM7yFECOPvsjdw7PxK7/exec "; 
/* Example: "https://script.google.com/macros/s/AKfycbx.../exec" */

/* ------------------ Modal open / close ------------------ */
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

/* ------------------ Smooth scroll ------------------ */
function scrollToHome() {
    document.getElementById('home').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

/* ------------------ Validation helpers ------------------ */
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

/* ------------------ Send to Google Sheets (Apps Script) ------------------
   Notes:
   - Replace GOOGLE_SCRIPT_URL with your deployed Apps Script Web App URL.
   - We use mode: "no-cors" because Google Apps Script and GitHub Pages require it.
   - no-cors prevents reading a response, but Apps Script will still receive the POST.
------------------------------------------------------------------------- */
async function sendToGoogleSheet(formDataObj) {
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes("PASTE_YOUR_GOOGLE_SCRIPT_URL_HERE")) {
        console.warn("Google Script URL not set. Skipping sendToGoogleSheet.");
        return;
    }

    try {
        // Apps Script expects JSON in e.postData.contents if you parse it that way.
        await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formDataObj)
        });
        // can't inspect response due to no-cors — assume success if no network error
    } catch (err) {
        // network-level errors (very rare with no-cors) will be caught here
        console.error("Error posting to Google Script:", err);
    }
}

/* ------------------ Form submission handling (single source of truth) ------------------ */
(function wireFormSubmission() {
    const form = document.getElementById('registrationForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // If any other submit listeners exist in the page, our validation is authoritative.
        // Prevent double-handling by disabling the submit button early.
        const submitBtn = document.querySelector('.submit-btn');
        const originalText = submitBtn ? submitBtn.innerHTML : null;

        // Run validation
        if (!validateForm()) return;

        // Show loading state
        if (submitBtn) {
            submitBtn.innerHTML = '⏳ Submitting...';
            submitBtn.disabled = true;
        }

        // Collect form data
        const formDataObj = {
            name: document.getElementById('name').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            email: document.getElementById('email').value.trim(),
            teamName: document.getElementById('teamName').value.trim(),
            utrNumber: document.getElementById('utrNumber').value.trim(),
            submittedAt: new Date().toISOString()
        };

        // Send to Google Sheet (fire-and-forget; no-cors means we can't reliably read response)
        await sendToGoogleSheet(formDataObj);

        // Show success toast
        showSuccessToast();

        // Reset button and re-enable
        if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }

        // Close modal after short delay (keeps same UX as before)
        setTimeout(() => {
            closeRegistration();
        }, 2000);
    });
})();

/* ------------------ Success toast notification ------------------ */
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

/* ------------------ Real-time validation (clear errors while typing) ------------------ */
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('#registrationForm input');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            const errorElement = document.getElementById(input.id + 'Error');
            if (errorElement && errorElement.classList.contains('show')) {
                errorElement.classList.remove('show');
                errorElement.textContent = '';
            }
        });
    });
});

/* ------------------ Close modal when clicking outside ------------------ */
document.getElementById('registrationModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeRegistration();
    }
});

/* ------------------ Keyboard navigation ------------------ */
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('registrationModal');
        if (modal.classList.contains('show')) {
            closeRegistration();
        }
    }
});

/* ------------------ Interactive effects (cards, hero parallax) ------------------ */
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
