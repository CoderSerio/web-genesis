function jsonLoader(code) {
  let res = code;
  if (typeof code === "string") {
    res = JSON.stringify(code);
  }

  return `export default ${res}`;
}

module.exports = jsonLoader;
