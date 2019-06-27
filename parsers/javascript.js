const acorn = require("acorn");
const BaseParser = require("./base");
class JavascriptParser extends BaseParser {
  async run() {
    const dataString = await this.load();
    acorn.Parser.parse(dataString);
  }
}

module.exports = JavascriptParser;
