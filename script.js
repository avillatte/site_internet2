// Script principal pour le site KM Éducateur Canin

document.addEventListener("DOMContentLoaded", function() {
    // Initialisation des fonctionnalités communes
    
    // Gestion de la navigation active
    highlightActiveNav();
    
    // Initialisation des animations
    initAnimations();
    
    // Gestion des formulaires
    initForms();
    
    // Gestion des popups
    initPopups();
});

// Mise en surbrillance de la navigation active
function highlightActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}

// Initialisation des animations
function initAnimations() {
    // Animation au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observer les éléments à animer
    document.querySelectorAll('.service-card, .blog-post').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Gestion des formulaires
function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Validation en temps réel
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    });
}

// Validation d'un champ de formulaire
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Réinitialiser l'état d'erreur
    clearFieldError(field);
    
    // Validation selon le type de champ
    switch(field.type) {
        case 'email':
            if (value && !isValidEmail(value)) {
                isValid = false;
                errorMessage = 'Veuillez entrer une adresse email valide';
            }
            break;
            
        case 'tel':
            if (value && !isValidPhone(value)) {
                isValid = false;
                errorMessage = 'Veuillez entrer un numéro de téléphone valide';
            }
            break;
            
        default:
            if (field.required && !value) {
                isValid = false;
                errorMessage = 'Ce champ est obligatoire';
            }
    }
    
    // Afficher l'erreur si nécessaire
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Afficher une erreur de champ
function showFieldError(field, message) {
    field.style.borderColor = '#e63946';
    
    // Créer ou mettre à jour le message d'erreur
    let errorElement = field.parentNode.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.color = '#e63946';
    errorElement.style.fontSize = '0.9em';
    errorElement.style.marginTop = '5px';
}

// Effacer l'erreur d'un champ
function clearFieldError(field) {
    field.style.borderColor = '';
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

// Validation d'email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validation de téléphone (format français)
function isValidPhone(phone) {
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Gestion des popups
function initPopups() {
    // Fermer les popups avec ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllPopups();
        }
    });
}

function closeAllPopups() {
    const popups = document.querySelectorAll('.popup');
    popups.forEach(popup => {
        popup.style.display = 'none';
    });
}

// Fonction pour envoyer des données de formulaire
async function sendFormData(formData, endpoint) {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de l\'envoi du formulaire');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
}

// Gestion du responsive menu (pour mobile)
function initMobileMenu() {
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '☰';
    menuToggle.style.display = 'none';
    
    const nav = document.querySelector('nav');
    nav.appendChild(menuToggle);
    
    menuToggle.addEventListener('click', function() {
        const menu = document.querySelector('.menu');
        menu.classList.toggle('active');
    });
    
    // Cacher/afficher le menu toggle selon la taille de l'écran
    function checkScreenSize() {
        if (window.innerWidth <= 768) {
            menuToggle.style.display = 'block';
        } else {
            menuToggle.style.display = 'none';
            document.querySelector('.menu').classList.remove('active');
        }
    }
    
    window.addEventListener('resize', checkScreenSize);
    checkScreenSize();
}

// Initialiser le menu mobile si nécessaire
if (document.querySelector('nav')) {
    initMobileMenu();
}

// Export des fonctions pour une utilisation globale
window.KMEducateurCanin = {
    validateField,
    isValidEmail,
    isValidPhone,
    sendFormData,
    closeAllPopups
};