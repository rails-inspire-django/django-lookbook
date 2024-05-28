import { Controller } from "@hotwired/stimulus";
import { waitForFilterController } from "../helpers";

export default class extends Controller {
  static targets = ["items", "notFoundSection"];
  static values = {
    filterText: String,
    empty: { type: Boolean, default: false },
  };

  async filter(event) {
    const { text } = event.detail;

    // find children which has li[data-controller='lookbook-sidebar-toggle']
    const children = Array.from(this.itemsTarget.children).filter((child) => {
      return (
        child.tagName.toLowerCase() === "li" &&
        child.getAttribute("data-controller") === "lookbook-sidebar-toggle"
      );
    });

    const filteredStates = await window.Promise.all(
      Array.from(children).map(async (child) => {
        const childrenController = await waitForFilterController(
          child,
          "lookbook-sidebar-toggle",
          this.application
        );
        const filteredOutValue = await childrenController.filter(text);
        return filteredOutValue;
      })
    );

    const matchedChildCount = filteredStates.filter((s) => !s).length;
    this.emptyValue = matchedChildCount === 0;
  }

  emptyValueChanged(newValue) {
    if (newValue) {
      this.itemsTarget.classList.toggle("hidden", true);
      this.notFoundSectionTarget.classList.toggle("hidden", false);
    } else {
      this.itemsTarget.classList.toggle("hidden", false);
      this.notFoundSectionTarget.classList.toggle("hidden", true);
    }
  }
}
