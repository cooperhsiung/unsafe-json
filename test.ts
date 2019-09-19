import { build, parse } from './index';

let j = {
  a: 1,
  b: 'hello',
  c: { x: 1, y: 'zzzzzz' },
  d: ['hello', 'asdasd', 'world'] // array map slow
};

let j_schema = {
  a: 'number',
  b: 'string',
  c: { x: 'number', y: 'string' },
  d: ['string'] // array map slow
};

let j_stringify = build(j_schema);

let s = j_stringify(j);

console.log(s);
console.log(parse(s));

// performance comparation
console.log('\n------- performance comparation -------\n');
function test1() {
  let i = 100000;
  while (i--) {
    JSON.stringify(j);
  }
}

function test2() {
  let i = 100000;
  while (i--) {
    j_stringify(j);
  }
}

function test3() {
  let i = 100000;
  while (i--) {
    JSON.parse(s);
  }
}

function test4() {
  let i = 100000;
  while (i--) {
    parse(s);
  }
}

//
console.time('native stringify');
test1();
console.timeEnd('native stringify');
//
console.time('unsafe stringify');
test2();
console.timeEnd('unsafe stringify');
//
console.time('native parse');
test3();
console.timeEnd('native parse');
//
console.time('unsafe parse');
test4();
console.timeEnd('unsafe parse');
