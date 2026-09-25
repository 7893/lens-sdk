# lens-sdk

Hybrid search utilities extracted from Lens. The package has no runtime npm
dependencies and does not connect to Lens, a database, or a cloud account.
Keyword and vector result lists are supplied by the caller.

## Build and install from source

Use Node.js 26.10.0 and npm 11.19.1, as declared in `package.json`.

```sh
git clone https://github.com/7893/lens-sdk.git
cd lens-sdk
npm ci
npm test
npm pack
```

`npm pack` builds the package and creates `7893-lens-sdk-1.0.1.tgz`; it does not
publish anything. In a separate consumer project, install that file:

```sh
npm install /absolute/path/to/7893-lens-sdk-1.0.1.tgz
```

This source/tarball route does not require a GitHub Packages token. Always install
dependencies with `npm ci`; `node_modules` is not part of the source distribution.

## Minimal consumer example

```js
const { rrfRank } = require('@7893/lens-sdk');

const results = rrfRank(
  [{ id: 'a' }, { id: 'b' }],
  [{ id: 'b', score: 0.9 }, { id: 'c', score: 0.7 }],
);
console.log(results);
```

The package provides CommonJS JavaScript and TypeScript declarations. Other
exports are `dynamicCutoff`, `normalizeScores`, `clampScores`, `buildQueryPrompt`,
`deduplicateResults`, `wrapSearchResponse`, and `paginateResults`.

## GitHub Packages distribution

The configured registry is `https://npm.pkg.github.com`, not the public npmjs
registry. A package version must actually be published there before it can be
installed by version; a Git tag or public source repository alone is insufficient.
Until a package version is available, use the tarball instructions above.

For an available version, configure the consumer's `.npmrc` as follows:

```ini
@7893:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

Supply `NODE_AUTH_TOKEN` through your environment using your own GitHub token
with package read access, then run `npm install @7893/lens-sdk@<published-version>`.
Do not put a token value in a committed file. Consumers do not need the
maintainer's token or package publishing permission. See the
[GitHub npm registry documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry).

## Validation and release boundary

Pushes and pull requests run CI without registry secrets. CI builds, tests, packs,
and installs the resulting tarball into a separate consumer directory.
Publishing is a separate maintainer operation triggered by a `v*` tag; ordinary
source pushes do not publish packages. This repository's setup changes do not
create a new registry release.
