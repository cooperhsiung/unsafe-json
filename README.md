# unsafe-json

[![NPM Version][npm-image]][npm-url]
[![Node Version][node-image]][node-url]

unsafe json serializer, but fast.

## Installation

```bash
npm i unsafe-json -S
```

## Usage

```typescript
import { build, parse } from 'unsafe-json';

const obj = {
  name: 'john',
  age: 23,
  married: false,
  skills: ['nodejs', 'python'],
  location: {
    country: 'china',
    city: 'beijing'
  }
};

const schema = {
  name: 'string',
  age: 'number',
  married: 'boolean',
  skills: ['string'],
  location: {
    country: 'string',
    city: 'string'
  }
};

const stringify = build(schema);
const str = stringify(obj);
console.log(str);
console.log(parse(str));
```

## Performance

tests on my PC: _Intel(R) Core(TM) i7-8550U CPU @ 1.80GHz_

- simple object, ~7X faster

```
{"a":1,"b":"hello","c":{"x":1,"y":"zzzzzz"}}
------- performance comparation -------
native stringify: 71.237ms
unsafe stringify: 11.731ms
native parse: 109.784ms
unsafe parse: 45.594ms
```

- object with array, ~3X faster

```
{"a":1,"b":"hello","c":{"x":1,"y":"zzzzzz"},"d1":["asd","aaaaaa","asdasdasd"],"d":[{"x":1,"y":"zzzzzz"},{"x":1,"y":"zzzz"},{"x":1,"y":"z"}]}
------- performance comparation -------
native stringify: 188.564ms
unsafe stringify: 66.726ms
native parse: 252.536ms
unsafe parse: 72.011ms
```

## Todo

- [ ] not support `undefined` type

## License

MIT

[npm-image]: https://img.shields.io/npm/v/unsafe-json.svg
[npm-url]: https://www.npmjs.com/package/unsafe-json
[node-image]: https://img.shields.io/badge/node.js-%3E=8-brightgreen.svg
[node-url]: https://nodejs.org/download/
