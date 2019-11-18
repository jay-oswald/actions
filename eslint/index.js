const core = require('@actions/core');
const github = require('@actions/github');

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  //const payload = JSON.stringify(github.context.payload, undefined, 2)
  //console.log(`The event payload: ${payload}`);

  console.log("CONTENST: " + JSON.stringify(get_contents(github)));
} catch (error) {
  core.setFailed(error.message);
}



function get_contents(github){
  console.log("GITHUB");
  console.log(JSON.stringify(github));
  console.log("GETTING CONTENTS");
  return github.git.getTree({
    owner: github.context.payload.repository.organization,
    repo: github.context.payload.repository.name,
    tree_sha: github.context.payload.head_commit.tree_id,
    recursive: true
  })
}