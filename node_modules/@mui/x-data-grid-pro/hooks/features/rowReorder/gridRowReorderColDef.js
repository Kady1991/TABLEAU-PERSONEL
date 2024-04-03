"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GRID_REORDER_COL_DEF = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _xDataGrid = require("@mui/x-data-grid");
var _GridRowReorderCell = require("../../../components/GridRowReorderCell");
const GRID_REORDER_COL_DEF = exports.GRID_REORDER_COL_DEF = (0, _extends2.default)({}, _xDataGrid.GRID_STRING_COL_DEF, {
  type: 'custom',
  field: '__reorder__',
  sortable: false,
  filterable: false,
  width: 50,
  align: 'center',
  headerAlign: 'center',
  disableColumnMenu: true,
  disableExport: true,
  disableReorder: true,
  resizable: false,
  // @ts-ignore
  aggregable: false,
  renderHeader: () => ' ',
  renderCell: _GridRowReorderCell.renderRowReorderCell
});