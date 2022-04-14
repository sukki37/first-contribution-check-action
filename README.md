# First Contribution Check Action

This action checks if the author of the last commit is a new contributor of a repository.

## Usage

### Pre-requisites

Create a workflow .yml file in your repositories .github/workflows directory.

### Outputs

#### `isNewContributor`

flag for filtering merged pull requests from first-time contributors.


## Getting Started

If you're new to actions, add these to your .github/workflows/main.yml file. If this file does not exist, create one.

```yml
on:
  push:
    branches:
        - main

jobs:
  contrib-readme-job:
    runs-on: ubuntu-latest
    name: A job to find if a commitor is new to contribute.
    steps:
      - name: First Contribution Check
        uses: sukki37/first-contribution-check-action@v1.0.0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - name: Print Output of Previous Step
        run: |
          echo 'first-check output is ${{ steps.first-check.outputs.is_new_contributor }}'
```

That's it!

To add it to your to your existing workflow, append this to your current `.yml` workflow script.

```yml
uses: sukki37/first-contribution-check-action@v1.0.0
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
