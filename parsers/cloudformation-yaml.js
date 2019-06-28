const _ = require("lodash");
const { yamlParse } = require("yaml-cfn");
const BaseParser = require("./base");
class CloudFormationYamlParser extends BaseParser {
  async run() {
    const dataString = await this.load(this.path);
    const cf = yamlParse(dataString);

    console.log(JSON.stringify(this.detectTypes(cf), null, 2));
  }

  detectTypes(cf) {
    const parsedResources = {};
    const { Resources } = cf;
    _.map(Object.keys(Resources), k => {
      const r = Resources[k];
      const path = this.parseAwsType(r.Type);
      path.reduce((o, v) => {
        if (!o[v]) {
          o[v] = {};
        }
        if (path.indexOf(v) == path.length - 1) {
          // o[v]["name"] = JSON.stringify(Resources[k]["Properties"]);
        }
        return o[v];
      }, parsedResources);
    });
    return parsedResources;
  }

  parseAwsType(t) {
    return t.split("::");
  }
}

module.exports = CloudFormationYamlParser;
