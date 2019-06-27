const log = require("../log");
const defaultRegexFrame = ["(^|[^A-Za-z])(", ")($|[^A-Za-z])"];
const defaultExcludedDirNames = [
  "site-packages",
  "node_modules",
  ".serverless"
];
const { exec } = require("child_process");
const _ = require("lodash");
const maxStdBuffer = 1024 * 1024 * 5; // 5 MB

const getFileData = async (
  path,
  supportedFileExtensions,
  excludedDirs = defaultExcludedDirNames,
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
  frame = frame || defaultRegexFrame;
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
  getFileData,
  constructRegex
};
