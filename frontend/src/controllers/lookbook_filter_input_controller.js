import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["input", "clearButton"];
  static values = {
    filterText: { type: String, default: "" },
  };

  connect() {
    this.key = "previews-filter-text";
    this.loadFromLocalStorage();
  }

  inputChanged() {
    this.filterTextValue = this.inputTarget.value;
  }

  loadFromLocalStorage() {
    const savedValue = localStorage.getItem(this.key);
    if (savedValue) {
      this.inputTarget.value = savedValue;
      this.filterTextValue = savedValue;
    }
  }

  clearFilter() {
    this.filterTextValue = "";
    this.inputTarget.value = "";
  }

  filterTextValueChanged(newValue) {
    if (newValue) {
      this.clearButtonTarget.classList.toggle("hidden", false);
    } else {
      this.clearButtonTarget.classList.toggle("hidden", true);
    }
    setTimeout(() => {
      this.dispatch("preview-filter", {
        detail: {
          text: newValue,
        },
      });
      localStorage.setItem(this.key, newValue);
    }, 10);
  }
}
