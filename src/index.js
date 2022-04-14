const core = require('@actions/core');
const github = require('@actions/github');
const accessToken = process.env['GITHUB_TOKEN'];
async function isFirstContribution(
  client, owner, repo,
  sender, 
  page = 1
) {
  const { status, data: contributors } = await client.repos.listContributors({
    owner: owner,
    repo: repo,
    per_page: 100,
    page: page,
    state: 'all'
  });

  if (status !== 200) {
    throw new Error(`Received unexpected API status code ${status}`);
  }

  if (contributors.length === 0) {
    return true;
  }

  for (const contributor of contributors) {
    
    const login = contributor.login;
    if (login === sender) {
      core.info("===================")
      core.info(JSON.stringify(contributor))
      core.info("===================")
      if (contributor.contributions == 1 ) {
        return true;
      }
      return false;
    }
  }

  return await isFirstContribution(
    client,
    owner,
    repo,
    sender,
    page + 1
  );
}


async function run() {
  try {
    const payload = github.context.payload;
    const githubClient = github.getOctokit(accessToken);
    core.info("Request received");
    const userName = payload.commits[0].author.username;
    const owner = payload.repository.owner.login;
    const repoName = payload.repository.name;

    core.info("head_commit.author.username is " + userName);

    const isFirst = await isFirstContribution(
      githubClient, owner, repoName,
      userName
    );
    
    if (isFirst) {
      core.info("First Successful PR");;
    }else {
      core.info("Not First Successful PR");
    }
    core.setOutput('isNewContributor', isFirst);
   
  } catch (err) {
    core.setFailed(err.message);
  }

}

run();





