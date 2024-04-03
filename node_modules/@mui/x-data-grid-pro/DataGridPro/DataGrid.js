"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataGrid = DataGrid;
exports.DataGridPremium = DataGridPremium;
/**
 * @deprecated Import DataGridPro instead.
 */
function DataGrid() {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  throw new Error(["You try to import `DataGrid` from @mui/x-data-grid-pro but this module doesn't exist.", '', "Instead, you can do `import { DataGridPro } from '@mui/x-data-grid-pro'`."].join('\n'));
}

/**
 * @deprecated Import DataGridPro instead.
 */
function DataGridPremium() {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  throw new Error(["You try to import `DataGridPremium` from @mui/x-data-grid-pro but this module doesn't exist.", '', "Instead, you can do `import { DataGridPro } from '@mui/x-data-grid-pro'`."].join('\n'));
}