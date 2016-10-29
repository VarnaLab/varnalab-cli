
# @varnalab/cli

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
*/10 * * * * NODE_ENV=production varnalab-whois --config [file] --slack > /nginx/serve/location/varnalab-whois.json
```

---
