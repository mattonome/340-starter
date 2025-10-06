document.addEventListener("DOMContentLoaded", () => {
  const flashItems = document.querySelectorAll(".flash-item");

  // Auto fade after 5 seconds
  setTimeout(() => {
    flashItems.forEach(el => {
      el.style.transition = "opacity 0.5s";
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 500);
    });
  }, 5000);
});
