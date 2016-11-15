function get(current, ...path) {
  path = path.slice();

  let key;
  let property = current;
  while (property && (key = path.shift())) {
    property = property[key];
  }

  return property;
}

function set(current, ...args) {
  if (args.every(arg => Array.isArray(arg))) {
    return args.reduce((previous, args) => set(previous, ...args), current);
  }

  let value = args.pop();
  let path = args;

  if (typeof value === 'function') {
    const original = get(current, path);
    value = value(original);
  }

  path = path.slice();

  let key;
  let source = value;
  while (key = path.pop()) {
    const target = get(current, ...path);
    source = Object.assign({}, target, {[key]: source});
  }

  return source;
};

export default function strew(...funcs) {
  if (funcs.length === 0) {
    return (initial) => initial;
  }

  return (initial) => funcs.reduce((previous, func) => func(previous, {get, set}), initial);
}

Object.assign(strew, {
  get,
  set,
})
