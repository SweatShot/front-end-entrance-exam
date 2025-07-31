document.addEventListener("DOMContentLoaded", () => {
  const isEditableCandidate = (el) =>
    ["SPAN", "H2", "H3", "H4", "P", "LI", "A"].includes(el.tagName) &&
    !el.closest("button") &&
    !el.classList.contains("no-edit");

  const makeEditable = (el) => {
    if (el.getAttribute("contenteditable") === "true") return;

    el.setAttribute("contenteditable", "true");
    el.focus();

    const originalText = el.textContent;

    const handleBlur = function () {
      el.setAttribute("contenteditable", "false");
      if (el.textContent !== originalText) {
        el.classList.add("text-changed");
        setTimeout(() => el.classList.remove("text-changed"), 1000);
      }
      cleanup();
    };

    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        el.blur();
      }
    };

    const cleanup = () => {
      el.removeEventListener("blur", handleBlur);
      el.removeEventListener("keydown", handleKeyDown);
    };

    el.addEventListener("blur", handleBlur);
    el.addEventListener("keydown", handleKeyDown);
  };

  document.body.addEventListener("click", (e) => {
    const target = e.target;
    if (isEditableCandidate(target)) {
      target.style.cursor = "pointer";
      makeEditable(target);
    }

    const rippleContainer = e.target.closest("[data-ripple]");
    if (
      rippleContainer &&
      rippleContainer.getAttribute("contenteditable") !== "true"
    ) {
      createRipple(rippleContainer, e);
    }
  });

  function createRipple(container, event) {
    const rect = container.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    container.querySelectorAll(".ripple").forEach((r) => r.remove());
    container.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }
});
