/* eslint-disable */
const webpack = require('webpack');
const fs = require('fs');
const archiver = require('archiver');
const jsonfile = require('jsonfile');
const webpackConfig = require('../webpack.config');
const SOURCE_DIR = './src';
const BUILD_SOURCE_DIR = './dist';
const TARGET_DIR = './artifacts';
const bumpVersion = process.argv.slice(2)[0] === '--increment';

/**
 * Increment extension version in manifest json
 * @returns {Promise}
 */
const bumpManifestVersion = () =>
  new Promise((resolve, reject) => {
    const manifestFile = `${SOURCE_DIR}/manifest.json`;
    jsonfile.readFile(manifestFile, (err, manifest) => {
      if (err) {
        return reject('Cannot read manifest json', err);
      }
      // On each build update path version in manifest
      let [MAJOR, MINOR, PATCH] = manifest.version.split('.');
      const nextVersion = `${MAJOR}.${MINOR}.${++PATCH}`;
      console.log(
        `Old version ${manifest.version}, new version ${nextVersion}`,
      );
      manifest.version = nextVersion;
      jsonfile.writeFile(manifestFile, manifest, { spaces: 2 }, err => {
        if (err) {
          reject('Cannot write new manifest file for FF ', err);
        }
        resolve(manifest);
      });
    });
  });
/**
 * Bundle extension source code by webpack
 * @returns {Promise}
 */
const buildExtension = manifest =>
  new Promise((resolve, reject) => {
    webpack(webpackConfig).run((err, stats) => {
      if (err) {
        return reject(err);
      }
      console.log(
        stats.toString({
          colors: true,
          timings: true,
          chunks: false,
        }),
      );
      resolve(manifest);
    });
  });

/**
 * Pack extension. For firefox in xpi, for chrome in crx
 * @returns {Promise}
 */
const packExtension = manifest =>
  new Promise((resolve, reject) => {
    if (!fs.existsSync(TARGET_DIR)) {
      fs.mkdirSync(TARGET_DIR);
    }
    const output = fs.createWriteStream(
      `${TARGET_DIR}/Skillful_${manifest.version}.zip`,
    );
    const archive = archiver.create('zip');
    output.on('close', resolve);
    archive.on('error', err => {
      console.log(`Error occur on packing chrome extension , ${err}`);
      return reject(err);
    });
    archive.pipe(output);
    archive.directory(BUILD_SOURCE_DIR, false).finalize();
  });

if (bumpVersion) {
  bumpManifestVersion()
    .then(buildExtension)
    .then(packExtension)
    .then(() => console.log('SUCCESS BUILD'))
    .catch(err => console.log('ERROR', err));
} else {
  buildExtension().then(packExtension);
}
