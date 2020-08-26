# Otter CLI

A command line tool for [`ottermator`](https://github.com/TotalTechGeek/Otter).

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)

## Creating a new Otter project

Install ottermator as a global package using npm

```bash
npm install ottermator -g
```

or using yarn

```bash
yarn global add ottermator
```

Then run

```bash
otter init
```

and follow the prompts to initialize a project installing the required dependencies and your initial `config.json`.

## Building an Otter project

Running the command

```bash
otter build
```

will build out your files from the `config.json` located in the current directory.
