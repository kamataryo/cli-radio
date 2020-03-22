import * as readline from "readline";

type Key = {
  sequence: string;
  name: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
  code: string;
};

export const yellow = (text: string) => `\x1b[33m${text}\x1b[0m`;

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

export const renderOptions = (
  options: string[],
  isChecked: (index: number) => boolean,
  needOffset: boolean
) => {
  const selected = "> ◉";
  const notSelected = "  ◎";
  const lastIndex = options.length - 1;
  const lastOptionLine =
    (isChecked(lastIndex) ? selected : notSelected) + options[lastIndex];

  const backward = `\u001b[${lastOptionLine.length}D`;
  const upward = `\u001b[${options.length}A`;
  const offset = needOffset ? backward + upward : "";

  process.stdout.write(
    offset +
      options
        .map((option, index) => {
          const selective = isChecked(index) ? yellow(selected) : notSelected;
          return `${selective} ${option}`;
        })
        .join("\n") +
      "\n"
  );
};
