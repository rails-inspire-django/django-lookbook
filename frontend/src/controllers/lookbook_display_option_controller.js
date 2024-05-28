import { Controller } from "@hotwired/stimulus";
import Cookies from "js-cookie";
import { updateIframeSrc } from "../helpers";

export default class extends Controller {
  static targets = ["select"];

  connect() {
    this.key = "display-theme";
    this.loadThemeFromCookie();
  }

  loadThemeFromCookie() {
    const theme = Cookies.get(this.key) || "light";
    this.selectTarget.value = theme;
  }

  setTheme() {
    Cookies.set(this.key, this.selectTarget.value);
    const iframe = document.querySelector("#preview-iframe");
    const params = {
      display: {
        theme: this.selectTarget.value,
      },
    };
    updateIframeSrc(iframe, params);
  }
}
