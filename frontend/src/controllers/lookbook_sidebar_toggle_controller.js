import { Controller } from "@hotwired/stimulus";
import { waitForFilterController } from "../helpers";

export default class extends Controller {
  static targets = ["button", "toggleable", "openArrow", "closeArrow"];
  static values = {
    open: Boolean,
    filteredOut: { type: Boolean, default: true },
    ready: { type: Boolean, default: false },
  };
  static classes = ["active"];

  connect() {
    this.openArrowTarget.classList.toggle("hidden", true);
    this.closeArrowTarget.classList.toggle("hidden", false);
    this.readyValue = true;
  }

  toggle(event) {
    event.preventDefault();
    this.openValue = !this.openValue;
  }

  hide(event) {
    event.preventDefault();
    this.openValue = false;
  }

  show(event) {
    event.preventDefault();
    this.openValue = true;
  }

  async filter(text, matchArray = []) {
    let result = this.filteredOutValue;
    const newMatchArray = Array.from(matchArray);
    newMatchArray.push(this.buttonTarget.innerText.toLowerCase());

    // find children which have li[data-controller='lookbook-sidebar-toggle']
    const children = Array.from(this.toggleableTarget.children).filter(
      (child) => {
        return (
          child.tagName.toLowerCase() === "li" &&
          child.getAttribute("data-controller") === "lookbook-sidebar-toggle"
        );
      }
    );

    if (children.length > 0) {
      result = true;
      await window.Promise.all(
        children.map(async (child) => {
          const childrenController = await waitForFilterController(
            child,
            "lookbook-sidebar-toggle",
            this.application
          );
          const subResult = await childrenController.filter(
            text,
            Array.from(newMatchArray)
          );
          if (!subResult) {
            result = false;
          }
        })
      );
    } else {
      result = true;
      const links = this.toggleableTarget.querySelectorAll(
        'a[data-controller="lookbook-sidebar-link"]'
      );
      await window.Promise.all(
        Array.from(links).map(async (link) => {
          const linkController = await waitForFilterController(
            link,
            "lookbook-sidebar-link",
            this.application
          );
          const subResult = await linkController.filter(
            text,
            Array.from(newMatchArray)
          );

          if (!subResult) {
            result = false;
          }
        })
      );
    }

    this.filteredOutValue = result;
    return result;
  }

  openValueChanged(value) {
    if (value) {
      this.toggleableTarget.classList.toggle("hidden", false);

      this.openArrowTarget.classList.toggle("hidden", false);
      this.closeArrowTarget.classList.toggle("hidden", true);
    } else {
      this.toggleableTarget.classList.toggle("hidden", true);

      this.openArrowTarget.classList.toggle("hidden", true);
      this.closeArrowTarget.classList.toggle("hidden", false);
    }
  }

  filteredOutValueChanged(newValue) {
    if (newValue) {
      this.element.classList.toggle("hidden", true);
    } else {
      this.element.classList.toggle("hidden", false);
    }
  }
}
