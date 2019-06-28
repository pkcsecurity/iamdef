const log = require("../log");
const supportedExtensions = ["json", "yaml", "yml"];
const fileFlags = ["AWSTemplateFormatVersion"];
const regexFrame = ["(^|[^A-Za-z])(", ")($|[^A-Za-z])"];
const excludedDirNames = ["site-packages", "node_modules", ".serverless"];
const { exec } = require("child_process");
const _ = require("lodash");
const maxStdBuffer = 1024 * 1024 * 5; // 5 MB
const { CloudFormationYamlParser } = require("../parsers");

const scanner = async auditRootPath => {
  const spinner = log.spinner(
    `CloudFormation Scanner: Finding relevant files in ${auditRootPath}...`
  );
  // Get files with pre-scanner
  const prescanRegex = constructRegex(fileFlags, regexFrame);
  const relevantFiles = await getFileData(
    auditRootPath,
    supportedExtensions,
    excludedDirNames,
    prescanRegex
  );

  // Run pre-scanner results through their scanners
  log.log(JSON.stringify(relevantFiles, null, 2));
  // Collate saved data
  const cfyamlPromises = _.map(relevantFiles, async f => {
    const cfp = new CloudFormationYamlParser(f);
    return cfp.run();
  });
  await Promise.all(cfyamlPromises);

  // Build set of messages
  // Build set of IAM roles
  // Output messages
  // Output IAM roles
  spinner.stop();
};

const getFileData = async (
  path,
  supportedFileExtensions,
  excludedDirs,
  regex
) => {
  const fileExtIncludes = getFileExtGrepIncludes(supportedFileExtensions);
  const dirExcludes = getGrepDirExcludes(excludedDirs);
  let grepString = `grep -Erl ${fileExtIncludes} ${dirExcludes} "${regex}" ${path}`;
  return new Promise((resolve, reject) => {
    exec(grepString, { maxBuffer: maxStdBuffer }, (err, stdout) => {
      if (err) {
        if (err.code == 1) {
          reject(`Pre-scan found no AWS / IAM related text in ${path}`);
        }
        reject(err);
      }
      const fileArray = _.compact(stdout.split("\n"));
      resolve(fileArray);
    });
  });
};

const getFileExtGrepIncludes = fileExt => {
  return (
    fileExt.reduce((toReturn, ext) => {
      return toReturn + ` --include="*.${ext}"`;
    }, "") + " "
  );
};

const getGrepDirExcludes = excludes => {
  return `--exclude-dir={${excludes.join(",")}}`;
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

module.exports = scanner;
