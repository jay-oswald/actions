const core = require('@actions/core');
const github = require('@actions/github');

(async() => {
  try{
    console.log(JSON.stringify(github));
    core.setFailed('FORCED FAIL');

    const context = github.context;

    if(context.eventName !== 'pull_request'){
      core.setFailed('Action should only be run on Pull Requests');
      return;
    }

    const target_branch = context.payload.pull_request.base.ref;
    const source_branch = context.payload.pull_request.head.ref;
    if(target_branch !== 'master' && target_branch !== 'dev' && !target_branch.includes('staging')){
      console.log('Not running on target branch, is not master, dev or staging');
      return;
    }

    if(target_branch === 'master' && !target_branch.includes('staging')){
      core.setFailed("Can Not deploy to master from a non-staging branch");
      return;
    }

    if(target_branch.includes('staging') && (source_branch !== 'dev' || !source_branch.includes('staging'))){
      core.setFailed("Can not deploy to staging from any branches except dev and staging");
      return;
    }

    const token = core.getInput('token');
    const github_api = new github.Github(token);

    const pull_request = await github_api.pulls.get({
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


  } catch(error){
    core.setFailed(error.message);
  }
})();