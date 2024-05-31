import { Controller } from "@hotwired/stimulus";
import { marked } from "marked";

export default class extends Controller {
  connect() {
    this.parse();
  }

  parse() {
    const renderer = new marked.Renderer();
    const html = marked.parse(this.element.dataset.content, { renderer });
    this.element.innerHTML = html;
  }
}
