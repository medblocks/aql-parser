## AQL Parser

This is a work in progress implementation of an AQL parser written in Typescript. The parser is based on the [AQL specification by openEHR](https://specifications.openehr.org/releases/QUERY/latest/AQL.html).

## Why did we start this project ?
Often times we need our customers to be able to autor AQL queries on the frontend and we need to validate them before storing them and provide useful feedback to the user. This project aims to develop into a library that be imported as a single simple JS function that can be used in the backend or frontend.

## Getting Started
As of this update this project is developmental only and is not yet ready for use.
Here is how to set it up:
#### Clone the repository
```bash
git clone https://github.com/medblocks/aql-parser
```
#### Install the dependencies
```bash
pnpm install
```
#### Run the tests
```bash
pnpm test
```

This project uses OhmJS as a parser generator. You can find the grammar in the `src/index.ts` file. The tests are located inside the `src/index.test.ts` file.