const _ = require("lodash");
const log = require("./log");
const files = require("./files");
const supportedExtensions = ["js", "py", "json", "yaml", "yml"];
const fileFlags = ["aws-sdk", "boto", "AWSTemplateFormatVersion"];
const regexFrame = ["(^|[^A-Za-z])(", ")($|[^A-Za-z])"];

const run = async auditRootPath => {
  log.setDebugMode(true);
  const spinner = log.spinner(`Finding relevant files in ${auditRootPath}...`);
  // Get files with pre-scanner
  const prescanRegex = constructRegex(fileFlags, regexFrame);
  const relevantFiles = await files.getFileData(
    auditRootPath,
    supportedExtensions,
    prescanRegex
  );
  log.debug(JSON.stringify(relevantFiles));

  // Run pre-scanner results through their scanners

  // Collate saved data
  // Build set of messages
  // Build set of IAM roles
  // Output messages
  // Output IAM roles
  spinner.stop();
};

const constructRegex = (arr, frame) => {
  const startPrefix = "(";
  const prefix = "|(";
  const suffix = ")";
  const constructedRegex = arr.reduce((s, v) => {
    if (!s) {
      return `${startPrefix}${v}${suffix}`;
    }
    return `${s}${prefix}${v}${suffix}`;
  });
  return `${frame[0]}${constructedRegex}${frame[1]}`;
};

module.exports = {
  run
};
