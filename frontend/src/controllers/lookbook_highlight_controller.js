import { Controller } from "@hotwired/stimulus";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import beautify from "js-beautify";
import { registerHljsLineNumbers } from "../helpers/highlightjs-line-numbers.js";

registerHljsLineNumbers(hljs);

export default class extends Controller {
  connect() {
    const snippets = this.element.querySelectorAll("pre code");
    snippets.forEach(function (snippet) {
      if (snippet.classList.contains("language-html")) {
        const formattedHtml = beautify.html(snippet.textContent, {
          indent_size: 4,
          indent_char: " ",
          wrap_line_length: 120,
          preserve_newlines: false,
          end_with_newline: true,
          unformatted: ["strong"],
        });

        snippet.textContent = formattedHtml;
      }
      hljs.highlightElement(snippet);
      hljs.lineNumbersBlock(snippet);
    });
  }
}
