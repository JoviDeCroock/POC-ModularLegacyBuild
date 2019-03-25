'use strict';

const path = require('path');
const fs = require('fs');

const ID = 'ModernResolverPlugin';

const defaultIgnoredModules = ['core-js'];

class ModernResolverPlugin {

  constructor({ ignoredModules = [], syntaxTarget = 'esmodules' } = {}) {
    this.cache = {};
    this.target = syntaxTarget;
    this.ignoredModules = [...defaultIgnoredModules, ...ignoredModules];
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
    const nodeModulesPath = path.resolve(`${process.cwd()}/node_modules/`);
    if (this.ignoredModules.includes(moduleName) || this.ignoredModules.includes(moduleName.split('/')[0])) return false;
    if (moduleName.startsWith('./') || moduleName.startsWith('../') || moduleName.includes('.modern')) return false;
    if (this.exists === undefined || this.exists) {
      if (this.cache[moduleName]) return this.cache[moduleName];
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
      // Get pkg.json
      const pkg = moduleContents.find((name) => name === 'package.json');
      if (!pkg)  return false;
      const fields = JSON.parse(fs.readFileSync(path.resolve(nodeModulesPath, moduleName, 'package.json')));
      if (!fields.syntax) return false
      if (!fields.syntax[this.target]) return false;
      this.cache[moduleName] = path.resolve(nodeModulesPath, moduleName, fields.syntax.esmodules);
      return path.resolve(nodeModulesPath, moduleName, fields.syntax.esmodules);
    }
  }
}

module.exports = ModernResolverPlugin;
