import { Controller } from "@hotwired/stimulus";
import { wait, updateIframeSrc } from "../helpers";

export default class extends Controller {
  async refresh(event) {
    const button = event.currentTarget;
    button.classList.add("animate-spin");
    button.disabled = true;

    const iframe = document.querySelector("#preview-iframe");

    const params = {
      timestamp: Date.now(),
    };

    updateIframeSrc(iframe, params);

    await wait(500);

    button.classList.remove("animate-spin");
    button.disabled = false;
  }
}
