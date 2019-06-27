const fs = require("fs");
const path = require("path");

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

module.exports = {
  getCurrentDirectoryBase,
  directoryExists,
  getDirTree,
  makeAbsolute
};
