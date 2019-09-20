import { build, parse } from './index';

let j = {
  a: 1,
  b: 'hello',
  c: { x: 1, y: 'zzzzzz' }
  // d1: ['asd', 'aaaaaa', 'asdasdasd'], // array maybe slow
  // d: [{ x: 1, y: 'zzzzzz' }, { x: 1, y: 'zzzz' }, { x: 1, y: 'z' }] // array maybe slow
};

let j_schema = {
  a: 'number',
  b: 'string',
  c: { x: 'number', y: 'string' }
  // d1: ['string'], // array maybe slow
  // d: [{ x: 'number', y: 'string' }] // array maybe slow
};

let j_stringify = build(j_schema, false);

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

//native stringify: 102.321ms
// unsafe stringify: 23.594ms 25~31
// native parse: 124.244ms
// unsafe parse: 60.771ms
