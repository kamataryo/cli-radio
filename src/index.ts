import { keyDown, renderOptions } from "./utils";

export const main = async (options: string[]) => {
  let currentIndex = 0;
  let needOffset = false;
  let canceled = false;

  while (true) {
    if (currentIndex > options.length - 1) {
      currentIndex = options.length - 1;
    } else if (currentIndex < 0) {
      currentIndex = 0;
    }

    renderOptions(options, index => index === currentIndex, needOffset);
    needOffset = true;

    const input = (await keyDown()).key;
    if (input.name === "return" || input.name === "space") {
      break;
    } else if (input.name === "escape" || (input.name === "c" && input.ctrl)) {
      canceled = true;
      break;
    }
    if (input.name === "down") {
      currentIndex += 1;
    } else if (input.name === "up") {
      currentIndex -= 1;
    }
  }

  if (canceled) {
    return false;
  } else {
    const profile = options[currentIndex];
    return profile;
  }
};

export default main;
