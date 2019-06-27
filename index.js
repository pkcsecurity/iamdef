const ask = require("./ask");
const files = require("./files");
const scanner = require("./scanner");
const log = require("./log");

const run = async () => {
  log.clear();
  log.banner("IAM Defined");
  const askResults = await ask.forAuditRootPath();
  const absoluteRootPath = files.makeAbsolute(askResults.auditRootPath);
  const auditRootPathExists = files.directoryExists(absoluteRootPath);
  if (auditRootPathExists) {
    await scanner.run();
  } else {
    log.err(`Path ${absoluteRootPath} does not exist, exiting...`);
    log.bannerErr("FAIL");
    process.exit(1);
  }
};

run();
