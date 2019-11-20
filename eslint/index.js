const core = require('@actions/core');
const github = require('@actions/github');
import glob from 'glob';
import { CLIEngine } from 'eslint';
import { assert, describe } from 'chai';

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  //const payload = JSON.stringify(github.context.payload, undefined, 2)
  //console.log(`The event payload: ${payload}`);


  const paths = glob.sync('./+(app|test)/**/*.js');
  const engine = new CLIEngine({
    envs: ['node', 'mocha'],
    useEslintrc: true,
  });

  const results = engine.executeOnFiles(paths).results;

  describe('ESLint', function() {
    results.forEach((result) => generateTest(result));
  });


} catch (error) {
  core.setFailed(error.message);
}



function generateTest(result) {
  const { filePath, messages } = result;

  it(`validates ${filePath}`, function() {
    if (messages.length > 0) {
      assert.fail(false, true, formatMessages(messages));
    }
  });
}

function formatMessages(messages) {
  const errors = messages.map((message) => {
    return `${message.line}:${message.column} ${message.message.slice(0, -1)} - ${message.ruleId}\n`;
  });

  return `\n${errors.join('')}`;
}