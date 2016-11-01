
# @varnalab/cli

[![npm-version]][npm] [![travis-ci]][travis] [![coveralls-status]][coveralls]

Install:

```bash
npm install -g @varnalab/cli
```

Help:

```bash
varnalab --help
```

Currenlty works only with Node v4.x:

```bash
nvm use 4
```

Execute a command:

```bash
varnalab [command] --help
```

---

# varnalab-whois

Help:

```bash
varnalab-whois --help
```

Mikrotik config file format:

```js
{
  "development": {
    "host": "", "user": "", "pass": "", "port": 5000
  },
  "staging": {
    // ...
  },
  "production": {
    // ...
  }
}
```

Basic usage:

```bash
varnalab-whois --config [file]
```

Crontab configuration:

```bash
*/10 * * * * NODE_ENV=production varnalab-whois --config [file] --output slack > /nginx/serve/location/varnalab-whois.json
```

---


  [npm-version]: http://img.shields.io/npm/v/@varnalab/cli.svg?style=flat-square (NPM Package Version)
  [travis-ci]: https://img.shields.io/travis/VarnaLab/varnalab-cli/master.svg?style=flat-square (Build Status - Travis CI)
  [coveralls-status]: https://img.shields.io/coveralls/VarnaLab/varnalab-cli.svg?style=flat-square (Test Coverage - Coveralls)

  [npm]: https://www.npmjs.com/package/@varnalab/cli
  [travis]: https://travis-ci.org/VarnaLab/varnalab-cli
  [coveralls]: https://coveralls.io/github/VarnaLab/varnalab-cli
