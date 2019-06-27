const _ = require("lodash");
const fs = require("fs");
const promisify = require("util").promisify;
const fsReadAsync = promisify(fs.readFile);

class ParserBase {
  constructor(path) {
    this.path = path;
  }
  async load() {
    return fsReadAsync(this.path);
  }
  async run() {}
}

module.exports = ParserBase;
