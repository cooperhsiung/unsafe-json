// todo

import { build, parse } from './index';

// eg.1 simple
const obj1 = ['hello', 'world', 'json'];
const obj1_stringify = build(['string']);
const str1 = obj1_stringify(obj1);
console.log(str1);
console.log(parse(str1));

// eg.2 nested object
const obj2 = {
  name: 'john',
  age: 23,
  married: false,
  skills: ['nodejs', 'python'],
  location: {
    country: 'china',
    city: 'beijing'
  }
};
const schema2 = {
  name: 'string',
  age: 'number',
  married: 'boolean',
  skills: ['string'],
  location: {
    country: 'string',
    city: 'string'
  }
};
const obj2_stringify = build(schema2);
const str2 = obj2_stringify(obj2);
console.log(str2);
console.log(parse(str2));

// eg.3 value might be null
const obj3 = {
  name: 'john',
  location: null
};
const schema3 = {
  name: 'string',
  location: 'object'
};
const obj3_stringify = build(schema3);
const str3 = obj3_stringify(obj3);
console.log(str3);
console.log(parse(str3));
