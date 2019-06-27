const _ = require("lodash");
const log = require("./log");
const scanners = require("./scanners");
const enabledScanners = ["text"];

const run = async auditRootPath => {
  log.log(`Enabled scanners: ${enabledScanners.join()}`);
  const runningScanners = _.map(enabledScanners, scannerName => {
    return scanners[scannerName](auditRootPath);
  });
  await Promise.all(runningScanners);
};

module.exports = {
  run
};
