// /public/js/toggle-password.js
document.addEventListener("DOMContentLoaded", () => {
  // Find every toggle control
  document.querySelectorAll(".toggle-password").forEach((btn) => {
    // Make it keyboard-accessible
    btn.setAttribute("role", "button");
    btn.setAttribute("tabindex", "0");
    btn.setAttribute("aria-pressed", "false");

    const toggle = () => {
      // Find the nearest wrapper and the input inside it
      const wrapper = btn.closest(".password-wrapper");
      if (!wrapper) return;
      const input = wrapper.querySelector("input[type='password'], input[type='text']");
      if (!input) return;

      const nowPassword = input.type === "password";
      input.type = nowPassword ? "text" : "password";

      // Update button text/icon and aria state
      btn.textContent = nowPassword ? "Hide" : "Show";
      btn.setAttribute("aria-pressed", nowPassword ? "true" : "false");
      btn.classList.toggle("active", nowPassword);
    };

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      toggle();
    });

    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });
  });
});
