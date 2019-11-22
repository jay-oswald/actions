const core = require('@actions/core');
const Octokit = require("@octokit/rest");

(async() => {
  try{
    const context = github.context;

    if(context.eventName !== 'pull_request'){
      core.setFailed('Action should only be run on Pull Requests');
      return;
    }

    const target_branch = context.payload.pull_request.base.ref;
    const source_branch = context.payload.pull_request.head.ref;

    console.log(`You are wanting to merge from ${source_branch} to ${target_branch} `);

    if(target_branch !== 'master' && target_branch !== 'dev' && !target_branch.includes('staging')){
      console.log('Not running on target branch, is not master, dev or staging');
      return;
    }

    if(target_branch === 'master' && !target_branch.includes('staging')){
      core.setFailed("Can Not deploy to master from a non-staging branch");
      return;
    }

    if(target_branch.includes('staging') && source_branch !== 'dev' && !source_branch.includes('staging')){
      core.setFailed("Can not deploy to staging from any branches except dev and staging");
      return;
    }

    const token = core.getInput('token');
    const octokit = Octokit({
      auth: token
    });

    const pull_request = await octokit.pulls.get({
      owner: context.pull_request.head.repo.owner.login,
      repo: context.pull_request.head.repo.name,
      pull_number: context.pull_request.number,
    });

    console.log(JSON.stringify(pull_request));


    const review_teams = context.payload.pull_request.requested_teams;
    const review_people = context.payload.pull_request.requested_reviewers;
    if(review_teams.length + review_people === 0){
      //TODO request reviews
    }

    core.setFailed('FORCED FAIL');

  } catch(error){
    core.setFailed(error.message);
  }
})();