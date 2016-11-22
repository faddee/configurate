'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = strew;
function get(current) {
  let value = current;

  for (var _len = arguments.length, path = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    path[_key - 1] = arguments[_key];
  }

  path.every(key => {
    try {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        value = value[key];
        return true;
      }
    } catch (e) {}

    value = undefined;
    return false;
  });

  return value;
}

function set(current) {
  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  if (args.every(arg => Array.isArray(arg))) {
    return args.reduce((previous, args) => set(previous, ...args), current);
  }

  const value = args.pop();
  const path = args;
  let assigned = value;
  let key;

  while (key = path.pop()) {
    const source = get(current, ...path);

    if (assigned === value && typeof assigned === 'function') {
      assigned = value(source);
    }

    assigned = Object.assign({}, source, { [key]: assigned });
  }

  return assigned;
};

function strew() {
  for (var _len3 = arguments.length, funcs = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    funcs[_key3] = arguments[_key3];
  }

  if (funcs.length === 0) {
    return initial => initial;
  }

  return initial => funcs.reduce((previous, func) => func(previous, { get, set }), initial);
}

Object.assign(strew, {
  get,
  set
});
module.exports = exports['default'];
