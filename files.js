const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const { exec } = require("child_process");
const maxStdBuffer = 1024 * 1024 * 5; // 5 MB

const getCurrentDirectoryBase = () => {
  return path.basename(process.cwd());
};

const makeAbsolute = fp => {
  return path.join(process.cwd(), fp);
};

const directoryExists = absoluteFilePath => {
  try {
    return fs.statSync(absoluteFilePath).isDirectory();
  } catch (err) {
    return false;
  }
};

const getDirTree = absoluteFilePath => {
  const tree = dirTree(absoluteFilePath, {
    extensions: supportedExtensionsRegex
  });
  return tree;
};

const getFileData = async (path, supportedFileExtensions, regex) => {
  const fileExtIncludes = getFileExtGrepIncludes(supportedFileExtensions);
  let grepString = `grep -Erl ${fileExtIncludes} "${regex}" ${path}`;
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

module.exports = {
  getCurrentDirectoryBase,
  directoryExists,
  getDirTree,
  makeAbsolute,
  getFileData
};
