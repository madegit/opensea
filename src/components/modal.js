const modal = document.querySelector("#modal");
const openModal = document.querySelector("#openModal");
const closeModal = document.querySelector("#closeModal");

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
  