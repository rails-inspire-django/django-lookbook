import { Controller } from "@hotwired/stimulus";
import Split from "split-grid";

// ViewComponent/lookbook/assets/js/config.js
const defaultConfig = {
  "main-split": {
    minSize: 200,
    sizes: ["200px", "1fr"],
    direction: "horizontal",
  },
  "inspector-split": {
    minSize: 200,
    sizes: ["1fr", "400px"],
    direction: "vertical",
  },
};

export default class extends Controller {
  static values = {
    name: String,
    direction: String,
  };

  connect() {
    const storedData = localStorage.getItem(`split-layout-${this.nameValue}`);
    let parsedData;
    if (storedData) {
      parsedData = JSON.parse(storedData);
    } else {
      parsedData = defaultConfig[this.nameValue];
    }
    const { direction, sizes, minSize } = parsedData;
    this.directionValue = direction;
    if (direction === "horizontal") {
      this.element.style.gridTemplateColumns = `${sizes[0]} 1px ${sizes[1]}`;
    } else if (direction === "vertical") {
      this.element.style.gridTemplateRows = `${sizes[0]} 1px ${sizes[1]}`;
    }

    const dir = this.directionValue === "horizontal" ? "column" : "row";
    this.splitter = Split({
      [`${dir}Gutters`]: [
        {
          track: 1,
          element: this.element.children[1],
        },
      ],
      minSize: minSize,
      onDrag: (dir, gutterTrack, style) => {
        const splits = style
          .split(" ")
          .map((value, i) => (i % 2 === 0 ? value : null))
          .filter((v) => v);
        localStorage.setItem(
          `split-layout-${this.nameValue}`,
          JSON.stringify({ sizes: splits, direction: this.directionValue })
        );
      },
    });

    this.element.classList.toggle("hidden", false);
  }

  disconnect() {
    if (this.splitter) this.splitter.destroy();
  }
}
