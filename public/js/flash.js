document.addEventListener("DOMContentLoaded", () => {
  const flashItems = document.querySelectorAll(".flash-item");

  flashItems.forEach(el => {
    // Auto fade after 5 seconds for each flash item individually
    setTimeout(() => {
      el.style.transition = "opacity 0.5s";
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 500); // remove after fade
    }, 5000);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const toggleButtons = document.querySelectorAll(".toggle-password");

  toggleButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const input = btn.previousElementSibling;
      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      btn.textContent = isHidden ? "Hide" : "Show";
    });
  });
});




// Close button function
function closeFlash(button) {
  const flash = button.parentElement;
  flash.style.transition = "opacity 0.5s";
  flash.style.opacity = "0";
  setTimeout(() => flash.remove(), 500);
}
