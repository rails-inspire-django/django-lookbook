import { Application } from "@hotwired/stimulus";
import { definitionsFromContext } from "@hotwired/stimulus-webpack-helpers";
import {
  Alert,
  Dropdown,
  Modal,
  Tabs,
  Popover,
  Toggle,
} from "tailwindcss-stimulus-components";

const application = Application.start();
application.debug = process.env.NODE_ENV === "development";
window.Stimulus = application;

// load local controllers, only xxx_controller.js would be loaded
const context = require.context("./", true, /\.(js|ts)$/);
application.load(definitionsFromContext(context));

// register 3-party controllers
application.register("alert", Alert);
application.register("dropdown", Dropdown);
application.register("modal", Modal);
application.register("tabs", Tabs);
application.register("popover", Popover);
application.register("toggle", Toggle);
