# Strew

Yet another utility to organize your scattered objects, inspired by the Redux way of working with reducers. This was originally created to maintain large and complex configs for e.g. Webpack.

It's not recommend to use this in productions or just because Redux is cool. Therefor it's only built for Node 5+. If use find any other use case or need support for another environment, just create an issue or a pull request.

Install with Npm:
```bash
$ npm i strew --save
```

Install with Yarn:
```bash
$ yarn add strew
```

## Reference

```js
strew(...reducer)(initial);
// Each `reducer` is expected to be a function which will be invoked with the current object
// returned by the previous `reducer` as first argument and get/set functions as second argument.
// The `strew(...reducer)` returns a new function that you're able to invoke with the initial
// object and that returns the new reduced object.

strew.get(source, ...path);
// Returns the value described by `path`, if it doesn't exists it returns `undefined`

strew.set(source, ...path, value); // or
strew.set(source, ...[...path, value]);
// Returns a new object with the value(s) described by `path`. If `value` is a function, it will be
// invoked with the existing value or `undefined` as argument and use the returned value instead.
// To have a function as a value you can create a function which returns your function.
```

## Examples

```js
const strew = require('strew');

const initial = {dog: 'bad'};

function cat() {
  // The clean way
  return current => Object.assign({}, current, {cat: 'hairy'});
  // { dog: 'bad', cat: 'hairy' }
}

function fish() {
  // Using the `set`-function
  return (current, {set}) => set(current, 'fish', 'stonefish', 'pretty', false);
  // { dog: 'bad',
  //   cat: 'hairy',
  //   fish: { stonefish: { pretty: false } } }
}

function bird() {
  // Using the `set`-function with multiple values
  return (current, {set}) => set(current,
    ['bird', 'alive', 'deafening'],
    ['bird', 'dead', 'silent']
  );
  // { dog: 'bad',
  //   cat: 'hairy',
  //   fish: { stonefish: { pretty: false } },
  //   bird: { alive: 'deafening', dead: 'silent' } }
}

function dog() {
  // Using `set`-function to modify a existing value
  return (current, {set}) => set(current, 'dog', value => value === 'bad' ? 'rude' : 'polite');
  // { dog: 'rude',
  //   cat: 'hairy',
  //   fish: { stonefish: { pretty: false } },
  //   bird: { alive: 'deafening', dead: 'silent' } }
}

function reptile(animal, species) {
  // The advanced way
  return (current, {set, get}) => {
    current = set(current, species, animal);

    let list = get(current, 'reptile', animal);

    if (typeof list === 'undefined') {
      list = [];
    }

    current = set(current, 'reptile', animal, [...list, species]);

    return current;
  }
}

const strewed = strew(
  cat(),
  fish(),
  bird(),
  dog(),
  reptile('snake', 'blank mamba'),
  reptile('snake', 'king kobra'),
  reptile('lizard', 'komodo dragon'),
  reptile('lizard', 'iguana')
)(initial);

console.log(strewed);
// { dog: 'rude',
//   cat: 'hairy',
//   fish: { stonefish: { pretty: false } },
//   bird: { alive: 'deafening', dead: 'silent' },
//   'blank mamba': 'snake',
//   reptile:
//    { snake: [ 'blank mamba', 'king kobra' ],
//    lizard: [ 'komodo dragon', 'iguana' ] },
//   'king kobra': 'snake',
//   'komodo dragon': 'lizard',
//   iguana: 'lizard' }

console.log(initial);
// { dog: 'bad' }

```
