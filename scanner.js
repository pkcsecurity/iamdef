const log = require("./log");
const files = require("./files");
const supportedExtensions = ["js", "py", "json", "yaml"];

const run = async auditRootPath => {
  const spinner = log.spinner("Starting scan...");
  // Get files
  log.log(
    await files.getFileData(auditRootPath, supportedExtensions, "aws", 5)
  );
  // Run pre-scanner
  // Run pre-scanner results through their scanners
  // Collate saved data
  // Build set of messages
  // Build set of IAM roles
  // Output messages
  // Output IAM roles
};

module.exports = {
  run
};
