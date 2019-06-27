const inquirer = require("inquirer");

module.exports = {
  forAuditRootPath: () => {
    const questions = [
      {
        name: "auditRootPath",
        type: "input",
        message: "Enter the root path of the codebase you'd like to audit: ",
        validate: function(value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter the root path.";
          }
        }
      }
    ];
    return inquirer.prompt(questions);
  }
};
