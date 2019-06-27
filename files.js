const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
// const supportedExtensions = ["js", "py", "json", "yaml"];
// const supportedExtensionsRegex = new RegExp(
//   `/\.(${supportedExtensions.join("|")})$/`
// );

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

const getFileData = async (
  path,
  supportedFileExtensions,
  regex,
  contextLineCount
) => {
  const fileExtIncludes = getFileExtGrepIncludes(supportedFileExtensions);
  const grepString = `grep -Eir -C ${contextLineCount} ${fileExtIncludes} "${regex}" ${path}`;
  return new Promise((resolve, reject) => {
    exec(grepString, (err, stdout) => {
      if (err) {
        if (err.code == 1) {
          reject(`Pre-scan found no AWS / IAM related text in ${path}`);
        }
        reject(err);
      }
      resolve(stdout);
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
