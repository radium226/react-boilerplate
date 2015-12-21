#!/usr/bin/env node

// Promises
import Promise from 'bluebird';

// Server-side rendering
import Renderer from './server/renderer';

// Argument parsing
import getopt from 'node-getopt';

// React, Redux, Router, etc.
import createRoutes from './routes';
import { HistoryStrategy } from './history';
import createStore from './store';
import messages from './messages.js';

// Filesystem & Process
import * as process from 'process';
import * as fs from 'fs';
const writeFile = Promise.promisify(fs.writeFile);

// Exit codes
const ExitCode = {
  SUCCES: 0,
  FAILURE: 1,
};

// Let's go!
const args = getopt
  .create([])
  .parseSystem()
  .argv;

const path = args[0];
console.log('path = ' + path);
const file = args[1];
console.log('file = ' + file);

const routes = createRoutes();
const clientHistoryStrategy = HistoryStrategy.HASH;
const store = createStore();
const initialState = store.getState();

const renderer = new Renderer({
  routes,
  clientHistoryStrategy,
  store,
  initialState,
  messages,
});

const promise = renderer.render(path)
  .then(result => {
    if (result.content) {
      writeFile(file, result.content);
    }
  })
  .then(() => ExitCode.SUCCESS)
  .catch((error) => {
    console.log(error);
    return ExitCode.FAILURE;
  });
const exitCode =  promise.return();
console.log('exitCode =  ' + exitCode);
//process.exit(exitCode);
