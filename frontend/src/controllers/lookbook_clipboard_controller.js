import { Controller } from "@hotwired/stimulus";
import ClipboardJS from "clipboard";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

export default class extends Controller {
  static values = {
    successMessage: String,
    errorMessage: String,
  };

  connect() {
    this.clipboard = new ClipboardJS(this.element, {
      text: function () {
        const iframe = document.getElementById("preview-iframe");
        if (iframe) {
          return iframe.src;
        } else {
          return "Iframe not found.";
        }
      },
    });
    this.clipboard.on("success", () => this.tooltip(this.successMessage));
    this.clipboard.on("error", () => this.tooltip(this.errorMessage));

    this.element.addEventListener(
      "mouseenter",
      this.handleMouseEnter.bind(this)
    );
  }

  disconnect() {
    this.element.removeEventListener(
      "mouseenter",
      this.handleMouseEnter.bind(this)
    );
  }

  handleMouseEnter() {
    const ariaLabel = this.element.getAttribute("aria-label");
    if (ariaLabel) {
      this.tooltip(ariaLabel);
    }
  }

  tooltip(content) {
    tippy(this.element, {
      content: content,
      showOnCreate: true,
      onHidden: (tooltipInstance) => {
        tooltipInstance.destroy();
      },
    });
  }

  get successMessage() {
    return this.successMessageValue || "Copied!";
  }

  get errorMessage() {
    return this.errorMessageValue || "Failed!";
  }
}
