import * as readline from "readline";

type Key = {
  sequence: string;
  name: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
  code: string;
};

const yellow = (text: string) => `\x1b[33m${text}\x1b[0m`;

export const keyDown = (stream = process.stdin) => {
  return new Promise<{ string: string | undefined; key: Key }>(
    (resolve, reject) => {
      const onKeyPress = (string: string | undefined, key: Key) =>
        close(() => resolve({ string, key }));

      const close = (cb: (...arg: any[]) => void) => {
        stream.removeAllListeners("keypress");
        stream.removeAllListeners("error");
        stream.setRawMode(false);
        stream.pause();
        cb();
      };
      readline.emitKeypressEvents(stream);
      stream
        .on("keypress", onKeyPress)
        .on("error", err => close(() => reject(err)));
      stream.setRawMode(true);
      stream.resume();
    }
  );
};

export const renderOptions = async (
  profiles: string[],
  currentIndex: number,
  needOffset: boolean
) => {
  const backward = `\u001b[${3 + profiles[profiles.length - 1].length}D`;
  const upward = `\u001b[${profiles.length}A`;
  const offset = needOffset ? backward + upward : "";

  process.stdout.write(
    offset +
      profiles
        .map((profile, index) => {
          const selective = index === currentIndex ? yellow("> ◉") : "  ◎";
          return `${selective} ${profile}`;
        })
        .join("\n") +
      "\n"
  );
};

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
    await renderOptions(options, currentIndex, needOffset);
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
