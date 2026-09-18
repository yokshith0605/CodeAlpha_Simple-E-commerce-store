/**
 * Simple E-Commerce Store - Vanilla JavaScript
 * Pure Client-Side Enhancements (No external frameworks)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const mainNav = document.getElementById('mainNav');

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      const isExpanded = mainNav.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileToggle.contains(e.target) && !mainNav.contains(e.target)) {
        mainNav.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 2. Auto-dismissing and dismissible Alert Messages
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach((alert) => {
    const closeBtn = alert.querySelector('.alert-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        alert.style.opacity = '0';
        alert.style.transform = 'translateY(-10px)';
        alert.style.transition = 'all 0.3s ease';
        setTimeout(() => alert.remove(), 300);
      });
    }

    // Auto-dismiss after 6 seconds for success messages
    if (alert.classList.contains('alert-success')) {
      setTimeout(() => {
        if (alert.parentElement) {
          alert.style.opacity = '0';
          alert.style.transition = 'opacity 0.5s ease';
          setTimeout(() => alert.remove(), 500);
        }
      }, 6000);
    }
  });

  // 3. Interactive Quantity Controls (+ / - buttons)
  const quantityControls = document.querySelectorAll('.quantity-control');
  quantityControls.forEach((control) => {
    const input = control.querySelector('.qty-input');
    const plusBtn = control.querySelector('.qty-btn-plus');
    const minusBtn = control.querySelector('.qty-btn-minus');

    if (input && plusBtn && minusBtn) {
      const maxStock = parseInt(input.getAttribute('max'), 10) || 999;
      const minVal = parseInt(input.getAttribute('min'), 10) || 1;

      plusBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let current = parseInt(input.value, 10) || minVal;
        if (current < maxStock) {
          input.value = current + 1;
          input.dispatchEvent(new Event('change'));
        }
      });

      minusBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let current = parseInt(input.value, 10) || minVal;
        if (current > minVal) {
          input.value = current - 1;
          input.dispatchEvent(new Event('change'));
        }
      });

      input.addEventListener('change', () => {
        let val = parseInt(input.value, 10);
        if (isNaN(val) || val < minVal) {
          input.value = minVal;
        } else if (val > maxStock) {
          input.value = maxStock;
        }
      });
    }
  });

  // 4. Confirmation dialog for destructive actions (e.g. Empty Cart, Delete Item)
  const confirmTriggers = document.querySelectorAll('[data-confirm]');
  confirmTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      const message = trigger.getAttribute('data-confirm') || 'Are you sure you want to proceed?';
      if (!window.confirm(message)) {
        e.preventDefault();
      }
    });
  });

  // 5. Checkout Form Client Validation Feedback
  const checkoutForm = document.querySelector('form.checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      const requiredInputs = checkoutForm.querySelectorAll('[required]');
      let hasError = false;

      requiredInputs.forEach((field) => {
        if (!field.value.trim()) {
          field.style.borderColor = 'var(--color-danger)';
          hasError = true;
        } else {
          field.style.borderColor = 'var(--color-border-dark)';
        }
      });

      if (hasError) {
        e.preventDefault();
        window.alert('Please complete all required shipping fields.');
      }
    });
  }
});
