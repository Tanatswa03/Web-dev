class ProfileSettings {
    constructor() {
        this.state = {
            profileForm: {
                username: '',
                email: ''
            },
            passwordForm: {
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            },
            error: '',
            success: ''
        };

        this.init();
    }

    init() {
        // Get form elements
        this.profileForm = document.getElementById('profile-form');
        this.passwordForm = document.getElementById('password-form');
        this.errorContainer = document.getElementById('error-container');
        this.successContainer = document.getElementById('success-container');

        // Get input elements
        this.usernameInput = document.getElementById('username');
        this.emailInput = document.getElementById('email');
        this.currentPasswordInput = document.getElementById('current-password');
        this.newPasswordInput = document.getElementById('new-password');
        this.confirmPasswordInput = document.getElementById('confirm-password');

        // Get loading spinners
        this.profileLoadingSpinner = this.profileForm.querySelector('.loading');
        this.passwordLoadingSpinner = this.passwordForm.querySelector('.loading');

        this.bindEvents();
    }

    bindEvents() {
        // Profile form events
        this.profileForm.addEventListener('submit', (e) => this.handleProfileSubmit(e));
        this.usernameInput.addEventListener('input', (e) => {
            this.state.profileForm.username = e.target.value;
            this.validateField(e.target);
        });
        this.emailInput.addEventListener('input', (e) => {
            this.state.profileForm.email = e.target.value;
            this.validateField(e.target);
        });

        // Password form events
        this.passwordForm.addEventListener('submit', (e) => this.handlePasswordSubmit(e));
        this.currentPasswordInput.addEventListener('input', (e) => {
            this.state.passwordForm.currentPassword = e.target.value;
            this.validateField(e.target);
        });
        this.newPasswordInput.addEventListener('input', (e) => {
            this.state.passwordForm.newPassword = e.target.value;
            this.validateField(e.target);
        });
        this.confirmPasswordInput.addEventListener('input', (e) => {
            this.state.passwordForm.confirmPassword = e.target.value;
            this.validateField(e.target);
        });
    }

    validateField(input) {
        const parent = input.parentElement;
        parent.classList.remove('error', 'success');
        
        if (input.type === 'email' && !this.validateEmail(input.value)) {
            parent.classList.add('error');
        } else if (input.type === 'password' && input.value.length < 8 && input.value.length > 0) {
            parent.classList.add('error');
        } else if (input.value.length > 0) {
            parent.classList.add('success');
        }
    }

    setError(message) {
        this.state.error = message;
        this.state.success = '';
        this.errorContainer.textContent = message;
        this.errorContainer.style.display = 'block';
        this.successContainer.style.display = 'none';
    }

    setSuccess(message) {
        this.state.success = message;
        this.state.error = '';
        this.successContainer.textContent = message;
        this.successContainer.style.display = 'block';
        this.errorContainer.style.display = 'none';
    }

    clearMessages() {
        this.state.error = '';
        this.state.success = '';
        this.errorContainer.style.display = 'none';
        this.successContainer.style.display = 'none';
    }

    setLoading(form, isLoading) {
        const spinner = form === this.profileForm ? 
            this.profileLoadingSpinner : 
            this.passwordLoadingSpinner;
        const button = form.querySelector('.btn');
        
        if (isLoading) {
            spinner.style.display = 'inline-block';
            button.disabled = true;
            button.style.opacity = '0.7';
        } else {
            spinner.style.display = 'none';
            button.disabled = false;
            button.style.opacity = '1';
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async handleProfileSubmit(e) {
        e.preventDefault();
        this.clearMessages();

        if (!this.validateEmail(this.state.profileForm.email)) {
            this.setError('Please enter a valid email address');
            return;
        }

        try {
            this.setLoading(this.profileForm, true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            // await updateProfile(this.state.profileForm);
            this.setSuccess('Profile updated successfully!');
        } catch (error) {
            this.setError('Failed to update profile. Please try again.');
        } finally {
            this.setLoading(this.profileForm, false);
        }
    }

    async handlePasswordSubmit(e) {
        e.preventDefault();
        this.clearMessages();

        if (this.state.passwordForm.newPassword.length < 8) {
            this.setError('New password must be at least 8 characters long');
            return;
        }

        if (this.state.passwordForm.newPassword !== this.state.passwordForm.confirmPassword) {
            this.setError('New passwords do not match');
            return;
        }

        try {
            this.setLoading(this.passwordForm, true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            // await updatePassword(this.state.passwordForm);
            this.setSuccess('Password updated successfully!');
            this.passwordForm.reset();
            this.state.passwordForm = {
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            };
        } catch (error) {
            this.setError('Failed to update password. Please try again.');
        } finally {
            this.setLoading(this.passwordForm, false);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ProfileSettings();
});