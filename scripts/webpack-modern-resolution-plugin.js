'use strict';

const path = require('path');
const fs = require('fs');

const ID = 'ModernResolverPlugin';

class ModernResolverPlugin {

  constructor() {
    this.cache = {};
  }

  apply(resolver) {
    resolver.getHook('describedResolve').tapAsync(ID, (request, context, callback) => {
      const modernPath = this.resolveModulePath(request.request);
      if (modernPath) {
        return resolver.doResolve(
          // Continue in the resolve hook.
          resolver.getHook("resolve"),
          // Take our new request!
          { ...request, request: modernPath },
          // Give a descriptive text in case of errors.
          `resolve ${request.request} to ${modernPath}`,
          // Pass our context on.
          context,
          // Callback time!!!
          (err, result) => {
            // Oh we have an error this is not well, exit the process.
            if (err) callback(err);
            // Prevent resolving twice (undefiend result), this is done
            // by calling our callback with two null values
            if (result === undefined) return callback(null, null);
            // If we want to use this result call it with no error but  a result!
            callback(null, result);
          }
        );
      }
      // There is no modern path just continue.
      return callback();
    });
  }

  resolveModulePath(moduleName) {
    // TODO: replace process.cwd() with a cleaner alternative.
    const nodeModulesPath = path.resolve(`${process.cwd()}/node_modules/`);
    if (this.exists === undefined || this.exists) {
      // does our node_moduels path exist?
      this.exists = fs.existsSync(nodeModulesPath);
      if (!this.exists) return false;
      // Get all our modules.
      const contents = fs.readdirSync(nodeModulesPath);
      // See if our request name exists.
      const moduleExists = contents.find((name) => name === moduleName);
      if (!moduleExists) return false;
      // Get the files from the libraray
      const moduleContents = fs.readdirSync(path.resolve(nodeModulesPath, moduleName));
      let distName = 'dist';
      let distExists = moduleContents.find((name) => name === distName);
      if (!distExists) {
        // If dist does not exist try lib.
        distName = 'lib';
        distExists = moduleContents.find((name) => name === distName);
        if (!distExists) return false;
      };
      // get the contents of our dist/lib.
      const distContents = fs.readdirSync(path.resolve(nodeModulesPath, moduleName, distName));
      // If it has a .modern that's not a source-map then we go!
      const hasModern = distContents.find((name) => name.includes('modern') && !name.includes('map'));
      if (!hasModern) return false;
      return path.resolve(nodeModulesPath, moduleName, distName, hasModern);
    }
  }
}

module.exports = ModernResolverPlugin;
