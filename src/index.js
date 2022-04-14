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
    core.info(JSON.stringify(contributor))
    const login = contributor.login;
    if (login === sender) {
      core.info("===================")
      core.info(login)
      core.info("===================")
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

    core.info(JSON.stringify(payload))

    if (payload.event_name === "push") {
      core.info("Checking begins...");
      const userName = payload.event.commits[0].author.name;
      const owner = payload.repository_owner;
      const repoName = payload.event.repository.name;

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
    }else {
      core.warning("event type [" + payload.event_name +"] is unsupported now")
    }
  } catch (err) {
    core.setFailed(err.message);
  }

}

run();





