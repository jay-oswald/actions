const core = require('@actions/core');
const github = require('@actions/github');

(async() => {
  try{
    console.log(JSON.stringify(github));
    core.setFailed('FORCED FAIL');
  } catch(error){
    core.setFailed(error.message);
  }
})();