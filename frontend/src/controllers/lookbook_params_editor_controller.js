import { Controller } from "@hotwired/stimulus";
import { debounce } from "../helpers";
import { updateIframeSrc } from "../helpers";

export default class extends Controller {
  debouncedHandler = null;

  connect() {
    this.element
      .querySelectorAll("input, select, textarea")
      .forEach((element) => {
        element.addEventListener("input", this.onInputChange);
      });
  }

  disconnect() {
    this.element
      .querySelectorAll("input, select, textarea")
      .forEach((element) => {
        element.removeEventListener("input", this.onInputChange);
      });
  }

  onInputChange = debounce((event) => {
    this.handleInputChange(event);
  }, 300);

  handleInputChange(event) {
    const input = event.target;

    if (
      input.tagName === "INPUT" ||
      input.tagName === "SELECT" ||
      input.tagName === "TEXTAREA"
    ) {
      let name = input.name;
      let value;

      if (input.type === "checkbox") {
        value = input.checked;
      } else {
        value = input.value;
      }

      const params = {
        timestamp: Date.now(),
        [name]: value,
      };

      // Update the iframe source
      updateIframeSrc(document.querySelector("#preview-iframe"), params);

      // Update the URL without triggering a page reload
      const url = new URL(window.location.href);
      for (const key in params) {
        if (key !== "timestamp") {
          url.searchParams.set(key, params[key]);
        }
      }
      window.history.replaceState({}, "", url);
    }
  }
}
