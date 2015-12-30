var gulp = require('gulp');

var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var pathmodify = require('pathmodify');

var Promise = require('bluebird');
var path = require('path');
var util = require('gulp-util');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var minimatch = require('minimatch');
var exorcist = require('exorcist');

function Bundler(options) {
  var sourcePaths = options.sourcePaths || options.sources;
  var shouldMonitorSourceChanges = options.shouldMonitorSourceChanges || options.monitorChanges || false;
  var shouldBundleVendor = options.shouldBundleVendor || options.vendor || false;
  this._shouldBundleVendor = shouldBundleVendor;
  this._shouldExtractSourceMaps = options.shouldExtractSourceMaps || options.sourceMaps || false;

  this._targetPath = options.targetPath || options.target || 'dist/public/scripts/client.js';
  this._vendorTargetPath = options.vendorTargetPath || options.vendorTarget || path.join(path.dirname(this._targetPath), 'vendor.js');
  this._shouldBundleVendorOnSourceChanges = options.shouldBundleVendorOnSourceChange || options.vendorOnChanges || false;

  this._browserSync = options.browserSync || false;

  var externalOnBundle = options.externalOnBundle || options.external || true;

  // Initialize Vendor Bundler
  var vendorBundler = browserify({ });

  // Initialize Bundler
  var browserifyConfig = Object.assign({}, shouldMonitorSourceChanges ? watchify.args : {}, {
		entries: sourcePaths,
		cache: {},
		packageCache: {},
		fullPaths: true,
		debug: true
	});

  var bundler = browserify(browserifyConfig);
  if (shouldMonitorSourceChanges) {
    util.log('Using', util.colors.grey('Watchify'));
    bundler = watchify(bundler);
  }

  bundler = bundler
    .transform(babelify.configure())
		.plugin(pathmodify)
		.on('pathmodify:resolved', function(data) {
			var requireId = data.rec.id;
			var filePath = data.file;
			if (minimatch(filePath, '**/node_modules/**')) {
        if (shouldBundleVendor) {
  				bundler.external(filePath);
  				bundler.external(requireId); // Watchify breaks without this.
  				if (!filePath.startsWith('/node_modules/')) {
  					vendorBundler.require(filePath, { expose: requireId });
  				}
        } else {
          if (externalOnBundle) {
            bundler.external(filePath);
    				bundler.external(requireId)
          }
        }
			}
		});

  this._bundler = bundler;
  this._vendorBundler = vendorBundler;

  if (shouldMonitorSourceChanges) {
    bundler = bundler
      .on('update', function(changedSourcePaths) {
        util.log('Changes detected on', util.colors.yellow(path.basename(changedSourcePaths)), 'by', util.colors.grey('Watchify'));
        this._shouldBundleVendor = this._shouldBundleVendor && this._shouldBundleVendorOnSourceChanges;
        this.bundle(this._bundleCallback);
      }.bind(this));
  }
}

Bundler.prototype.bundle = function(callback) {
  this._bundleCallback = callback || function() {  };
  this._bundle()
    .then(function() {
      var deferred = Promise.pending()
      if (this._shouldBundleVendor) {
        promise = this._bundleVendor();
      } else {
        deferred.resolve();
        promise = deferred.promise;
      }
      return promise;
    }.bind(this))
    .then(this._bundleCallback);
};

Bundler.prototype._bundle = function() {
  var targetPath = this._targetPath;

  util.log('Bundleing', util.colors.yellow(path.basename(targetPath)));
  var deferred = Promise.pending();
  var stream = this._bundler
    .bundle()
    .pipe(this._shouldExtractSourceMaps ? exorcist(targetPath + '.map') : util.noop())
    .pipe(source(path.basename(targetPath)))
    .pipe(buffer())
    .pipe(this._browserSync ? this._browserSync.stream({ once: true }) : util.noop())
    .pipe(gulp.dest(path.dirname(targetPath)))
    .on('end', function() {
      deferred.resolve();
    });
  var promise = deferred.promise;
  return promise;
};

Bundler.prototype._bundleVendor = function() {
  var vendorTargetPath = this._vendorTargetPath;
  util.log('Bundleing', util.colors.yellow(path.basename(vendorTargetPath)));
  var vendorDeferred = Promise.pending();
  var vendorStream = this._vendorBundler
    .bundle()
    .pipe(source(path.basename(vendorTargetPath)))
    .pipe(buffer())
    .pipe(gulp.dest(path.dirname(vendorTargetPath)))
    .on('end', function() {
      vendorDeferred.resolve();
    });
  var vendorPromise = vendorDeferred.promise;
  return vendorPromise;
};

function createBundler(options) {
  return new Bundler(options);
}

module.exports.createBundler = createBundler;
