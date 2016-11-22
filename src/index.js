function get(current, ...path) {
  let value = current;

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

function set(current, ...args) {
  if (args.every(arg => Array.isArray(arg))) {
    return args.reduce((previous, args) => set(previous, ...args), current);
  }

  let value = args.pop();
  const path = args;

  if (typeof value === 'function') {
    const original = get(current, ...path);
    value = value(original);
  }

  let assigned = value;
  let key;

  while (key = path.pop()) {
    const source = get(current, ...path);
    assigned = Object.assign({}, source, {[key]: assigned});
  }

  return assigned;
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
