"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
class ModuleLoader {
    constructor(folder) {
        this.folder = folder;
    }
    collectExports(file) {
        let func, include, _results;
        if (path.extname(file) === '.js' && file !== 'index.js') {
            include = require('./' + file);
            _results = [];
            for (func in include) {
                if (!__hasProp.call(include, func))
                    continue;
                _results.push(exports[func] = include[func]);
            }
            return _results;
        }
    }
}
exports.ModuleLoader = ModuleLoader;
