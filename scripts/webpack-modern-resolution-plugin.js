'use strict';

const path = require('path');
const fs = require('fs');

class ModernResolverPlugin {

  constructor() {
    this.cache = {};
  }

  apply(resolver) {
    resolver.getHook('module').tap("ModernResolverPlugin", (request, callback) => {
      if (request.request === 'hooked-form') {
        const modernPath = this.resolveModulePath(request.request);
        if (modernPath) {
          const obj = {
            directory: request.directory,
            path: request.path,
            query: request.query,
            request: modernPath,
          };
          resolver.doResolve("resolve", obj, `resolve ${request.request} to ${resolvedComponentPath}`, callback);
        }
      }
    });
  }

  resolveModulePath(moduleName) {
    const nodeModulesPath = path.resolve(`${process.cwd()}/node_modules/`);
    if (this.exists === undefined) {
      this.exists = fs.existsSync(nodeModulesPath);
      if (this.exists) {
        const contents = fs.readdirSync(nodeModulesPath);
        const moduleExists = contents.find((name) => name === moduleName);
        const moduleContents = fs.readdirSync(path.resolve(nodeModulesPath, moduleName));
        const distExists = moduleContents.find((name) => name === 'dist');
        const distContents = fs.readdirSync(path.resolve(nodeModulesPath, moduleName, 'dist'));
        const hasModern = distContents.find((name) => name.includes('modern') && !name.includes('map'));
        return path.resolve(nodeModulesPath, moduleName, 'dist', hasModern);
      }
    }
  }
}

module.exports = ModernResolverPlugin;
