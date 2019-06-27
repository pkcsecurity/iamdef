const log = require("../log");
const supportedExtensions = ["js", "py"]; //, "json", "yaml", "yml"];
const fileFlagStrings = ["aws-sdk", "boto", "AWSTemplateFormatVersion"];
const regexFrame = ["(^|[^A-Za-z])(", ")($|[^A-Za-z])"];
const excludedDirNames = ["site-packages", "node_modules", ".serverless"];
const _ = require("lodash");
const u = require("../utils");

const scanner = async auditRootPath => {
  const spinner = log.spinner(
    `Text Scanner: Finding relevant files in ${auditRootPath}...`
  );
  // Get files with pre-scanner
  const prescanRegex = u.constructRegex(fileFlagStrings, regexFrame);
  const relevantFiles = await u.getFileData(
    auditRootPath,
    supportedExtensions,
    excludedDirNames,
    prescanRegex
  );

  // Run pre-scanner results through their scanners
  log.log(JSON.stringify(relevantFiles, null, 2));
  // Collate saved data
  // Build set of messages
  // Build set of IAM roles
  // Output messages
  // Output IAM roles
  spinner.stop();
};

module.exports = scanner;
