// ========================================
// CONTACT FORM MANAGEMENT MODULE
// ========================================

import { utils } from './utils.js';

export class ContactFormManager {
    constructor() {
        this.form = utils.getElement('#contactForm');
        this.isSubmitting = false;
        this.validationRules = {
            required: (value) => value.trim() !== '',
            email: (value) => utils.isValidEmail(value),
            minLength: (value, min = 3) => value.trim().length >= min,
            maxLength: (value, max = 500) => value.trim().length <= max
        };
        this.init();
    }

    init() {
        if (this.form) {
            this.setupEventListeners();
            this.setupValidation();
            this.setupFormElements();
        }
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldErrors(input));
        });
    }

    setupValidation() {
        // Set up validation rules for each field
        this.fieldRules = {
            name: ['required', 'minLength:2', 'maxLength:50'],
            email: ['required', 'email'],
            subject: ['required', 'minLength:5', 'maxLength:100'],
            message: ['required', 'minLength:10', 'maxLength:1000']
        };
    }

    setupFormElements() {
        // Add helpful attributes and styling
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            // Add character counter for textarea
            if (input.tagName === 'TEXTAREA') {
                this.addCharacterCounter(input);
            }
            
            // Add focus styling
            this.addFocusEffects(input);
        });
    }

    addCharacterCounter(textarea) {
        const maxLength = parseInt(textarea.getAttribute('maxlength')) || 1000;
        const counter = utils.createElement('div', {
            className: 'character-counter',
            textContent: `0 / ${maxLength}`
        });
        
        textarea.parentNode.appendChild(counter);
        
        textarea.addEventListener('input', () => {
            const currentLength = textarea.value.length;
            counter.textContent = `${currentLength} / ${maxLength}`;
            
            if (currentLength > maxLength * 0.8) {
                counter.classList.add('warning');
            } else {
                counter.classList.remove('warning');
            }
        });
    }

    addFocusEffects(input) {
        input.addEventListener('focus', () => {
            input.parentNode.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value.trim()) {
                input.parentNode.classList.remove('focused');
            }
        });
    }

    validateField(field) {
        const fieldName = field.name;
        const fieldRules = this.fieldRules[fieldName] || [];
        const value = field.value.trim();
        
        this.clearFieldErrors(field);
        
        for (const rule of fieldRules) {
            const [ruleName, ruleParam] = rule.split(':');
            const isValid = this.applyValidationRule(value, ruleName, ruleParam);
            
            if (!isValid) {
                const errorMessage = this.getErrorMessage(fieldName, ruleName, ruleParam);
                this.showFieldError(field, errorMessage);
                return false;
            }
        }
        
        this.showFieldSuccess(field);
        return true;
    }

    applyValidationRule(value, ruleName, ruleParam) {
        switch (ruleName) {
            case 'required':
                return this.validationRules.required(value);
            case 'email':
                return !value || this.validationRules.email(value);
            case 'minLength':
                return this.validationRules.minLength(value, parseInt(ruleParam));
            case 'maxLength':
                return this.validationRules.maxLength(value, parseInt(ruleParam));
            default:
                return true;
        }
    }

    getErrorMessage(fieldName, ruleName, ruleParam) {
        const messages = {
            required: `${this.capitalizeFieldName(fieldName)} is required`,
            email: 'Please enter a valid email address',
            minLength: `${this.capitalizeFieldName(fieldName)} must be at least ${ruleParam} characters`,
            maxLength: `${this.capitalizeFieldName(fieldName)} must not exceed ${ruleParam} characters`
        };
        
        return messages[ruleName] || 'Invalid input';
    }

    capitalizeFieldName(fieldName) {
        return fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
    }

    showFieldError(field, message) {
        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true');
        
        const errorElement = utils.createElement('div', {
            className: 'field-error',
            textContent: message,
            role: 'alert'
        });
        
        field.parentNode.appendChild(errorElement);
    }

    showFieldSuccess(field) {
        field.classList.add('valid');
        field.classList.remove('error');
        field.setAttribute('aria-invalid', 'false');
    }

    clearFieldErrors(field) {
        field.classList.remove('error', 'valid');
        field.removeAttribute('aria-invalid');
        
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input, textarea');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });
        
        return isFormValid;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        if (!this.validateForm()) {
            this.showFormMessage('Please correct the errors above', 'error');
            return;
        }
        
        await this.submitForm();
    }

    async submitForm() {
        this.isSubmitting = true;
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Update button state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        
        try {
            const formData = this.getFormData();
            
            // Simulate API call (replace with actual submission)
            await this.simulateFormSubmission(formData);
            
            this.handleSubmissionSuccess();
            
        } catch (error) {
            this.handleSubmissionError(error);
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            this.isSubmitting = false;
        }
    }

    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }

    async simulateFormSubmission(data) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate occasional failures for testing
        if (Math.random() < 0.1) {
            throw new Error('Network error occurred');
        }
        
        console.log('Form submitted:', data);
        return { success: true };
    }

    handleSubmissionSuccess() {
        this.showFormMessage(
            'Thank you! Your message has been sent successfully. I\'ll get back to you soon!', 
            'success'
        );
        this.form.reset();
        this.clearAllFieldErrors();
        
        // Dispatch success event
        this.dispatchFormEvent('formSubmissionSuccess');
        
        // Optional: scroll to success message
        const messageElement = this.form.querySelector('.form-message');
        if (messageElement) {
            messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    handleSubmissionError(error) {
        console.error('Form submission error:', error);
        this.showFormMessage(
            'Sorry, there was an error sending your message. Please try again or contact me directly.', 
            'error'
        );
        
        // Dispatch error event
        this.dispatchFormEvent('formSubmissionError', { error: error.message });
    }

    showFormMessage(text, type) {
        // Remove existing message
        this.clearFormMessage();
        
        const messageElement = utils.createElement('div', {
            className: `form-message form-message--${type}`,
            innerHTML: `
                <div class="message-content">
                    <i class="message-icon fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                    <span class="message-text">${text}</span>
                </div>
            `,
            role: 'alert'
        });
        
        this.form.appendChild(messageElement);
        
        // Auto-remove after delay (except for success messages)
        if (type !== 'success') {
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 8000);
        }
    }

    clearFormMessage() {
        const existingMessage = this.form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
    }

    clearAllFieldErrors() {
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            this.clearFieldErrors(input);
            input.parentNode.classList.remove('focused');
        });
    }

    dispatchFormEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, {
            detail: { 
                ...detail, 
                timestamp: Date.now(),
                formData: this.getFormData()
            }
        });
        document.dispatchEvent(event);
    }

    // Public methods
    reset() {
        this.form.reset();
        this.clearAllFieldErrors();
        this.clearFormMessage();
    }

    isValid() {
        return this.validateForm();
    }

    getData() {
        return this.getFormData();
    }

    setFieldValue(fieldName, value) {
        const field = this.form.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.value = value;
            this.validateField(field);
        }
    }

    focusFirstErrorField() {
        const errorField = this.form.querySelector('.error');
        if (errorField) {
            errorField.focus();
        }
    }
}