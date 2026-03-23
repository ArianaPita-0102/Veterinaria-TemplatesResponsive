document.addEventListener('DOMContentLoaded', () => {
  setupMobileMenu();
  setupServiceFilter();
  setupSlider();
  setupModal();
  setupAccordion();
  setupContactFormValidation();
  setupBackToTop();
});

function setupMobileMenu() {
  const toggleButton = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggleButton || !navLinks) return;

  toggleButton.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggleButton.setAttribute('aria-expanded', String(isOpen));
    toggleButton.textContent = isOpen ? '✕' : '☰';
  });
}

function setupServiceFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.service-card');

  if (!buttons.length || !cards.length) return;

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const selectedFilter = button.dataset.filter;

      buttons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');

      cards.forEach((card) => {
        const category = card.dataset.category;
        const shouldShow = selectedFilter === 'all' || selectedFilter === category;
        card.classList.toggle('hidden', !shouldShow);
      });
    });
  });
}

function setupSlider() {
  const slider = document.querySelector('[data-slider]');
  if (!slider) return;

  const slides = slider.querySelectorAll('[data-slide]');
  const nextButton = slider.querySelector('[data-slider-next]');
  const prevButton = slider.querySelector('[data-slider-prev]');

  if (!slides.length || !nextButton || !prevButton) return;

  let currentIndex = 0;

  const updateSlide = (index) => {
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('active', slideIndex === index);
    });
  };

  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlide(currentIndex);
  });

  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlide(currentIndex);
  });

  setInterval(() => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlide(currentIndex);
  }, 6000);
}

function setupModal() {
  const modal = document.getElementById('serviceModal');
  const openButtons = document.querySelectorAll('[data-modal-target]');

  if (!modal || !openButtons.length) return;

  const closeButton = modal.querySelector('.modal-close');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');

  const modalContent = {
    generalModal: {
      title: 'Exámenes de bienestar',
      description: 'Incluye chequeo general, evaluación nutricional y recomendaciones preventivas con seguimiento.'
    },
    surgeryModal: {
      title: 'Cirugía y hospitalización',
      description: 'Procedimientos programados y de urgencia con monitoreo anestésico y control postoperatorio.'
    },
    vaccineModal: {
      title: 'Vacunación y desparasitación',
      description: 'Protocolos personalizados para mantener la protección completa según etapa de vida y entorno.'
    },
    diagModal: {
      title: 'Diagnóstico avanzado',
      description: 'Laboratorio clínico e imagenología para decisiones rápidas y tratamientos más precisos.'
    },
    urgentModal: {
      title: 'Urgencias 24/7',
      description: 'Atención de emergencias con triage inmediato y estabilización en minutos críticos.'
    },
    pharmacyModal: {
      title: 'Farmacia clínica',
      description: 'Medicamentos seguros, dosis ajustadas y planes de soporte nutricional para recuperación óptima.'
    }
  };

  const openModal = (key) => {
    const selected = modalContent[key];
    if (selected && modalTitle && modalDescription) {
      modalTitle.textContent = selected.title;
      modalDescription.textContent = selected.description;
    }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  };

  openButtons.forEach((button) => {
    button.addEventListener('click', () => {
      openModal(button.dataset.modalTarget);
    });
  });

  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

function setupAccordion() {
  const triggers = document.querySelectorAll('.accordion-trigger');
  if (!triggers.length) return;

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      if (!item) return;

      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!expanded));
      item.classList.toggle('active', !expanded);
    });
  });
}

function setupContactFormValidation() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const feedback = document.getElementById('formFeedback');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');
    const privacy = document.getElementById('privacy');

    let isValid = true;

    clearErrors();

    if (name && name.value.trim().length < 3) {
      setError('nameError', 'Ingresa un nombre válido (mínimo 3 caracteres).');
      isValid = false;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      setError('emailError', 'Ingresa un correo electrónico válido.');
      isValid = false;
    }

    if (phone && !/^\d{7,15}$/.test(phone.value.trim())) {
      setError('phoneError', 'Ingresa un teléfono válido (7 a 15 dígitos).');
      isValid = false;
    }

    if (subject && !subject.value) {
      setError('subjectError', 'Selecciona un asunto.');
      isValid = false;
    }

    if (message && message.value.trim().length < 15) {
      setError('messageError', 'El mensaje debe tener al menos 15 caracteres.');
      isValid = false;
    }

    if (privacy && !privacy.checked) {
      setError('privacyError', 'Debes aceptar el tratamiento de datos.');
      isValid = false;
    }

    if (!feedback) return;

    if (isValid) {
      feedback.textContent = '¡Gracias! Tu solicitud fue enviada correctamente.';
      feedback.classList.add('success');
      feedback.classList.remove('error');
      form.reset();
    } else {
      feedback.textContent = 'Revisa los campos marcados para continuar.';
      feedback.classList.add('error');
      feedback.classList.remove('success');
    }
  });
}

function setError(id, message) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = message;
  }
}

function clearErrors() {
  const errors = document.querySelectorAll('.error-msg');
  errors.forEach((error) => {
    error.textContent = '';
  });
}

function setupBackToTop() {
  const button = document.querySelector('.back-to-top');
  if (!button) return;

  const toggleVisibility = () => {
    button.classList.toggle('visible', window.scrollY > 350);
  };

  window.addEventListener('scroll', toggleVisibility);

  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}