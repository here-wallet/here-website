export class HereModal {
  constructor(id) {
    this.el = document.getElementById(id);
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) this.close();
    });

    this.el.addEventListener("pointerdown", () => this.close());
    this.el
      .querySelector(".modal-close")
      .addEventListener("click", () => this.close());
    this.el
      .querySelector(".modal-body")
      .addEventListener("pointerdown", (e) => e.stopPropagation());
  }

  get isOpen() {
    return this.el.classList.contains("open");
  }

  close() {
    this.el.classList.remove("open");
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
    document.body.querySelectorAll(".header").forEach((el) => {
      el.style.paddingRight = "";
    });
  }

  open() {
    this.el.classList.add("open");
    this.el.querySelector("input")?.focus();
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = getScrollbarWidth() + "px";
    document.body.querySelectorAll(".header").forEach((el) => {
      el.style.paddingRight = getScrollbarWidth() + "px";
    });
  }
}

function getScrollbarWidth() {
  // Creating invisible container
  const outer = document.createElement("div");
  outer.style.visibility = "hidden";
  outer.style.overflow = "scroll"; // forcing scrollbar to appear
  outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps
  document.body.appendChild(outer);

  // Creating inner element and placing it in the container
  const inner = document.createElement("div");
  outer.appendChild(inner);

  // Calculating difference between container's full width and the child width
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

  // Removing temporary elements from the DOM
  outer.parentNode.removeChild(outer);

  return scrollbarWidth;
}
