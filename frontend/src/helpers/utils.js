export const debounce = (fn, delay = 10) => {
  let timeoutId = null;

  return (...args) => {
    const context = this;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
};

export async function wait(ms) {
  return new window.Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function waitForFilterController(
  element,
  identifier,
  application
) {
  // use this hacky wait to wait for the stimulus controllers be initialized
  let controller = application.getControllerForElementAndIdentifier(
    element,
    identifier
  );
  while (controller === undefined || controller === null) {
    controller = application.getControllerForElementAndIdentifier(
      element,
      identifier
    );
    await wait(10);
  }

  let condition = true;
  while (condition) {
    // use the controller.readyValue to check if the controller is ready to be used or not
    if (controller.readyValue === true) {
      break;
    }
    await wait(10);
  }

  return controller;
}
