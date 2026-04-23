/**
 * INK ASYLUM — Booking Form Validation & UX
 * Inline validation, elegant error states, submit handling
 */

(function () {
  'use strict';

  const form       = document.getElementById('bookingForm');
  const submitBtn  = document.getElementById('submitBtn');
  const successMsg = document.getElementById('formSuccess');

  if (!form) return;

  /* ============================================================
     VALIDATION RULES
  ============================================================ */
  const rules = {
    firstName: {
      required: true,
      minLength: 2,
      pattern:   /^[a-zA-ZÀ-ÿăîâșțĂÎÂȘȚ\s'-]+$/,
      messages: {
        required:  'Prenumele este obligatoriu.',
        minLength: 'Prenumele trebuie să aibă cel puțin 2 caractere.',
        pattern:   'Prenumele conține caractere invalide.',
      },
    },
    lastName: {
      required: true,
      minLength: 2,
      pattern:   /^[a-zA-ZÀ-ÿăîâșțĂÎÂȘȚ\s'-]+$/,
      messages: {
        required:  'Numele este obligatoriu.',
        minLength: 'Numele trebuie să aibă cel puțin 2 caractere.',
        pattern:   'Numele conține caractere invalide.',
      },
    },
    email: {
      required: true,
      // RFC 5322 simplified — no eval, no XSS risk
      pattern: /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']{2,}$/,
      messages: {
        required: 'Adresa de email este obligatorie.',
        pattern:  'Introduceți o adresă de email validă.',
      },
    },
    phone: {
      required: true,
      // Romanian / international phone numbers
      pattern:  /^[+]?[\d\s\-().]{7,20}$/,
      messages: {
        required: 'Numărul de telefon este obligatoriu.',
        pattern:  'Introduceți un număr de telefon valid.',
      },
    },
    service: {
      required: true,
      messages: {
        required: 'Vă rugăm selectați un serviciu.',
      },
    },
  };

  /* ============================================================
     VALIDATE SINGLE FIELD
  ============================================================ */
  function validateField(name, value) {
    const rule = rules[name];
    if (!rule) return null; // no rule = always valid

    const trimmed = value.trim();

    if (rule.required && !trimmed) {
      return rule.messages.required;
    }
    if (trimmed && rule.minLength && trimmed.length < rule.minLength) {
      return rule.messages.minLength;
    }
    if (trimmed && rule.pattern && !rule.pattern.test(trimmed)) {
      return rule.messages.pattern;
    }

    return null; // valid
  }

  /* ============================================================
     SHOW / CLEAR FIELD ERROR
  ============================================================ */
  function showError(fieldName, message) {
    const input = form.elements[fieldName];
    const errorEl = document.getElementById(fieldName + 'Error');
    const group   = input ? input.closest('.form-group') : null;

    if (errorEl) errorEl.textContent = message || '';
    if (group) {
      group.classList.toggle('error', !!message);
    }
  }

  function clearError(fieldName) {
    showError(fieldName, '');
  }

  /* ============================================================
     LIVE VALIDATION (on blur & input after first touch)
  ============================================================ */
  const touched = new Set();

  Object.keys(rules).forEach((name) => {
    const input = form.elements[name];
    if (!input) return;

    input.addEventListener('blur', () => {
      touched.add(name);
      const err = validateField(name, input.value);
      showError(name, err);
    });

    input.addEventListener('input', () => {
      if (!touched.has(name)) return;
      const err = validateField(name, input.value);
      showError(name, err);
    });

    // Extra UX: clear error immediately when user starts typing after error
    input.addEventListener('keydown', () => {
      if (touched.has(name) && !validateField(name, input.value)) {
        clearError(name);
      }
    });
  });

  /* ============================================================
     FORM SUBMIT
  ============================================================ */
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all fields
    let hasError = false;

    Object.keys(rules).forEach((name) => {
      const input = form.elements[name];
      if (!input) return;
      const err = validateField(name, input.value);
      if (err) {
        showError(name, err);
        touched.add(name);
        hasError = true;
      }
    });

    if (hasError) {
      // Scroll to first error
      const firstError = form.querySelector('.form-group.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.querySelector('input, select, textarea')?.focus();
      }
      return;
    }

    // --- Simulate submission ---
    submitBtn.classList.add('submitting');
    const btnText    = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    if (btnText)    btnText.style.display    = 'none';
    if (btnLoading) btnLoading.style.display = 'inline';

    // Normally you'd fetch('/api/booking', { method: 'POST', body: formData })
    // Here we simulate a 2s network delay:
    setTimeout(() => {
      submitBtn.classList.remove('submitting');
      if (btnText)    btnText.style.display    = '';
      if (btnLoading) btnLoading.style.display = 'none';

      // Show success
      form.querySelectorAll('input, textarea, select').forEach((el) => {
        el.value = '';
      });
      touched.clear();

      if (successMsg) {
        successMsg.style.display = 'flex';
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Hide success message after 6s
        setTimeout(() => {
          successMsg.style.display = 'none';
        }, 6000);
      }
    }, 2000);
  });

})();
