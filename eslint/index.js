const core = require('@actions/core');
const github = require('@actions/github');
const Linter = require("eslint").Linter;


try {
console.log("CWD", process.cwd());

const mainLinter = new Linter();
console.log(mainLinter);

} catch (error) {
  console.log(error);
}
