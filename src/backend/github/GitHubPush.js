import { GitHubAPI } from "./gh_api"

export async function forkAndCommit(credentials, new_content, pr_options) {
  const api = new GitHubAPI(credentials);
  const { title, body, commit_msg } = pr_options;
  const base_repo = api.gh.getRepo('milltoni', 'Programming-Languages-Yaml');

  await base_repo.fork();

  api.setRepo(credentials.username, 'Programming-Languages-Yaml');
  await api.setBranch('main');
  await api.pushFiles(commit_msg, [{ content: new_content, path: 'languages.yml' }]);

  const options = {
    title,
    head: `${credentials.username}:main`,
    base: 'main',
    body
  };
  const pr = await base_repo.createPullRequest(options);
  return { commited: true, pr };
}