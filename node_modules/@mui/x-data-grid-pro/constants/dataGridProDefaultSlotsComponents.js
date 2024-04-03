"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DATA_GRID_PRO_DEFAULT_SLOTS_COMPONENTS = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _internals = require("@mui/x-data-grid/internals");
var _GridProColumnMenu = require("../components/GridProColumnMenu");
var _GridColumnHeaders = require("../components/GridColumnHeaders");
var _GridHeaderFilterMenu = require("../components/headerFiltering/GridHeaderFilterMenu");
var _GridHeaderFilterCell = require("../components/headerFiltering/GridHeaderFilterCell");
var _GridDetailPanels = require("../components/GridDetailPanels");
var _GridPinnedRows = require("../components/GridPinnedRows");
var _material = _interopRequireDefault(require("../material"));
const DATA_GRID_PRO_DEFAULT_SLOTS_COMPONENTS = exports.DATA_GRID_PRO_DEFAULT_SLOTS_COMPONENTS = (0, _extends2.default)({}, _internals.DATA_GRID_DEFAULT_SLOTS_COMPONENTS, _material.default, {
  columnMenu: _GridProColumnMenu.GridProColumnMenu,
  columnHeaders: _GridColumnHeaders.GridColumnHeaders,
  detailPanels: _GridDetailPanels.GridDetailPanels,
  headerFilterCell: _GridHeaderFilterCell.GridHeaderFilterCell,
  headerFilterMenu: _GridHeaderFilterMenu.GridHeaderFilterMenu,
  pinnedRows: _GridPinnedRows.GridPinnedRows
});