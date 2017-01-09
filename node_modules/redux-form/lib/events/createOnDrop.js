'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createOnDragStart = require('./createOnDragStart');

var createOnDrop = function createOnDrop(name, change) {
  return function (event) {
    change(name, event.dataTransfer.getData(_createOnDragStart.dataKey));
  };
};
exports.default = createOnDrop;