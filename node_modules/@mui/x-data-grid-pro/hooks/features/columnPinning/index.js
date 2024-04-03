"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _gridColumnPinningInterface = require("./gridColumnPinningInterface");
Object.keys(_gridColumnPinningInterface).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _gridColumnPinningInterface[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _gridColumnPinningInterface[key];
    }
  });
});