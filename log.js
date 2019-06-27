const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const figletFont = "doom"; // lean, large, "isometric4";
const CLI = require("clui");
const Spinner = CLI.Spinner;
let startTime, endTime;

const banner = t => {
  console.log(
    chalk.green(
      figlet.textSync(t, { horizontalLayout: "full", font: figletFont })
    )
  );
};

const bannerErr = t => {
  console.log(
    chalk.red(
      figlet.textSync(t, { horizontalLayout: "full", font: figletFont })
    )
  );
};

const err = t => {
  console.log(chalk.red(t));
};

const log = (t, color = "green") => {
  console.log(chalk[color](t));
};

const spinner = t => {
  const status = new Spinner(t);
  status.start();
  return status;
};

const logStart = () => {
  startTime = new Date();
  log(`Started ${startTime.toISOString()}`);
};

const logEnd = () => {
  endTime = new Date();
  log(
    `Ended ${endTime.toISOString()}, duration ${Math.round(
      (endTime - startTime) / 1000
    )}s`
  );
};
const exitSuccess = t => {
  if (t) {
    log(t);
  }
  logEnd();
  banner("WIN");
  process.exit();
};

const exitFail = t => {
  err(t);
  logEnd();
  bannerErr("FAIL");
  process.exit(1);
};

module.exports = {
  banner,
  bannerErr,
  err,
  log,
  clear,
  spinner,
  clear,
  exitSuccess,
  exitFail,
  logStart,
  logEnd
};
