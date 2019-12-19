# @kamataryo/cli-radio

## install

```shell
$ npm install @kamataryo/cli-radio
# or
$ yarn add @kamataryo/cli-radio
```

## usage

```typescript
import select from "@kamataryo/cli-radio";

const main = async () => {
  const answer = await select(["foo", "bar", "baz"]);
};

main();
```

![usage](./usage.gif)
