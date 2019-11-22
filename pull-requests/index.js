const core = require('@actions/core');
const github = require('@actions/github');

(async() => {
  try{
    console.log(github);
    core.setFailed('FORCED FAIL');
  } catch(error){
    core.setFailed(error.message);
  }
})();