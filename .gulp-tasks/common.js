var browserify = require('browserify');
var babelify = require('babelify');
var _ = require('lodash');
var watchify = require('watchify');
var notifier = require('node-notifier');
var path = require('path');

// Create Browserify instance
function createBundler(config, watch) {
  var watch = watch || false;
  var config = watch ? Object.assign({}, watchify.args, config) : config;
  var bundler = (watch ? watchify(browserify(config)) : browserify(config))
    .transform(babelify.configure());

  return bundler;
}

function notify(message) {
  var icon = path.join(__dirname, 'analyevent.png');
  notifier.notify({
    icon: icon,
    title: 'Radium',
    message: message
  });
}

// List all client dependencies
function listClientDependencies() {
  var packageManifest = require('../package.json');
  var allDependencies = Object.keys(packageManifest.dependencies);
  var serverOnlyDependencies = packageManifest.serverOnlyDependencies;
  var clientDependencies = _.difference(allDependencies, serverOnlyDependencies);
  return clientDependencies;
}

// List all server dependencies
function listServerDependencies() {
  var packageManifest = require('../package.json');
  var allDependencies = Object.keys(packageManifest.dependencies);
  var clientOnlyDependencies = packageManifest.clientOnlyDependencies;
  var serverDependencies = _.difference(allDependencies, clientOnlyDependencies);
  return serverDependencies;
}

module.exports.createBundler = createBundler;
module.exports.listClientDependencies = listClientDependencies;
module.exports.listServerDependencies = listServerDependencies;
module.exports.notify = notify;
