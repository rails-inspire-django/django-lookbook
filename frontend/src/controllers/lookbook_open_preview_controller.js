import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  openUrl(event) {
    event.preventDefault();

    const iframe = document.getElementById("preview-iframe");
    if (iframe) {
      const currentUrl = iframe.src;
      if (currentUrl) {
        window.open(currentUrl, "_blank");
      } else {
        console.error("Current URL not found.");
      }
    } else {
      console.error("Preview iframe element not found.");
    }
  }
}
