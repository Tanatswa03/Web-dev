// Utility functions for form validation
const validators = {
  username: async (value) => {
    if (!value) return 'Username is required';
    if (value.length < 3) return 'Username must be at least 3 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers and underscore';
    
    // Check username availability
    try {
      const response = await fetch('/api/check-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: value })
      });
      const data = await response.json();
      if (data.exists) return 'Username is already taken';
    } catch (error) {
      console.error('Username check failed:', error);
    }
    return null;
  },
  
  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
    return null;
  }
};

// Helper function to show error messages
const showError = (fieldId, message) => {
  const errorElement = document.getElementById(`${fieldId}-error`);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = message ? 'block' : 'none';
  }
};

// Helper function to validate form fields
const validateField = async (fieldId, value) => {
  const validator = validators[fieldId];
  if (!validator) return null;
  
  const error = await validator(value);
  showError(fieldId, error);
  return error;
};

// Handle successful authentication
const handleAuthSuccess = (data) => {
  // Store token in localStorage
  localStorage.setItem('authToken', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  const handleAuthSuccess = (data) => {
    // ... (existing code: store token, user data, redirect)
  
    // Create a Notification
    const notification = new Notification('Login Successful', {
      body: 'You have successfully logged in.',
      icon: '/path/to/your/icon.png' // Replace with your icon path
    });
  
    // Handle notification clicks
    notification.onclick = () => {
      // Redirect to a specific page or perform other actions
      window.location.href = '/dashboard'; // Example: Redirect to dashboard
    };
  };
  // Redirect to dashboard
  window.location.href = '/dashboard';
};

// Handle login form
const setupLoginForm = () => {
  const form = document.querySelector('.container');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = form.querySelector('input[type="text"]').value;
    const password = form.querySelector('input[type="password"]').value;
    
    // Validate fields
    const usernameError = await validateField('username', username);
    const passwordError = await validateField('password', password);
    
    if (usernameError || passwordError) return;
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      handleAuthSuccess(data);
      
    } catch (error) {
      showError('password', error.message);
    }
  });
};

// Handle signup form
const setupSignupForm = () => {
  const form = document.querySelector('.container');
  if (!form) return;

  let debounceTimeout;
  
  // Add debounced validation for username and email
  const setupDebouncedValidation = (input, fieldId) => {
    input.addEventListener('input', (e) => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        validateField(fieldId, e.target.value);
      }, 500);
    });
  };

  const usernameInput = form.querySelector('input[name="username"]');
  const emailInput = form.querySelector('input[name="email"]');
  
  if (usernameInput) setupDebouncedValidation(usernameInput, 'username');
  if (emailInput) setupDebouncedValidation(emailInput, 'email');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = usernameInput.value;
    const email = emailInput.value;
    const password = form.querySelector('input[name="password"]').value;
    
    // Validate all fields
    const usernameError = await validateField('username', username);
    const emailError = await validateField('email', email);
    const passwordError = await validateField('password', password);
    
    if (usernameError || emailError || passwordError) return;
    
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }
      
      handleAuthSuccess(data);
      
    } catch (error) {
      showError('email', error.message);
    }
  });
};

// Initialize forms based on current page
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('SignUP')) {
    setupSignupForm();
  } else {
    setupLoginForm();
  }
});