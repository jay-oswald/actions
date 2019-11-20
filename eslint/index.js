const fs = require('fs');
const glob = require('glob');
const core = require('@actions/core');
const github = require('@actions/github');


try{
  const eslint = require( 'eslint' );
  console.log(process.cwd());

  const configFilePath = process.cwd() + '/.eslintrc.js';
  const configFile = fs.existsSync(configFilePath);

  if(!configFile){
    core.setOutput("No JS Config file, no linting");
    return;
  }

  const config  = import(configFilePath);


  const cli = new eslint.CLIEngine({
    baseConfig: config
  });

  const report = cli.executeOnFiles(['.']);
  console.table(report);

  //
  // const report = cli.executeOnFiles( [ '.' ] );
  // // fixableErrorCount, fixableWarningCount are available too
  // const { results, errorCount, warningCount } = report;
  //
  // const levels = [ '', 'warning', 'failure' ];
  //
  // const annotations = [];
  // for( const result of results ) {
  //   const { filePath, messages } = result;
  //   const path = filePath.substring( process.cwd() + 1 );
  //   for( const msg of messages ) {
  //     const { line, severity, ruleId, message } = msg;
  //     const annotationLevel = levels[severity];
  //     annotations.push( {
  //       path,
  //       start_line: line,
  //       end_line: line,
  //       annotation_level: annotationLevel,
  //       message: `[${ruleId}] ${message}`
  //     } )
  //   }
  // }
  //
  // return {
  //   conclusion: errorCount > 0 ? 'failure' : 'success',
  //   output: {
  //     title: checkName,
  //     summary: `${errorCount} error(s), ${warningCount} warning(s) found`,
  //     annotations
  //   }
  // }
  core.setFailed('FORCED FAIL');
} catch(error){
  core.setFailed(error.message);
}