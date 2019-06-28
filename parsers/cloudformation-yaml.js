const { yamlParse, yamlDump } = require("yaml-cfn");
const BaseParser = require("./base");
class CloudFormationYamlParser extends BaseParser {
  async run() {
    const dataString = await this.load(this.path);
    console.log(dataString);
    const cf = yamlParse(dataString);
    console.log(cf);
  }
}

module.exports = CloudFormationYamlParser;
