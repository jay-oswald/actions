const { GITHUB_SHA, GITHUB_EVENT_PATH, GITHUB_TOKEN, GITHUB_WORKSPACE } = process.env;
const event = require(GITHUB_EVENT_PATH);
const { repository } = event;
const {
  owner: { login: owner }
} = repository;
const { name: repo } = repository;

run().catch(exitWithError);


function eslint() {
  const eslint = require('eslint');

  const cli = new eslint.CLIEngine();
  const report = cli.executeOnFiles(['.']);
  // fixableErrorCount, fixableWarningCount are available too
  const { results, errorCount, warningCount } = report;

  const levels = ['', 'warning', 'failure'];

  const annotations = [];
  for (const result of results) {
    const { filePath, messages } = result;
    const path = filePath.substring(GITHUB_WORKSPACE.length + 1);
    for (const msg of messages) {
      const { line, severity, ruleId, message } = msg;
      const annotationLevel = levels[severity];
      annotations.push({
        path,
        start_line: line,
        end_line: line,
        annotation_level: annotationLevel,
        message: `[${ruleId}] ${message}`
      })
    }
  }

  return {
    conclusion: errorCount > 0 ? 'failure' : 'success',
    output: {
      title: checkName,
      summary: `${errorCount} error(s), ${warningCount} warning(s) found`,
      annotations
    }
  }
}
function exitWithError(err) {
  console.error('Error', err.stack)
  if (err.data) {
    console.error(err.data)
  }
  process.exit(1)
}

async function run() {
  try {
    const { conclusion, output } = eslint();
    console.log(output.summary);
    if (conclusion === 'failure') {
      process.exit(78)
    }
  } catch (err) {
    exitWithError(err)
  }
}
