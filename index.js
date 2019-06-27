const ask = require("./ask");
const files = require("./files");
const scanner = require("./scanner");
const log = require("./log");
const argv = require("minimist")(process.argv.slice(2));

// Catch ctrl-C
process.on("SIGINT", () => {
  log.exitFail("Caught interrupt signal");
});

const run = async () => {
  log.clear();
  log.banner("IAM Defined");
  log.logStart();
  const path =
    argv.t || argv.target || (await ask.forAuditRootPath()).auditRootPath;
  const absoluteRootPath = files.makeAbsolute(path);
  const auditRootPathExists = files.directoryExists(absoluteRootPath);
  if (auditRootPathExists) {
    try {
      const msg = await scanner.run(absoluteRootPath);
      log.exitSuccess(msg);
    } catch (e) {
      log.err(e);
      log.exitFail(`Error thrown`);
    }
  } else {
    log.exitFail(`Path ${absoluteRootPath} does not exist.`);
  }
};

run();
