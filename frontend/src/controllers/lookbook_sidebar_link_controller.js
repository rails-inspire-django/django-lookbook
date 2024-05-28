import { Controller } from "@hotwired/stimulus";

function findParentLiElementsWithController(element, parentLiElements = []) {
  if (!element || element.tagName === "HTML") {
    return parentLiElements;
  }

  if (
    element.tagName === "LI" &&
    element.getAttribute("data-controller") === "lookbook-sidebar-toggle"
  ) {
    parentLiElements.push(element);
  }

  return findParentLiElementsWithController(
    element.parentNode,
    parentLiElements
  );
}

export default class extends Controller {
  static values = {
    filteredOut: { type: Boolean, default: true },
    ready: { type: Boolean, default: false },
  };

  connect() {
    const path = window.location.pathname.replace(/\/$/, ""); // Remove the last slash from the path
    const elementHref = this.element.getAttribute("href").replace(/\/$/, ""); // Remove the last slash from the element's href
    if (path === elementHref) {
      this.element.classList.add("active");
      setTimeout(() => {
        // Dispatch an event to the parent li elements with the lookbook-sidebar-toggle controller
        const event = new CustomEvent("sidebar-active");
        const parentLiElements = findParentLiElementsWithController(
          this.element
        );
        parentLiElements.forEach((element) => {
          element.dispatchEvent(event);
        });
      }, 100);
    }
    this.readyValue = true;
  }

  filteredOutValueChanged(newValue) {
    if (newValue) {
      this.element.classList.toggle("hidden", true);
    } else {
      this.element.classList.toggle("hidden", false);
    }
  }

  async filter(text, matchArray = []) {
    const newMatchArray = Array.from(matchArray);
    newMatchArray.push(this.element.innerText.toLowerCase());
    const matchers = newMatchArray.map((matcher) =>
      matcher.replace(/\s/g, "").toLowerCase()
    );
    const result = !this.match(text, matchers);

    this.filteredOutValue = result;
    return result;
  }

  match(text, matchers) {
    if (text.length) {
      const matched = (matchers || []).map((m) => m.includes(text));
      return matched.filter((m) => m).length;
    }
    return true;
  }
}
