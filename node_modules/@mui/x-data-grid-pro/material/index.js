"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _icons = require("./icons");
const iconSlots = {
  columnMenuPinRightIcon: _icons.GridPushPinRightIcon,
  columnMenuPinLeftIcon: _icons.GridPushPinLeftIcon
};
const materialSlots = (0, _extends2.default)({}, iconSlots);
var _default = exports.default = materialSlots;