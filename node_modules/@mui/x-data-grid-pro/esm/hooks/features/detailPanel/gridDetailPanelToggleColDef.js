import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { GRID_STRING_COL_DEF } from '@mui/x-data-grid';
import { GridDetailPanelToggleCell } from '../../../components/GridDetailPanelToggleCell';
import { gridDetailPanelExpandedRowIdsSelector } from './gridDetailPanelSelector';
import { jsx as _jsx } from "react/jsx-runtime";
export const GRID_DETAIL_PANEL_TOGGLE_FIELD = '__detail_panel_toggle__';
export const GRID_DETAIL_PANEL_TOGGLE_COL_DEF = _extends({}, GRID_STRING_COL_DEF, {
  type: 'custom',
  field: GRID_DETAIL_PANEL_TOGGLE_FIELD,
  editable: false,
  sortable: false,
  filterable: false,
  resizable: false,
  // @ts-ignore
  aggregable: false,
  disableColumnMenu: true,
  disableReorder: true,
  disableExport: true,
  align: 'left',
  width: 40,
  valueGetter: (value, row, column, apiRef) => {
    const rowId = apiRef.current.getRowId(row);
    const expandedRowIds = gridDetailPanelExpandedRowIdsSelector(apiRef.current.state);
    return expandedRowIds.includes(rowId);
  },
  renderCell: params => /*#__PURE__*/_jsx(GridDetailPanelToggleCell, _extends({}, params)),
  renderHeader: () => null
});